//package sim;

//import java.util.Map.Entry;

//import org.apache.commons.math3.distribution.PoissonDistribution;

class Liver {
    constructor(body_) {
        this.body = body_;
        this.glycogen = 100000.0; // equivalent of 100g of glucose
        this.glycogenMax_ = 120000.0; // 120 g of glucose

        // Frayn Chapter 9

        // 5 micromol per kg per minute = 5*180.1559/1000 mg per kg per minute = 0.9007795 mg per kg per minute (ref: Gerich paper)
        // default max glycogen breakdown rate is 10 micromol per kg per minute
        this.glycogenToGlucose_ = 5.5 * 0.1801559;
        this.glucoseToGlycogen_ = 33.0 * 0.1801559; // for now

        //Gerich paper: Liver consumes 1.65 micromol per kg per minute to 16.5 micromol per kg per minute of glucose depending upon post-absorptive/post-prandial state.
        this.glycolysisMin_ = 0.35 * 0.1801559;//mg per kg per minute
        this.glycolysisMax_ = 0.35 * 10 * 0.1801559;
        this.glycolysisToLactateFraction_ = 1; // by default glycolysis just generates all lactate

        // 2.5 micromol per kg per minute = 2.5*180.1559/1000 mg per kg per minute = 0.45038975 mg per kg per minute
        // default gng rate is 5 micromol per kg per minute
        this.micromol = 0.1801559;
        this.gngFromLactate_ = 0.42 * 2.0 * this.micromol; 
        this.gngFromGlycerol_ = 0.42 * 0.5 * this.micromol; 
        this.gngFromGlutamine_ = 0.42 * 0.5 * this.micromol; 
        this.gngFromAlanine_ = 0.42 * 1.0 * this.micromol; 

        this.glucoseToNEFA_ = 0;

        this.fluidVolume_ = 10; //dl
        this.glucose = 100 * this.fluidVolume_; // assuming glucose concentration to be 100mg/dl

        this.Glut2Km_ = 20*180.1559/10.0; // mg/deciliter equal to 20 mmol/l (Frayn Table 2.2.1)
        this.Glut2VMAX_ = 50; //mg per kg per minute
        
        
        this.absorptionPerTick = 0;
        this.toGlycogenPerTick = 0;
        this.fromGlycogenPerTick = 0;
        this.glycolysisPerTick = 0;
        this.gngPerTick = 0;
        this.releasePerTick = 0;
    }
    
    erf(x){
        // erf(x) = 2/sqrt(pi) * integrate(from=0, to=x, e^-(t^2) ) dt
        // with using Taylor expansion, 
        //        = 2/sqrt(pi) * sigma(n=0 to +inf, ((-1)^n * x^(2n+1))/(n! * (2n+1)))
        // calculationg n=0 to 50 bellow (note that inside sigma equals x when n = 0, and 50 may be enough)
        var m = 1.00;
        var s = 1.00;
        var sum = x * 1.0;
        for(var i = 1; i < 50; i++){
            m *= i;
            s *= -1;
            sum += (s * Math.pow(x, 2.0 * i + 1.0)) / (m * (2.0 * i + 1.0));
        }  
        return 2 * sum / Math.sqrt(3.14159265358979);
    }
    
    processTick() {
    	var baseBGL = this.body.blood.getBGL();
        var x;  // to hold the random samples
       
        var glycogenToGlucose__ = poissonProcess.sample(1000.0 * this.glycogenToGlucose_);
        
        var glucoseToGlycogen__ = poissonProcess.sample(1000.0 * this.glucoseToGlycogen_);
        
        var glycolysisMin__ = poissonProcess.sample(1000.0 * this.glycolysisMin_);
        
        var gngFromLactate__ = poissonProcess.sample(1000.0 * this.gngFromLactate_);
        
        var gngFromGlycerol__ = poissonProcess.sample(1000.0 * this.gngFromGlycerol_);
        
        var gngFromGlutamine__ = poissonProcess.sample(1000.0 * this.gngFromGlutamine_);
        
        var gngFromAlanine__ = poissonProcess.sample(1000.0 * this.gngFromAlanine_);
        
        var Glut2VMAX__ = poissonProcess.sample(1000.0 * this.Glut2VMAX_);
       

        var glInPortalVein = this.body.portalVein.getConcentration();
        var glInLiver  =  this.glucose/this.fluidVolume_;      

        if( glInLiver < glInPortalVein ) {

            var diff = glInPortalVein - glInLiver;
            x = Glut2VMAX__;
            x *= this.body.bodyWeight_ / 1000;
            
            var g = x * diff/(diff + this.Glut2Km_);
            
            if( g > this.body.portalVein.getGlucose() ) {
                //console.log("Trying to absorb more glucose from portal vein than what is present there! " + g + " " + this.body.portalVein.getGlucose());
                g = this.body.portalVein.getGlucose();
            }
            
            this.body.portalVein.removeGlucose(g);
            this.glucose += g;
            this.absorptionPerTick = g;
            
            //this.body.time_stamp();
            //console.log("Liver absorbs from portal vein " + g + "mg");
        }
        
        this.body.portalVein.releaseAllGlucose();

        var scale = this.body.insulinImpactOnGlycogenSynthesisInLiver();
        scale *= this.body.liverGlycogenSynthesisImpact_;


        x = glucoseToGlycogen__;
        var toGlycogen = scale * x * (this.body.bodyWeight_)/ 1000.0;
        
        if( toGlycogen > this.glucose ){
            toGlycogen = this.glucose;
        }
        
        if( toGlycogen > 0 )
        {
            this.glycogen += toGlycogen;
        }
        
        this.toGlycogenPerTick = toGlycogen;
        
        if( this.glycogen > this.glycogenMax_ )
        {
            this.body.adiposeTissue.lipogenesis(this.glycogen - this.glycogenMax_);
            this.glycogen = this.glycogenMax_;
        }
        
        this.glucose -= toGlycogen;
        
        //console.log("After glycogen synthesis in liver, liver glycogen " + this.glycogen + " mg, live glucose " + this.glucose + " mg");
        
        //glycogen breakdown (depends on insulin and glucose level)
        
        scale = this.body.liverGlycogenBreakdownImpact_;
        scale *= this.body.insulinImpactOnGlycogenBreakdownInLiver();
        
        x = glycogenToGlucose__;/////////////////////Need to change this

        var fromGlycogen = scale * x * (this.body.bodyWeight_ )/ 1000.0;
                   
        
        if( fromGlycogen > this.glycogen ){
            fromGlycogen = this.glycogen;
        }
        
        if( fromGlycogen > 0 )
        {
            this.glycogen -= fromGlycogen;
            this.glucose += fromGlycogen;
        }
        
        this.fromGlycogenPerTick = fromGlycogen;
        
        
        x = glycolysisMin__/1000.0;
        
        var toGlycolysis = this.body.glycolysis(x, this.glycolysisMax_);
        
        if( toGlycolysis > this.glucose){
            toGlycolysis = this.glucose;
        }
        
        this.glucose -= toGlycolysis;
        this.body.blood.lactate += toGlycolysis * this.glycolysisToLactateFraction_;
        this.glycolysisPerTick = toGlycolysis;
            
        scale = this.body.insulinImpactOnGNG();
        
        var gng = gngFromGlycerol__ + gngFromGlutamine__+ gngFromAlanine__; 

        gng *= scale * this.body.bodyWeight_ * this.body.gngImpact_ /1000.0;
        
        if( gng > 0 )
        {
            this.glucose += gng;
            //
            //this.body.time_stamp();
            //console.log("gng in liver " + gng + "mg");
        }
        
        this.gngPerTick = gng;

         //Gluconeogenesis will occur even in the presence of high insulin in proportion to lactate concentration. 

        gng = gngFromLactate__;////////////////////////
        gng *= scale * this.body.bodyWeight_ * this.body.gngImpact_ /1000.0;
        gng = this.body.blood.consumeGNGSubstrates(gng);

        
        if(gng > 0)
        {
            this.glucose += gng;
            //this.body.time_stamp();
            //console.log("gng in liver from high lactate " + x + "mg");
        }
        
        this.gngPerTick += gng;
        
        this.body.portalVein.releaseAminoAcids();
            
        glInLiver = this.glucose / this.fluidVolume_;
        
        var bgl = this.body.blood.getBGL();
        
       
        
        if( glInLiver > bgl )
        {
            var diff = glInLiver - bgl;
            x = Glut2VMAX__;
            x *= this.body.bodyWeight_ / 1000;
            var g = x*diff/(diff + this.Glut2Km_);

            if( g > this.glucose )
            {
                console.log("Releasing more glucose to blood than what is present in liver!");
                throw new Error("There is some error");
            }

            this.glucose -= g;
            this.body.blood.addGlucose(g);
            this.releasePerTick = g;
            //this.body.time_stamp();
            //console.log("Liver released glucose " + g + "mg to blood");
        }
        
        this.body.time_stamp();
        console.log("Liver:: Absorption " + this.absorptionPerTick);
        
        this.body.time_stamp();
        console.log("Liver:: ToGlycogen " + this.toGlycogenPerTick);
        
        this.body.time_stamp();
        console.log("Liver:: FromGlycogen " + this.fromGlycogenPerTick);
        
        this.body.time_stamp();
        console.log("Liver:: glycogen " + this.glycogen);
        
        this.body.time_stamp();
        console.log("Liver:: Glycolysis " + this.glycolysisPerTick);
        
        this.body.time_stamp();
        console.log("Liver:: GNG " + this.gngPerTick);
        
        this.body.time_stamp();
        console.log("Liver:: Release " + this.releasePerTick);
    }
    
    setParams() {
            for(var [key, value] of this.body.metabolicParameters.get(this.body.bodyState.state).get(BodyOrgan.LIVER.value).entries()) {    		
                switch (key) {
    			case "fluidVolume_" : { this.fluidVolume_ = key; break; }
    			case "normalGlucoseLevel_" : { this.normalGlucoseLevel_ = key; break; }
    			case "Glut2Km_" : { this.Glut2Km_ = key; break; }
    			case "Glut2VMAX_" : { this.Glut2VMAX_ = key; break; }
    			case "glucoseToGlycogen_" : { this.glucoseToGlycogen_ = key; break; }
    			case "glycogenToGlucose_" : { this.glycogenToGlucose_ = key; break; }
    			case "glycolysisMin_" : { this.glycolysisMin_ = key; break; }
    			case "glycolysisMax_" : { this.glycolysisMax_ = key; break; }
    			case "glycolysisToLactateFraction_" : { this.glycolysisToLactateFraction_ = key; break; }
    			case "gluconeogenesisRate_" : { this.gluconeogenesisRate_ = key; break; }
    			case "gngFromLactateRate_" : { this.gngFromLactateRate_ = key; break; }
    			case "glucoseToNEFA_" : { this.glucoseToNEFA_ = key; break; }
    		}
    	}
    }
}

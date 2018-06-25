//package sim;
//import java.util.Map.Entry;

//import org.apache.commons.math3.distribution.PoissonDistribution;

class Kidney {
    constructor(myBody){
    	this.body = myBody;
        
        this.glutamineConsumed_ = 0;
        this.micromol = 0.1801559;

        this.gngFromLactate_ = 0.42 * 1.1 * this.micromol;
        this.gngFromGlycerol_ = 0.42 * 0.5 * this.micromol;
        this.gngFromGlutamine_ = 0.42 * 0.5 * this.micromol;
        this.gngFromAlanine_ = 0.42 * 0.1 * this.micromol;

        //Gerich: insulin dependent: 1 to 5 micromol per kg per minute
        this.glycolysisMin_ = 0.35 * 0.5 * 0.1801559; // mg per kg per minute
        this.glycolysisMax_ = 0.35 * 2.0 * 0.1801559;
        
        this.reabsorptionThreshold_ = 11*180.1559/10; //mg/dl equivalent of 11 mmol/l
        this.glucoseExcretionRate_ = 100/(11*180.1559/10); // mg per minute per(mg/dl)
        // As BGL increases from 11 mmol/l to 22 mmol/l, glucose excretion in urine increases from 0 to mg/min to 100mg/min.
        
        this.glucoseAbsorptionPerTick = 0;
        this.releasePerTick = 0;
        this.glycolysisPerTick = 0;
        this.gngPerTick = 0;
        this.excretionPerTick = 0;
        this.totalExcretion = 0;

    }
    
    processTick() {
        var x; // to hold the random samples
        
        //x = this.body.bodyWeight_;
        
        var glucoseExcretionRate__ = this.body.sample(1000.0 * this.glucoseExcretionRate_);
        
        var glycolysisMin__ = this.body.sample(1000.0 * this.glycolysisMin_);
        
        var gngFromLactate__ = this.body.sample(1000.0 * this.gngFromLactate_);
        
        var gngFromGlycerol__ = this.body.sample(1000.0 * this.gngFromGlycerol_);
        
        var gngFromGlutamine__ = this.body.sample(1000.0 * this.gngFromGlutamine_);
        
        var gngFromAlanine__ = this.body.sample(1000.0 * this.gngFromAlanine_);


        
        
        //myegine is suppose to be called, not poissonProcess
        //x = poissonProcess.sample(x*this.glycolysisMin_);
        
        x = glycolysisMin__ / 1000.0;
        
        
        var toGlycolysis = this.body.glycolysis(x, this.glycolysisMax_);
        this.body.blood.removeGlucose(toGlycolysis);
        this.body.blood.lactate += toGlycolysis;
        this.glucoseAbsorptionPerTick = toGlycolysis;
        this.glycolysisPerTick = toGlycolysis;
        
        var scale = this.body.insulinImpactOnGNG();

        var gng = gngFromGlycerol__ + gngFromGlutamine__+ gngFromAlanine__;
        gng *= scale * (this.body.gngImpact_) * (this.body.bodyWeight_)/1000.0;

        if(gng > 0){
            this.gngPerTick = gng;
        }
        //gluconeogenesis. Depends on insulin level and on substrate concentration.
    
        //4. release some glucose by consuming lactate/alanine/glycerol (gluconeogenesis)(the amount depends on body state and the concentration of lactate/alanine/glycerol in blood; when insulin is high (fed state) glycolysis is favored and when glucagon high (compared to insulin; starved state) gluconeogenesis is favored)
       
        
        
        gng  = gngFromLactate__ /1000.0;
        gng  *= scale * (this.body.gngImpact_) * (this.body.bodyWeight_)/1000.0;
        gng = this.body.blood.consumeGNGSubstrates(gng);
       
        if(gng > 0){
            this.gngPerTick += gng;
            //this.body.time_stamp();
            //console.log("GNG in Kidneys " + gng + "mg");
        }
        
        this.body.blood.addGlucose(this.gngPerTick);
        this.releasePerTick = this.gngPerTick;

        /*
        x = gngFromLactateRate__/1000.0;

        x *= this.body.bodyWeight_ ;

        x = this.body.blood.gngFromHighLactate(x);
        console.log("///////////////////////////////" + x);

        
        if(x > 0){
            this.glucose += x;
            
            //this.body.time_stamp();
            //console.log("GNG from lactate in Kidneys " + x + "mg");
        }
        
        this.gngPerTick += x;

        //console.log("After GNG in kidney, glucose in kidney " + this.glucose + " mg blood lactate " + this.body.blood.lactate + " mg");
        
       if(this.body.blood.glutamine > this.glutamineConsumed_){
           this.body.blood.glutamine -= this.glutamineConsumed_;
       }
       else{
           this.body.blood.glutamine = 0;
       }
    */
        //Glucose excertion in urine
        
        var bgl = this.body.blood.getBGL();
        
        this.excretionPerTick = 0;
        
        if(bgl > this.reabsorptionThreshold_)
        {
            x = glucoseExcretionRate__;
            
            x = x/1000.0;
            
            this.excretionPerTick =(this.body.excretionKidneysImpact_) * x * (bgl - this.reabsorptionThreshold_);
            this.body.blood.removeGlucose(this.excretionPerTick);
            
            //this.body.time_stamp();
            //console.log("glucose excertion in urine " + g);
        }
        
        
        this.body.time_stamp();
        console.log("Kidneys:: Absorption " + this.glucoseAbsorptionPerTick);
        
        this.body.time_stamp();
        console.log("Kidneys:: Release " + this.releasePerTick);

        this.body.time_stamp();
        console.log("Kidneys:: Glycolysis " + this.glycolysisPerTick);
        
        this.body.time_stamp();
        console.log("Kidneys:: GNG " + this.gngPerTick);
        
        this.body.time_stamp();
        console.log("Kidneys:: Excertion " + this.excretionPerTick);

        this.body.time_stamp();
        console.log("Kidneys:: totalExcretion " + this.totalExcretion);
    }
    
    setParams() {
    	for(var [key, value] of this.body.metabolicParameters.get(this.body.bodyState.state).get(BodyOrgan.KIDNEY.value).entries()) {
            switch (key) {
			    case "fluidVolume_" : { this.fluidVolume_ = value; break; }
    			case "Glut2VMAX_" : { this.Glut2VMAX_ = value; break; }
    			case "Glut2Km_" : { this.Glut2Km_ = value; break; }
    			case "Glut1Rate_" : { this.Glut1Rate_ = value; break; }
    			case "glycolysisMin_" : { this.glycolysisMin_ = value; break; }
    			case "glycolysisMax_" : { this.glycolysisMax_ = value; break; }
    			case "gluconeogenesisRate_" : { this.gluconeogenesisRate_ = value; break; }
    			case "glutamineConsumed_" : { this.glutamineConsumed_ = value; break; }
    		}
    	}
    }
}

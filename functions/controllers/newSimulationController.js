var firebase = require('firebase');
var async = require('async');
global.$ = require('jquery/dist/jquery');
var poissonProcess = require('poisson-process');

// Constants
const TICKS_PER_DAY = 24 * 60;
const TICKS_PER_HOUR = 60;

// Organ shared Values
var normalGlucoseLevel_ = 100; //mg/dl

// Priority Queue Start
class QElement {
    constructor(firetime, activityID, subID, howmuch)
    {
        this.firetime = firetime;
        //ID determines if it's a food, exercise, or halt event
        this.ID = activityID;
        //subID determines what specific food or exercise is being referenced
        this.subID = subID;
        //howmuch is quantity of food/exercise 
        this.howmuch = howmuch;
    }

    costs_less(oqe){
            if(this.firetime < oqe.firetime){
                return true;
            }
            else if(this.firetime > oqe.firetime){
                return false;
            }
            else if(this.firetime === oqe.firetime){
                return "tie";
            }
            else{
                return false;
            }
        }
}

// PriorityQueue class
class PriorityQueue {
 
    // An array is used to implement priority
    constructor()
    {
        this.items = [];
    }
 
    // enqueue function to add element
    // to the queue as per priority
    enqueue(element)
    {
        // creating object from queue element
        //var qElement = new QElement();
        var contain = false;

        // iterating through the entire
        // item array to add element at the
        // correct location of the Queue
        for (var i = 0; i < this.items.length; i++) {
            /*if(this.items[i].costs_less(element) === "tie"){
                this.items.splice(i+1,0, element);
            }*/
            if(this.items[i].costs_less(element) === false){
                this.items.splice(i,0, element);
                contain = true;
                break;
            }
        }

        // if the element have the highest priority
        // it is added at the end of the queue
        if (!contain) {
            this.items.push(element);
        }
    }
    
    // dequeue method to remove
    // element from the queue
    dequeue()
    {
        // return the dequeued element
        // and remove it.
        // if the queue is empty
        // returns Underflow
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }
    
    // front function
    front()
    {
        // returns the highest priority element
        // in the Priority queue without removing it.
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
        //return this.items[0].ID + ", " + this.items[0].firetime;
    }
    
    // rear function
    rear()
    {
        // returns the lowest priorty
        // element of the queue
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[this.items.length - 1];
        //return this.items[this.items.length - 1].ID + ", " + this.items[this.items.length - 1].firetime;
    }
    
    // isEmpty function
    isEmpty()
    {
        // return true if the queue is empty.
        return this.items.length == 0;
    }
 
    // printQueue function
    // prints all the element of the queue
    printPQueue()
    {
        var str = "";
        for (var i = 0; i < this.items.length; i++)
            str += this.items[i].ID + ", " + this.items[i].firetime + " || ";
        
        return str;
    }
}
// Priority Queue End


// Blood Start
class RBCBin{
    constructor(){
        var RBCs = 0;
        var glycatedRBCs = 0;
    }
}

class Blood{	////////////////////================================================================================
    //private RBCBin[] AgeBins = new RBCBin[MAXAGE+1];// Aging Bins
    /////////////////////==========================================================================
    currentHbA1c(){
        var rbcs = 0;
        var glycated_rbcs = 0;
    
        for(var i = 0; i <= Blood.MAXAGE; i++){
            rbcs += this.AgeBins[i].RBCs;
            rbcs += this.AgeBins[i].glycatedRBCs;
            glycated_rbcs += this.AgeBins[i].glycatedRBCs;
        }
    
        if(rbcs == 0){
            console.log("Error in Bloody::currentHbA1c.");
            //System.exit(1);
            return -1;
        }
        return glycated_rbcs/rbcs;
    }

    baseBGL(){
        return this.baseGlucoseLevel_;
    } ///////////////////////////////////=========================================================

    updateRBCs(){
        // will be called once a day
        this.bin0--;
        if(this.bin0 < 0) this.bin0 = Blood.MAXAGE;
        //New RBCs take birth
        this.AgeBins[this.bin0].RBCs = this.rbcBirthRate_;
        this.AgeBins[this.bin0].glycatedRBCs = 0;
    
        //console.log("New RBCs: " + AgeBins[bin0].RBCs);
        // Old (100 to 120 days old) RBCs die
        var start_bin = this.bin0 + Blood.HUNDREDDAYS;
    
        if( start_bin > Blood.MAXAGE ) start_bin -= (Blood.MAXAGE + 1);
        //System.out.println("Old RBCs Die");
        for(var i = 0; i < (Blood.MAXAGE-Blood.HUNDREDDAYS); i++){
            var j = start_bin = i;
            if(j < 0){
                this.body.time_stamp();
                console.log("RBC bin value negative " + j);
                break;
                //System.exit(-1);
            }
            if (j > Blood.MAXAGE) j -= (Blood.MAXAGE + 1);
        
            var kill_rate = (i)/(Blood.MAXAGE-Blood.HUNDREDDAYS);
            this.AgeBins[j].RBCs *= (1.0 - kill_rate);
            this.AgeBins[j].glycatedRBCs *= (1.0 - kill_rate);
            //console.log("bin: " + (start_bin + i) + ", RBCs " + AgeBins[start_bin + i].RBCs + ", Glycated RBCs " + AgeBins[start_bin + i].glycatedRBCs);
        }
    
        //glycate the RBCs
        var glycation_prob = this.avgBGLOneDay * this.glycationProbSlope_ + this.glycationProbConst_;
        //System.out.println("RBCs glycate");
        for(var i = 0; i <= Blood.MAXAGE; i++){
            var newly_glycated = glycation_prob * this.AgeBins[i].RBCs;
            this.AgeBins[i].RBCs -= newly_glycated;
            this.AgeBins[i].glycatedRBCs += newly_glycated;
            //System.out.println("bin: " + i + ", RBCs " + AgeBins[i].RBCs + ", Glycated RBCs " + AgeBins[i].glycatedRBCs);
        }
        this.body.time_stamp();
        var curHbA1c = this.currentHbA1c();
        if(curHbA1c == -1){
            return -1;
        }
        console.log("New HbA1c: " + curHbA1c);
        return 0;
    }


    // Constructor
    constructor(myBody) {
        this.body = myBody;
        var num = 120;
        this.AgeBins = Array.apply(null, Array(num)).map(function () { return new RBCBin(); });
        this.bin0 = 1;
        this.rbcBirthRate_ = 144.0*60*24; // in millions per minute
        this.glycationProbSlope_ = 0.085/10000.0;
        this.glycationProbConst_ = 0;
    
        // all contents are in units of milligrams of glucose
        this.glucose = 5000.0; //5000.0; //15000.0;
        this.fluidVolume_ = 50.0; // in deciliters
    
        this.gngSubstrates = 0;
        this.alanine = 0;
        this.branchedAminoAcids = 0;
        this.unbranchedAminoAcids = 0;
        this.glutamine = 0;
        this.insulin = 0;
    
    
        //Gerich: insulin dependent: 1 to 5 micromol per kg per minute
        this.glycolysisMin_ = 0.1801559;
        this.glycolysisMax_ = 5*this.glycolysisMin_;
    
        this.glycolysisToLactate_ = 1;
    
        //this.normalGlucoseLevel_ = 100; //mg/dl
        this.highGlucoseLevel_ = 200; //mg/dl
        this.minGlucoseLevel_ = 40; //mg/dl
        this.highLactateLevel_ = 4053.51; // mg
        // 9 mmol/l of lactate = 4.5 mmol/l of glucose = 4.5*180.1559*5 mg of glucose = 4053.51mg of glucose
        this.lactate = 0; //450.39; //mg
        // 1mmol/l of lactate = 0.5mmol/l of glucose = 0.5*180.1559*5 mg of glucose = 450.39 mg of glucose

        // initial number of RBCs
        for(var i = 0; i <= Blood.MAXAGE; i++){
            this.AgeBins[i] = new RBCBin();
            this.AgeBins[i].RBCs = 0.94*this.rbcBirthRate_;
            this.AgeBins[i].glycatedRBCs = 0.06*this.rbcBirthRate_;
        }
        this.avgBGLOneDay = 0;
        this.avgBGLOneDaySum = 0;
        this.avgBGLOneDayCount = 0;
    
        this.glycolysisPerTick = 0;
    }

    processTick(){
        var x; 
    
        var glycolysisMin__ = poissonProcess.sample(1000.0 * this.glycolysisMin_);
    
        var scale = (1.0 - this.body.insulinResistance_)*(this.body.blood.insulin);
    
        x = glycolysisMin__;
        x = x*(this.body.bodyWeight_)/1000;
    
        if(x > this.glycolysisMax_*(this.body.bodyWeight_)){
            x = this.glycolysisMax_*(this.body.bodyWeight_);
        }
    
        var toGlycolysis = x + scale * ( (this.glycolysisMax_*(this.body.bodyWeight_)) - x);
    
        if(toGlycolysis > this.glucose) toGlycolysis = this.glucose;
    
        this.glucose -= toGlycolysis;
        this.glycolysisPerTick = toGlycolysis;
        this.body.blood.lactate += this.glycolysisToLactate_ * toGlycolysis;
        //console.log("Glycolysis in blood, blood glucose " + this.glucose + " mg, lactate " + this.lactate + " mg");
    
        var bgl = this.glucose/this.fluidVolume_;
    
        if(bgl >= this.highGlucoseLevel_){
            this.insulin = this.body.insulinPeakLevel_;
        }else{
            if(bgl < normalGlucoseLevel_){
                this.insulin = 0;
            }else{
                this.insulin = (this.body.insulinPeakLevel_)*(bgl - normalGlucoseLevel_)/(this.highGlucoseLevel_ - normalGlucoseLevel_);
            }
        }
    
        //calculating average bgl during a day
    
        if(this.avgBGLOneDayCount == Blood.ONEDAY){
            this.avgBGLOneDay = this.avgBGLOneDaySum/this.avgBGLOneDayCount;
            this.avgBGLOneDaySum = 0;
            this.avgBGLOneDayCount = 0;
            var retUpdateRBCs = this.updateRBCs();
            if(retUpdateRBCs == -1){
                return -1;
            }
            this.body.time_stamp();
            console.log("Blood:: avgBGL: " + this.avgBGLOneDay);
        }
    
        this.avgBGLOneDaySum += bgl;
        this.avgBGLOneDayCount++;
    
        this.body.time_stamp();
        console.log("Blood:: glycolysis: " + this.glycolysisPerTick);
    
        this.body.time_stamp();
        console.log("Blood:: insulinLevel: " + this.insulin);
    
        //BUKET NEW: For the calculation of Incremental AUC
        //if(glcs > 100 && SimCtl::ticks < 120){
        //  SimCtl::AUC = SimCtl::AUC + (glcs-100);
        //}
        return 0;
    }

    setParams(){
        for(var [key, value] of this.body.metabolicParameters.get(body.bodyState.state).get(BodyOrgan.BLOOD.value).entries()){
            switch(key){
                case "rbcBirthRate_" : { this.rbcBirthRate_ = value; break; }
                case "glycationProbSlope_" : { this.glycationProbSlope_ = value; break; }
                case "glycationProbConst_" : { this.glycationProbConst_ = value; break; }
                case "minGlucoseLevel_" : { this.minGlucoseLevel_ = value; break; }
                case "normalGlucoseLevel_" : { normalGlucoseLevel_ = value; break; }
                case "highGlucoseLevel_" : { this.highGlucoseLevel_ = value; break; }
                case "highLactateLevel_" : { this.highLactateLevel_ = value; break; }
                case "glycolysisMin_" : { this.glycolysisMin_ = value; break; }
                case "glycolysisMax_" : { this.glycolysisMax_ = value; break; }
            }
        }
    }

    getBGL(){ return this.glucose/this.fluidVolume_; }

    removeGlucose(howmuch){
        this.glucose -= howmuch;
        //System.out.println("Glucose consumed " + howmuch + " ,glucose left " + glucose);
        if(this.getBGL() <= this.minGlucoseLevel_){
            body.time_stamp();
            console.log("bgl dips to: " + this.getBGL());
            //System.exit(-1);
            return -1;
        }
        return 0;
    }

    addGlucose(howmuch){
        this.glucose += howmuch;
    
        //this.body.time_stamp();
        //console.log("BGL: " + this.getBGL());
    }

    getGNGSubstrates(){ 
        return (this.gngSubstrates + this.lactate + this.alanine + this.glutamine);
    }

    consumeGNGSubstrates(howmuch){
        var total = this.gngSubstrates + this.lactate + this.alanine + this.glutamine;
        if(total < howmuch){
            this.gngSubstrates = 0;
            this.lactate = 0;
            this.alanine = 0;
            this.glutamine = 0;
            return total;
        }
        var factor = (total - howmuch)/total;
    
        this.gngSubstrates *= factor;
        this.lactate *= factor;
        this.alanine *= factor;
        this.glutamine *= factor;
        return howmuch;
    }

    gngFromHighLactate(rate_){
        // Gluconeogenesis will occur even in the presence of high insulin in proportion to lactate
        // concentration. High lactate concentration (e.g. due to high glycolytic activity) would 
        // cause gluconeogenesis to happen even if insulin concentration is high. But then 
        // Gluconeogenesis would contribute to glycogen store of the liver (rather than generating glucose).
    
        // rate_ is in units of mg per kg per minute
        var x = 3*rate_ * this.lactate/this.highLactateLevel_;
    
        if(x > this.lactate) x = this.lactate;
    
        this.lactate -= x;
        return x;
    }
}
Blood.ONEDAY = 24*60;
Blood.MAXAGE = 120*24*60;
Blood.HUNDREDDAYS = 100;
// Blood End


// Brain Start
class Brain{
    constructor(myBody){
        this.glucoseOxidized_ = 83.333;
        this.glucoseToAlanine_ = 0;
        this.bAAToGlutamine_ = 0;
        this.body = myBody;
        this.oxidationPerTick;
    }

    processTick(){
        var glucoseOxidized__ = poissonProcess.sample(1000.0 * this.glucoseOxidized_);
        
        var g = glucoseOxidized__ / 1000;
        this.oxidationPerTick = g;
        var retValue = this.body.blood.removeGlucose(g + this.glucoseToAlanine_);
        if(retValue == -1){
            return -1;
        }

        this.body.blood.alanine += this.glucoseToAlanine_;

        //Brain generate glutamine from branched amino acids.
        if(this.body.blood.branchedAminoAcids > this.bAAToGlutamine_){
            this.body.blood.branchedAminoAcids -= this.bAAToGlutamine_;
            this.body.blood.glutamine += this.bAAToGlutamine_;
        }else{
            this.body.blood.glutamine += 
            this.body.blood.branchedAminoAcids;
            this.body.blood.branchedAminoAcids = 0;
        }
        
        this.body.time_stamp();
        console.log("Brain Oxidation: " + this.oxidationPerTick);
        return 0;
    }

    setParams(){
        for(var [key, value] of this.body.metabolicParameters.get(this.body.bodyState.state).get(BodyOrgan.BRAIN.value).entries()){
            switch(key){
                case "glucoseOxidized_" : { this.glucoseOxidized_ = value; break; }
                case "glucoseToAlanine_" : { this.glucoseToAlanine_ = value; break; }
                case "bAAToGlutamine_" : { this.bAAToGlutamine_ = value; break; }
            }
        }
    }
}
// Brain End


// Heart Start
class Heart{
    constructor(mybody){
    	this.body = mybody;
        this.lactateOxidized_ = 0;
        this.basalGlucoseAbsorbed_ = 14; //mg per minute
        //Skeletal Muscle Glycolysis, Oxidation, and Storage of an Oral Glucose Load- Kelley et.al.
        
        this.Glut4Km_ = 5*180.1559/10.0; //mg/dl equivalent of 5 mmol/l
        this.Glut4VMAX_ = 0; //mg per kg per minute
        this.oxidationPerTick;
    }
    
    processTick(){
        var basalGlucoseAbsorbed__ = poissonProcess.sample(1000.0 * this.basalGlucoseAbsorbed_);
        
        var basalAbsorption = basalGlucoseAbsorbed__ / 1000;
        
        var basalAbsoptionRet = this.body.blood.removeGlucose(basalAbsorption);
        if(basalAbsoptionRet == -1){
            return -1;
        }
        
        this.oxidationPerTick = basalAbsorption;
        
        //Absorption via GLUT4
        
        var bgl = this.body.blood.getBGL();
        var scale = (1.0 - this.body.insulinResistance_)*(this.body.blood.insulin)*(this.body.bodyWeight_);
        var g = scale*this.Glut4VMAX_*bgl/(bgl + this.Glut4Km_);
        
        var gRet = this.body.blood.removeGlucose(g);
        if(gRet == -1){
            return -1;
        }
        
        this.oxidationPerTick += g;
        
        this.body.time_stamp();
        console.log("Heart:: Oxidation: " + this.oxidationPerTick);
        return 0;
    }

    setParams(){
    for(var [key, value] of this.body.metabolicParameters.get(this.body.bodyState.state).get(BodyOrgan.ADIPOSE_TISSUE.value).entries()){
            switch(key){
    			case "lactateOxidized_" : { this.lactateOxidized_ = value; break; }
    			case "basalGlucoseAbsorbed_" : { this.basalGlucoseAbsorbed_ = value; break; }
    			case "Glut4Km_" : { this.Glut4Km_ = value; break; }
    			case "Glut4VMAX_" : { this.Glut4VMAX_ = value; break; }
    		}
    	}
    }
}
// Heart End


// Intestine Start
class Chyme{
    constructor(){
        this.origRAG = 0;
        this.origSAG = 0;
        this.RAG = 0;
        this.SAG = 0;
        this.ts = 0;
    }
}

class Intestine{
    constructor(MyBody){
        this.body = MyBody;

        this.RAG_Mean_ = 5;
        this.RAG_StdDev_ = 5;
        this.SAG_Mean_ = 60;
        this.SAG_StdDev_ = 20;
        
        this.protein = 0; // mg
        this.glucoseInLumen = 0; // in milligrams
        this.glucoseInEnterocytes = 0; // in milligrams
        
        // Carb digestion parameters
        // support only normal distribution for RAG/SAG digestion so far.
        this.fluidVolumeInEnterocytes_ = 3; //dl
        this.fluidVolumeInLumen_ = 4; //dl
        
        //Michaelis Menten parameters for glucose transport
        this.Glut2Km_In_ = 20*180.1559/10.0; // mg/deciliter equal to 20 mmol/l (Frayn Table 2.2.1)
        this.Glut2VMAX_In_ = 700; //mg
        this.Glut2Km_Out_ = 20*180.1559/10.0; // mg/deciliter equal to 20 mmol/l (Frayn Table 2.2.1)
        this.Glut2VMAX_Out_ = 700; //mg
        //active transport rate
        this.sglt1Rate_ = 30; //mg per minute
        
        this.peakGlucoseConcentrationInLumen = 200*180.1559/10.0; // mg/dl equivalent of 200mmol/l
        
        this.aminoAcidsAbsorptionRate_ = 1; //mg per minute
        this.glutamineOxidationRate_ = 1; // mg per minute
        this.glutamineToAlanineFraction_ = 0.5;
        
        //Gerich: insulin dependent: 1 to 5 micromol per kg per minute
        this.glycolysisMin_ = 0.1801559;
        this.glycolysisMax_ = 5*this.glycolysisMin_;
        
        this.glycolysisPerTick = 0;
        this.toPortalVeinPerTick = 0;
        this.chyme = Array.apply(null, Array(40)).map(function () { return new Chyme(); });

    }

    addChyme(rag, sag, proteinInChyme, fat){
    	var c = new Chyme();
    	c.RAG = rag;
    	c.SAG = sag;
    	c.origRAG = rag;
    	c.origSAG = sag;
    	c.ts = this.body.ticks;
    	this.chyme.push(c);

    	this.protein += proteinInChyme;

        // very simple processing of fat for now
        this.body.adiposeTissue.addFat(fat);
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
    
    absorbGlucose(){
        var x; // to hold the random samples
        var activeAbsorption = 0;
        var passiveAbsorption = 0;
        
        var glLumen = 0;
        var glEnterocytes = 0;
        var glPortalVein = 0;
        
        var basalAbsorption__ = poissonProcess.sample(1000.0 * this.sglt1Rate_);
        var Glut2VMAX_In__ = poissonProcess.sample(1000.0 * this.Glut2VMAX_In_);
        var Glut2VMAX_Out__ = poissonProcess.sample(1000.0 * this.Glut2VMAX_Out_);
        var glycolysisMin__ = poissonProcess.sample(1000.0 * this.glycolysisMin_);
        
        if(this.glucoseInLumen > 0){
            if (this.fluidVolumeInLumen_ <= 0){
                console.log("Intestine:: Absorb glucose.");
                //cout << "Intestine.absorbGlucose" << endl;
                //exit(-1);
                return -1;
            }
        
            // Active transport first
            activeAbsorption = basalAbsorption__ / 1000;
            
            if(activeAbsorption >= this.glucoseInLumen){
                activeAbsorption = this.glucoseInLumen;
                this.glucoseInEnterocytes += activeAbsorption;
    	        this.glucoseInLumen = 0;
            }else{
                this.glucoseInEnterocytes += activeAbsorption;
    	        this.glucoseInLumen -= activeAbsorption;
        
                //passive transport via GLUT2s now
                glLumen = this.glucoseInLumen/this.fluidVolumeInLumen_;
                glEnterocytes = this.glucoseInEnterocytes/this.fluidVolumeInEnterocytes_;
                var diff = (1.0)*(glLumen - glEnterocytes);
                
                if(diff > 0){
                    // glucose concentration in lumen decides the number of GLUT2s available for transport.
                    // so, Vmax depends on glucose concentration in lumen
                    x = Glut2VMAX_In__ / 1000;
                    var effectiveVmax = (1.0) *(x*glLumen/this.peakGlucoseConcentrationInLumen);
        
                    if (effectiveVmax > this.Glut2VMAX_In_){
                        effectiveVmax = this.Glut2VMAX_In_;
                    }
                    
                    passiveAbsorption = effectiveVmax*diff/(diff + this.Glut2Km_In_);
        
                    if (passiveAbsorption > this.glucoseInLumen){
                        passiveAbsorption = this.glucoseInLumen;
                    }
                    
                    this.glucoseInEnterocytes += passiveAbsorption;
                    this.glucoseInLumen -= passiveAbsorption;
                }
            }
        }
        
        //release some glucose to portal vein via Glut2s
        glEnterocytes = this.glucoseInEnterocytes/this.fluidVolumeInEnterocytes_;
        glPortalVein = this.body.portalVein.getConcentration();
        
        this.toPortalVeinPerTick = 0;
        
        var diff = (1.0)*(glEnterocytes - glPortalVein);
        
        if(diff > 0){
            x = Glut2VMAX_Out__ / 1000;
            this.toPortalVeinPerTick = x*diff/(diff + this.Glut2Km_Out_);
            
            if(this.toPortalVeinPerTick > this.glucoseInEnterocytes){
                this.toPortalVeinPerTick = this.glucoseInEnterocytes;
            }
            
            this.glucoseInEnterocytes -= this.toPortalVeinPerTick;
            this.body.portalVein.addGlucose(this.toPortalVeinPerTick);
        }
        
        // Modeling the glucose consumption by enterocytes: glycolysis to lactate.
        
        //Glycolysis. Depends on insulin level. Consumed glucose becomes lactate (Ref: Gerich).
        
        var scale = (1.0)*((1.0 - this.body.insulinResistance_)*(this.body.blood.insulin));
        
        //x = (1.0)*(poissonProcess.sample(1000.0*this.glycolysisMin_));
        x = glycolysisMin__;
        x *= this.body.bodyWeight_/1000.0;
        if(x > this.glycolysisMax_*(this.body.bodyWeight_))
            x = this.glycolysisMax_*(this.body.bodyWeight_);
        
        this.glycolysisPerTick = x + scale * ((this.glycolysisMax_*(this.body.bodyWeight_)) - x);
        
        if(this.glycolysisPerTick > this.glucoseInEnterocytes){
            var removeGlucoseRet = this.body.blood.removeGlucose(this.glycolysisPerTick - this.glucoseInEnterocytes);
            if(removeGlucoseRet == -1){
                return -1;
            }
            this.glucoseInEnterocytes = 0;
        }else{
            this.glucoseInEnterocytes -= this.glycolysisPerTick;
        }
            
        this.body.blood.lactate += this.glycolysisPerTick;
        
        // log all the concentrations (in mmol/l)
        // peak concentrations should be 200mmol/l (lumen), 100mmol/l(enterocytes), 10mmol/l(portal vein)
        
        glLumen = (10.0/180.1559)*this.glucoseInLumen/this.fluidVolumeInLumen_; // in mmol/l
        glEnterocytes = (10.0/180.1559)*this.glucoseInEnterocytes/this.fluidVolumeInEnterocytes_;
        x = this.body.portalVein.getConcentration();
        glPortalVein = (10.0/180.1559)*x;

        this.body.time_stamp();
        console.log("Intestine:: glLumen: " + glLumen + " glEntero: " + glEnterocytes + " glPortal: " + glPortalVein + ", activeAbsorption: " + activeAbsorption + " passiveAbsorption: " + passiveAbsorption);
        return 0;
    }
    
    //The BCAAs, leucine, isoleucine, and valine, represent 3 of the 20 amino acids that are used in the formation of proteins. Thus, on average, the BCAA content of food proteins is about 15% of the total amino acid content."Interrelationship between Physical Activity and Branched-Chain Amino Acids"

    //The average content of glutamine in protein is about %3.9. "The Chemistry of Food" By Jan Velisek
    //Do we consider the dietary glutamine? I did not consider in my code but I can add if we need it.

    //Looks like cooking destroys dietary glutamine. So, no need to consider diet as source of glutamine.
    //-Mukul

    absorbAminoAcids(){
        var aminoAcidsAbsorptionRate__ = poissonProcess.sample(1000.0 * this.aminoAcidsAbsorptionRate_);
        
        var glutamineOxidationRate__ = poissonProcess.sample(1000.0 * this.glutamineOxidationRate_);
        
        var absorbedAA = (1.0) * poissonProcess.sample(aminoAcidsAbsorptionRate__)/1000.0;
        

        if(this.protein < absorbedAA){
            absorbedAA = this.protein;
        }
        
        this.body.portalVein.addAminoAcids(absorbedAA);
        this.protein -= absorbedAA;
        
        //Glutamine is oxidized
        var g = (1.0) * poissonProcess.sample(glutamineOxidationRate__)/1000;
        
        if(this.body.blood.glutamine < g){
                this.body.blood.alanine += this.glutamineToAlanineFraction_*(this.body.blood.glutamine);
                this.body.blood.glutamine = 0;
        }else{
            this.body.blood.glutamine -= g;
            this.body.blood.alanine += this.glutamineToAlanineFraction_*g;
        }
    }

    processTick(){
        for(var i = 0; i < this.chyme.length; i++){
            var RAGConsumed = 0;
            var t = this.body.ticks - this.chyme[i].ts;
            
            if(t == 0){
                RAGConsumed = this.chyme[i].origRAG * 0.5 * (1 + this.erf((t - this.RAG_Mean_) / (this.RAG_StdDev_ * Math.sqrt(2))));
            }else{
                RAGConsumed = this.chyme[i].origRAG * 0.5 * (this.erf((t - this.RAG_Mean_) / (this.RAG_StdDev_ * Math.sqrt(2))) - this.erf((t - 1 - this.RAG_Mean_) / (this.RAG_StdDev_ * Math.sqrt(2))));
            }
            
            if(this.chyme[i].RAG < RAGConsumed){
                RAGConsumed = this.chyme[i].RAG;
            }
            
            if(this.chyme[i].RAG < 0.01 * (this.chyme[i].origRAG)){
                RAGConsumed = this.chyme[i].RAG;
            }
                
                
            this.chyme[i].RAG -= RAGConsumed;
            this.glucoseInLumen += RAGConsumed;
                
            var SAGConsumed = 0;
                
            if(t == 0){
                SAGConsumed = this.chyme[i].origSAG * 0.5 * (1 + this.erf((t - this.SAG_Mean_) / (this.SAG_StdDev_ * Math.sqrt(2))));
            }else{
                SAGConsumed = this.chyme[i].origSAG * 0.5 * (this.erf((t - this.SAG_Mean_) / (this.SAG_StdDev_ * Math.sqrt(2))) - this.erf((t - 1 - this.SAG_Mean_) / (this.SAG_StdDev_ * Math.sqrt(2))));
            }

            if(this.chyme[i].SAG < SAGConsumed){
                SAGConsumed = this.chyme[i].SAG;
            }
            
            if(this.chyme[i].SAG < 0.01 * this.chyme[i].origSAG){
                SAGConsumed = this.chyme[i].SAG;
            }
            
            this.chyme[i].SAG -= SAGConsumed;
            this.glucoseInLumen += SAGConsumed;
            
            this.body.time_stamp();
            console.log("Chyme:: RAG: " + this.chyme[i].RAG + "SAG: " + this.chyme[i].SAG + " origRAG: " + this.chyme[i].origRAG + " origSAG: " + this.chyme[i].origSAG + " glucoseInLumen: " + this.glucoseInLumen + " RAGConsumed: " + RAGConsumed + " SAGConsumed: " + SAGConsumed);
            
            if(this.chyme[i].RAG == 0 && this.chyme[i].SAG == 0){
                this.chyme.pop[i];
            }
        }
        
        var absorbGlucoseRet = this.absorbGlucose();
        if(absorbGlucoseRet == -1){
            return -1;
        }
        this.absorbAminoAcids();
        
        this.body.time_stamp();
        console.log("Intestine:: Glycolysis: " + this.glycolysisPerTick);
        this.body.time_stamp();
        console.log("Intestine:: ToPortalVein: " + this.toPortalVeinPerTick);
        return 0;
    }
}
// Intestine End


// Liver Start
class Liver{
    constructor(body_){
        this.body = body_;
        this.glycogen = 100000.0; // equivalent of 100g of glucose
        this.glycogenMax_ = 120000.0; // 120 g of glucose

        // Frayn Chapter 9

        // 5 micromol per kg per minute = 5*180.1559/1000 mg per kg per minute = 0.9007795 mg per kg per minute (ref: Gerich paper)
        // default max glycogen breakdown rate is 10 micromol per kg per minute
        this.glycogenToGlucose_ = 2*0.9007795;
        this.glucoseToGlycogen_ = this.glycogenToGlucose_; // for now

        this.glycogenSynth_Insulin_Mean_ = 0.075;
        this.glycogenSynth_Insulin_StdDev_ = 0.02;

        //Gerich paper: Liver consumes 1.65 micromol per kg per minute to 16.5 micromol per kg per minute of glucose depending upon post-absorptive/post-prandial state.
        this.glycolysisMin_ = 0.297; //mg per kg per minute
        this.glycolysisMax_ = 2.972;

        this.glycolysisToLactateFraction_ = 1; // by default glycolysis just generates all lactate

        // 2.5 micromol per kg per minute = 2.5*180.1559/1000 mg per kg per minute = 0.45038975 mg per kg per minute
        // default gng rate is 5 micromol per kg per minute
        this.gluconeogenesisRate_ = 2.0*0.45038975;
        this.gngFromLactateRate_ = 9 * this.gluconeogenesisRate_; //by default

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
    
    processTick(){
    	var baseBGL = this.body.blood.baseBGL();
        
        var x;  // to hold the random samples
       
        var glycogenToGlucose__ = poissonProcess.sample(1000.0 * this.glycogenToGlucose_);
        
        var glucoseToGlycogen__ = poissonProcess.sample(1000.0 * this.glucoseToGlycogen_);
        
        var glycolysisMin__ = poissonProcess.sample(1000.0 * this.glycolysisMin_);
        
        var gngRate__ = poissonProcess.sample(1000.0 * this.gluconeogenesisRate_);
        
        var gngFromLactateRate__ = poissonProcess.sample(1000.0 * this.gngFromLactateRate_);
        
        var Glut2VMAX__ = poissonProcess.sample(1000.0 * this.Glut2VMAX_);
       
        var glInPortalVein = this.body.portalVein.getConcentration();

        var glInLiver = this.glucose/this.fluidVolume_;
      
        if(glInLiver < glInPortalVein){
            var diff = glInPortalVein - glInLiver;
            x = Glut2VMAX__;
            x *= this.body.bodyWeight_ / 1000;
            
            var g = x * diff/(diff + this.Glut2Km_);
            
            if(g > this.body.portalVein.getGlucose()){
                //console.log("Trying to absorb more glucose from portal vein than what is present there! " + g + " " + this.body.portalVein.getGlucose());
                g = this.body.portalVein.getGlucose();
            }
            
            var removeGlucoseRet = this.body.portalVein.removeGlucose(g);
            if(removeGlucoseRet == -1){
                return -1;
            }
            this.glucose += g;
            
            this.absorptionPerTick = g;
            this.body.time_stamp();
            console.log("Liver absorbs from portal vein " + g + "mg");
        }
        
        this.body.portalVein.releaseAllGlucose();

        glInLiver = this.glucose/this.fluidVolume_;
        var scale = 1;
        
        if(glInLiver > baseBGL){
            scale *= glInLiver / baseBGL;
        }
        
        scale *= (1.0 - this.body.insulinResistance_);
        //scale *= this.body.blood.insulin;
        
        scale *= .5 * (1 + this.erf((this.body.blood.insulin - this.glycogenSynth_Insulin_Mean_) / (this.glycogenSynth_Insulin_StdDev_ * Math.sqrt(2))));

        x = glucoseToGlycogen__;
        var toGlycogen = scale * x * (this.body.bodyWeight_ / 1000);
        
        if(toGlycogen > this.glucose){
            toGlycogen = this.glucose;
        }
        
        if(toGlycogen > 0){
            this.glycogen += toGlycogen;
        }
        
        this.toGlycogenPerTick = toGlycogen;
        
        if(this.glycogen > this.glycogenMax_){
            this.body.adiposeTissue.lipogenesis(this.glycogen - this.glycogenMax_);
            this.glycogen = this.glycogenMax_;
        }
        
        this.glucose -= toGlycogen;
        
        //console.log("After glycogen synthesis in liver, liver glycogen " + this.glycogen + " mg, live glucose " + this.glucose + " mg");
        
        //glycogen breakdown (depends on insulin and glucose level)
        
        scale = 1 - (this.body.blood.insulin)*(1 - (this.body.insulinResistance_));
        glInLiver = this.glucose/this.fluidVolume_;
        
        if(glInLiver > baseBGL){
            scale *= baseBGL/glInLiver;
        }
        
        x = glycogenToGlucose__;
        var fromGlycogen = scale * x * (this.body.bodyWeight_ / 1000);
        
        if(fromGlycogen > this.glycogen){
            fromGlycogen = this.glycogen;
        }
        
        if(fromGlycogen > 0){
            this.glycogen -= fromGlycogen;
            this.glucose += fromGlycogen;
        }
        
        this.fromGlycogenPerTick = fromGlycogen;
        
        scale = (1 - this.body.insulinResistance_) * this.body.blood.insulin;
        
        x = glycolysisMin__;
        x *= this.body.bodyWeight_ / 1000;
        
        if(x > this.glycolysisMax_ * this.body.bodyWeight_){
            x = this.glycolysisMax_ * this.body.bodyWeight_;
        }
        
        var toGlycolysis = x + scale * ((this.glycolysisMax_ * this.body.bodyWeight_) - x);
        
        if(toGlycolysis > this.glucose){
            toGlycolysis = this.glucose;
        }
        
        this.glucose -= toGlycolysis;
        this.body.blood.lactate += toGlycolysis * this.glycolysisToLactateFraction_;
        
        this.glycolysisPerTick = toGlycolysis;
            
        scale = 1 - this.body.blood.insulin * (1 - this.body.insulinResistance_);
        x = gngRate__;
        
        var gng = x * scale * this.body.bodyWeight_ / 1000; 
        gng = this.body.blood.consumeGNGSubstrates(gng);
        
        if(gng > 0){
            this.glucose += gng;
            //
            //this.body.time_stamp();
            //console.log("gng in liver " + gng + "mg");
        }
        
        this.gngPerTick = gng;

         //Gluconeogenesis will occur even in the presence of high insulin in proportion to lactate concentration. 

        x = gngFromLactateRate__;
        x *= this.body.bodyWeight_ / 1000;
        x = this.body.blood.gngFromHighLactate(x);
        
        if(x > 0){
            this.glucose += x;
            //this.body.time_stamp();
            //console.log("gng in liver from high lactate " + x + "mg");
        }
        
        this.gngPerTick += x;
        
        this.body.portalVein.releaseAminoAcids();
            
        glInLiver = this.glucose / this.fluidVolume_;
        
        var bgl = this.body.blood.getBGL();
        
        this.releasePerTick = 0;
        
        if(glInLiver > bgl){
            var diff = glInLiver - bgl;
            x = Glut2VMAX__;
            x *= this.body.bodyWeight_ / 1000;
            var g = x*diff/(diff + this.Glut2Km_);

            if(g > this.glucose){
                console.log("Releasing more glucose to blood than what is present in liver!");
                //exit(-1);
                return -1;
            }

            this.glucose -= g;
            this.body.blood.addGlucose(g);
            this.releasePerTick = g;
            this.body.time_stamp();
            console.log("Liver released glucose: " + g + " mg to blood");
        }
        
        this.body.time_stamp();
        console.log("Liver:: Absorption: " + this.absorptionPerTick);
        
        this.body.time_stamp();
        console.log("Liver:: ToGlycogen: " + this.toGlycogenPerTick);
        
        this.body.time_stamp();
        console.log("Liver:: FromGlycogen: " + this.fromGlycogenPerTick);
        
        this.body.time_stamp();
        console.log("Liver:: Glycogen: " + this.glycogen);
        
        this.body.time_stamp();
        console.log("Liver:: Glycolysis: " + this.glycolysisPerTick);
        
        this.body.time_stamp();
        console.log("Liver:: GNG: " + this.gngPerTick);
        
        this.body.time_stamp();
        console.log("Liver:: Release: " + this.releasePerTick);
        return 0;
    }
    
    setParams(){
            for(var [key, value] of this.body.metabolicParameters.get(this.body.bodyState.state).get(BodyOrgan.LIVER.value).entries()){    		
                switch (key) {
    			case "fluidVolume_" : { this.fluidVolume_ = key; break; }
    			case "normalGlucoseLevel_" : { normalGlucoseLevel_ = key; break; }
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
// Liver End


// Portal Vein Start
class PortalVein{
    constructor(body_){
        this.body = body_;
        this.glucose = 0; //mg
        this.branchedAA = 0;	//mg
        this.unbranchedAA = 0; //mg
        this.fluidVolume_ = 5; // dl
    }
    
    processTick(){
        var bgl = this.body.blood.getBGL();
        var glucoseFromBlood = bgl*this.fluidVolume_;
        var removeGlucoseRet = this.body.blood.removeGlucose(glucoseFromBlood);
        if(removeGlucoseRet == -1){
            return -1;
        }
        this.glucose += glucoseFromBlood;
        
        //this.body.time_stamp();
        console.log("PortalVein:: glucose: " + this.glucose + " branchedAA: " + this.branchedAA + " unbranchedAA: " + this.unbranchedAA);
        return 0;
    }
    
    setParams(){
        for(var [key, value] of this.body.metabolicParameters.get(this.body.bodyState.state).get(BodyOrgan.PORTAL_VEIN.value).entrySet()){            
            switch(key){
                case "fluidVolume_" : { this.fluidVolume_ = value; break; }
            }
        }
    }
    
    getConcentration(){
        var gl = this.glucose/this.fluidVolume_;
        //this.body.time_stamp();
        //console.log("GL in Portal Vein: " + gl);
        return gl;
    }
    
    addGlucose(g) {this.glucose += g;}
    
    getGlucose(){return this.glucose;}
    
    removeGlucose(g){
        this.glucose -= g;
        if(this.glucose < 0){
            console.log("PortalVein glucose went negative.");
            //System.exit(-1);
            return -1;
        }
        return 0;
    }
    
    releaseAllGlucose(){
        this.body.blood.addGlucose(this.glucose);
        this.glucose = 0;
    }
    
    addAminoAcids(aa){
        this.branchedAA += 0.15*aa;
        this.unbranchedAA += 0.85*aa;
        //this.body.time_stamp();
        //console.log(" PortalVein: bAA " + this.branchedAA + ", uAA " + this.unbranchedAA);
    }
    
    releaseAminoAcids(){
        // 93% unbranched amino acids consumed by liver to make alanine
        this.body.blood.alanine += 0.93*this.unbranchedAA;
        this.body.blood.unbranchedAminoAcids += 0.07*this.unbranchedAA;
        this.unbranchedAA = 0;
        this.body.blood.branchedAminoAcids += this.branchedAA;
        this.branchedAA = 0;

        // who consumes these amino acids from blood other than liver?
        // brain consumes branched amino acids
    }
}
// Portal Vein End


// Adipose Tissue Start
class AdiposeTissue{
	constructor(myBody){
		this.body = myBody;
    	this.glucoseAbsorbed_ = 0;
        this.bAAToGlutamine_ = 0;
        this.lipolysisRate_ = 0;
        this.fat = (this.body.fatFraction)*(this.body.bodyWeight_)*1000.0;
	}

	processTick(){
        /*
        console.log(this.body.blood.getBGL());
		if( this.body.blood.getBGL() < this.body.blood.normalGlucoseLevel_ ) {
            var lipolysis = this.body.insulinResistance_*this.lipolysisRate_;
            this.body.blood.gngSubstrates += this.lipolysis;
        } else {
            this.body.blood.gngSubstrates += this.lipolysisRate_;
        }
	
		if( this.body.blood.branchedAminoAcids > this.bAAToGlutamine_ ) {
            this.body.blood.branchedAminoAcids -= this.bAAToGlutamine_;
            this.body.blood.glutamine += this.bAAToGlutamine_;
        } else {
            this.body.blood.glutamine += this.body.blood.branchedAminoAcids;
            this.body.blood.branchedAminoAcids = 0;
        }
        */
        
        //this.body.time_stamp();
        //console.log("BodyWeight: " + this.body.bodyWeight_);
        return 0;
	}

	setParams(){
		for(var [key, value] of this.body.metabolicParameters.get(this.body.bodyState.state).get(BodyOrgan.ADIPOSE_TISSUE.value).entries()){
    		switch(key){
    			case "glucoseOxidized_" : { this.glucoseAbsorbed = value; break; }
    			case "glucoseToAlanine_" : { this.lipolysisRate_ = value; break; }
    			case "bAAToGlutamine_" : { this.bAAToGlutamine_ = value; break; }
    		}
    	}
	}

	 lipogenesis(glucoseInMG){
    	// one gram of glucose has 4kcal of energy
        // one gram of TAG has 9 kcal of energy
        //System.out.println("BodyWeight: Lipogenesis " + body.bodyWeight_ + " glucose " + glucoseInMG + " fat " + fat);
        this.body.bodyWeight_ -=  this.fat/1000.0;
        this.fat += (glucoseInMG) * 4.0 / 9000;
        this.body.bodyWeight_ += this.fat / 1000.0;
        //console.log("BodyWeight: Lipogenesis " + this.body.bodyWeight_ + " glucose " + glucoseInMG + " fat " + this.fat);
    }

     consumeFat(kcal){
    	this.body.bodyWeight_ -= this.fat/1000.0;
        this.fat -= kcal/9.0;
        this.body.bodyWeight_ += this.fat/1000.0;
        //console.log(kcal);
    }

      addFat(newFatInMG){
    	 this.body.bodyWeight_ -= this.fat/1000.0;
    	 this.fat += newFatInMG/1000.0;
    	 this.body.bodyWeight_ += this.fat/1000.0;
    	 //console.log("BodyWeight: addFat " + this.body.bodyWeight_ + " newfat " + newFatInMG);
    } 
}
// Adipose Tissue End


// Muscle Start
class Muscles{
    constructor(myBody){
    	this.body = myBody;
    	this.glycogenMax_ = 0.4*(this.body.bodyWeight_)*15000.0; //40% of body weight is muscles
        this.glycogen = this.glycogenMax_;
        this.glucose = 0;
        this.volume_ = 10;
        
        this.bAAToGlutamine_ = 0;
        
        this.basalGlucoseAbsorbed_ = 0.344; //mg per kg body weight per minute 
        
        //See the explanation in processTick()
        this.glycolysisMin_ = 0.4; //mg per kg per minute
        // 2.22 micromol per kg per minute = 2.22*180.1559/1000 mg per kg per minute = 0.4 mg per per minute
        this.glycolysisMax_ = 9*this.glycolysisMin_; //mg per kg per minute
        
        this.Glut4Km_ = 5*180.1559/10.0; //mg/dl equivalent of 5 mmol/l
        this.Glut4VMAX_ = 20.0; //mg per kg per minute
        
        this.glucoseOxidationFraction_ = 0.5;
        
        this.glucoseAbsorbedPerTick;
        this.glycogenSynthesizedPerTick;
        this.glycogenBreakdownPerTick;
        this.oxidationPerTick;
        this.glycogenOxidizedPerTick;
        this.glycolysisPerTick;
    }
    
    processTick(){
        var rand__ = poissonProcess.sample(100);
        
        var glycolysisMin__ = poissonProcess.sample(1000.0 * this.glycolysisMin_);        
        
        var basalAbsorption__ = poissonProcess.sample(1000.0 * this.basalGlucoseAbsorbed_);
        
        var Glut4VMAX__ = poissonProcess.sample(1000.0 * this.Glut4VMAX_);
        
        var baaToGlutamine__ = poissonProcess.sample(1000.0 * this.bAAToGlutamine_);
        
        this.glucoseAbsorbedPerTick = 0;
        this.glycogenSynthesizedPerTick = 0;
        this.glycogenBreakdownPerTick = 0;
        this.glycogenOxidizedPerTick = 0;
        this.oxidationPerTick = 0;
        
        var x; // to hold the random samples
        var currEnergyNeed = this.body.currentEnergyExpenditure();

        if(this.body.isExercising()){
            x =  rand__;
            this.oxidationPerTick = .1 * (x/100) * 1000 * (currEnergyNeed/4);
        }
        
        if(this.glucose >= this.oxidationPerTick){
            this.glucose -= this.oxidationPerTick;
        }else{
            var g = this.oxidationPerTick - this.glucose;
            this.glucose = 0;
            var removeGlucoseRetValue = this.body.blood.removeGlucose(g);
            if(removeGlucoseRetValue == -1){
                return -1;
            }
            this.glucoseAbsorbedPerTick += g;
        }
            
        var glycogenShare;
        var intensity = 0;//this.body.exerciseTypes[this.body.currExercise].intensity;
        
        if(intensity >= 6){
            glycogenShare = .3;
        }else{
            if(intensity < 3.0){
                glycogenShare = 0;
            }else{
                glycogenShare = 0.3*(intensity - 3.0 )/3.0;
            }
        }
        
        x = rand__;
        this.glycogenOxidizedPerTick = glycogenShare * (x/100) * 1000 * (currEnergyNeed/4);
        
        this.glycogen -= this.glycogenOxidizedPerTick;
        this.glycogenBreakdownPerTick += this.glycogenOxidizedPerTick;
        
        if(intensity < 18){
            x = glycolysisMin__;
            x = x * this.body.bodyWeight_ / 1000;
            
            if(x > this.glycolysisMax_ * this.body.bodyWeight_){
                x = this.glycolysisMax_ * this.body.bodyWeight_;
            }
            
            this.glycolysisPerTick = x + ((intensity - 1) / 17) * ((this.glycolysisMax_ + this.body.bodyWeight_) - x);
        }else{
            this.glycolysisPerTick = this.glycolysisMax_ * this.body.bodyWeight_;
        }
        
        this.glycogen -= this.glycolysisPerTick;
        this.glycogenBreakdownPerTick += this.glycolysisPerTick;
        this.body.blood.lactate += this.glycolysisPerTick;
        
        var kcalgenerated = ((this.oxidationPerTick + this.glycogenOxidizedPerTick) * .004) + (this.glycolysisPerTick * .004/15);
        
        if(kcalgenerated < currEnergyNeed){
            this.body.adiposeTissue.consumeFat(currEnergyNeed - kcalgenerated);
        }else{
            x = basalAbsorption__;
            x = x * this.body.bodyWeight_ / 1000;
            
            var removeGlucoseRet = this.body.blood.removeGlucose();
            if(removeGlucoseRet == -1){
                return -1;
            }
            this.glucoseAbsorbedPerTick = x;
            this.glucose += x;
            
            var bgl = this.body.blood.getBGL();
            var glMuscles = this.glucose / this.volume_;
            var diff = bgl - glMuscles;
            
            var scale = 1 - this.body.insulinResistance_ * this.body.insulin;
            var g;
            
            if(diff > 0){
                x = Glut4VMAX__;
                x = x * this.body.bodyWeight_ / 1000;
                g = scale * x * diff / (diff + this.Glut4Km_);
                
                var removeGlucoseRet2 = this.body.blood.removeGlucose(g);
                if(removeGlucoseRet2 == -1){
                    return -1;
                }
                this.glucoseAbsorbedPerTick += g;
                this.glucose += g;
            }
            
            scale = 1 - this.body.insulinResistance_ * this.body.blood.insulin;
            
            x = glycolysisMin__;
            x = x * this.body.bodyWeight_ / 1000;
            
            if(x > this.glycolysisMax_ * this.body.bodyWeight_){
                x = this.glycolysisMax_ * this.body.bodyWeight_;
            }
            
            this.glycolysisPerTick = x + scale * (this.glycolysisMax_ * this.body.bodyWeight_ - x);
            
            g = this.glycolysisPerTick;
            
            if(g <= this.glucose){
                this.glucose -= g;
                this.body.blood.lactate += g;
            }else{
                g -= this.glucose;
                this.body.blood.lactate += this.glucose;
                this.glucose = 0;
                
                if(this.glycogen >= g){
                    this.glycogen -= g;
                    this.body.blood.lactate += g;
                    this.glycogenBreakdownPerTick += g;
                }else{
                    this.body.blood.lactate += this.glycogen;
                    this.glycolysisPerTick = this.glycolysisPerTick - g + this.glycogen;
                    this.glycogenBreakdownPerTick += this.glycogen;
                    this.glycogen = 0;
                }
            }
            
            this.oxidationPerTick = .5 * this.glucose;
            this.glucose *= .5;
            
            if(this.glucose > 0){
                g = this.glucose;
                
                if(this.glycogen + g > this.glycogenMax_){
                    g = this.glycogenMax_ - this.glycogen;
                }
                this.glycogen += g;
                this.glycogenSynthesizedPerTick += g;
                this.glucose -= g;
            }
            
            var kcalgenerated = (this.oxidationPerTick * .004) + (this.glycolysisPerTick * .004 / 15);
            
            if(kcalgenerated < currEnergyNeed){
                this.body.adiposeTissue.consumeFat(currEnergyNeed-kcalgenerated);
            }
        }
        
        if(this.glycogen < 0){
            this.body.time_stamp();
            console.log("Glycogen went negative.");
        }
        
        this.body.time_stamp();
        console.log("Muscles:: GlucoseAbsorbed: " + this.glucoseAbsorbedPerTick);
        
        this.body.time_stamp();
        console.log("Muscles:: GlycogenSynthesis: " + this.glycogenSynthesizedPerTick);
        
        this.body.time_stamp();
        console.log("Muscles:: GlycogenBreakdown: " + this.glycogenBreakdownPerTick);
        
        this.body.time_stamp();
        console.log("Muscles:: glycogen: " + this.glycogen);
        
        this.body.time_stamp();
        console.log("Muscles:: Oxidation: " + this.oxidationPerTick);
        
        this.body.time_stamp();
        console.log("Muscles:: GlycogenOxidation: " + this.glycogenOxidizedPerTick);
        
        this.body.time_stamp();
        console.log("Muscles:: Glycolysis: " + this.glycolysisPerTick); 
        
        this.body.time_stamp();
        console.log("Muscles:: Glucose: " + this.glucose);
        return 0;
    }
   
    setParams(){
    	for(var [key, value] of this.body.metabolicParameters.get(this.body.bodyState.state).get(BodyOrgan.MUSCLES.value).entries()){
    		switch(key){
    			case "Glut4Km_" : { this.Glut4Km_ = key; break; }
    			case "Glut4VMAX_" : { this.Glut4VMAX_ = key; break; }
    			case "basalGlucoseAbsorbed_" : { this.basalGlucoseAbsorbed_ = key; break; }
    			case "glucoseOxidationFraction_" : { this.glucoseOxidationFraction_ = key; break; }
    			case "bAAToGlutamine_" : { this.bAAToGlutamine_ = key; break; }
    			case "glycolysisMin_" : { this.glycolysisMin_ = key; break; }
    			case "glycolysisMax_" : { this.glycolysisMax_ = key; break; }
    		}
    	}
    }
}
// Muscle End


// Kidney Start
class Kidney{
    constructor(myBody){
    	this.body = myBody;
        
        this.glutamineConsumed_ = 0;
        
        this.glucose = 0;
        this.fluidVolume_ = 10; //dl
        
        this.gluconeogenesisRate_ = 2 * 0.45038975;
        this.gngFromLactateRate_ = 9 * this.gluconeogenesisRate_; // by default
        
          
        this.Glut2VMAX_ = 30; // mg per kg per minute
        this.Glut2Km_ = 20*180.1559/10.0; // mg/deciliter equal to 20 mmol/l (Frayn Table 2.2.1)
        this.Glut1Rate_ = 1; // mg per kg per minute
        
        //Gerich: insulin dependent: 1 to 5 micromol per kg per minute
        this.glycolysisMin_ = 0.1801559; // mg per kg per minute
        this.glycolysisMax_ = 5 * this.glycolysisMin_;
        
        this.reabsorptionThreshold_ = 11*180.1559/10; //mg/dl equivalent of 11 mmol/l
        this.glucoseExcretionRate_ = 100/(11*180.1559/10); // mg per minute per(mg/dl)
        // As BGL increases from 11 mmol/l to 22 mmol/l, glucose excretion in urine increases from 0 to mg/min to 100mg/min.
        
        this.glucoseAbsorptionPerTick;
        this.glycolysisPerTick;
        this.gngPerTick;
        this.excretionPerTick;
    }
    
    processTick(){
        var x; // to hold the random samples
        
        //x = this.body.bodyWeight_;
        
        var glucoseExcretionRate__ = poissonProcess.sample(1000.0 * this.glucoseExcretionRate_);
        
        var glycolysisMin__ = poissonProcess.sample(1000.0 * this.glycolysisMin_);
        
        var gngRate__ = poissonProcess.sample(1000.0 * this.gluconeogenesisRate_);
        
        var gngFromLactateRate__ = poissonProcess.sample(1000.0 * this.gngFromLactateRate_);
        
        var Glut2VMax__ = poissonProcess.sample(1000.0 * this.Glut2VMAX_);
        
        var basalAbsorption__ = poissonProcess.sample(1000.0 * this.Glut1Rate_);
        
        var bgl = this.body.blood.getBGL();
        var glInKidney = this.glucose/this.fluidVolume_;
        
        x = Glut2VMax__;
        x *= this.body.bodyWeight_/1000.0;
        var y = basalAbsorption__;
        y *= this.body.bodyWeight_/1000.0;
        
        if(glInKidney < bgl){    
            var diff = bgl - glInKidney;
            var g = (1 + this.body.insulinResistance_)*x*diff/(diff + this.Glut2Km_);
            // uptake increases for higher insulin resistance.
            // may want to change this formula later - Mukul
            g += y; // basal absorption
            
            var removeGlucoseRet = this.body.blood.removeGlucose(g);
            if(removeGlucoseRet == -1){
                return -1;
            }
            this.glucose += g;
            
            this.body.time_stamp();
            console.log("Kidneys removing " + g + " mg of glucose from blood, basal " + y);
            
            this.glucoseAbsorptionPerTick = g;
        }else{
            var diff = glInKidney - bgl;
            var g = (1 + this.body.insulinResistance_)*x*diff/(diff + this.Glut2Km_);
            
            if(g > this.glucose){
                console.log("Releasing more glucose to blood than what is present in liver!");
                //System.exit(-1);
                return -1;
            }
            
            this.glucose -= g;
            this.body.blood.addGlucose(g);
            
            this.body.time_stamp();
            console.log("Kidneys releasing " + g + " mg of glucose to blood");
            
            this.glucoseAbsorptionPerTick = -1 * g;
        }
        
        //Glycolysis. Depends on insulin level. Some of the consumed glucose becomes lactate.
    
        //Gerich says:
        //The metabolic fate of glucose is different in different regions of the kidney. Because of its low oxygen tension, and low levels of oxidative enzymes, the renal medulla is an obligate user of glucose for its energy requirement and does so anaerobically. Consequently, lactate is the main metabolic end product of glucose taken up in the renal medulla, not carbon dioxide (CO2) and water. In contrast, the renal cortex has little  glucose phosphorylating capacity but a high level of oxidative enzymes. Consequently, this part of the kidney does not take up and use very much glucose, with oxidation of FFAs acting as the main source of energy. A major energy-requiring process in the kidney is the reabsorption of glucose from glomerular filtrate in the proximal convoluted tubule.
                
        var scale = (1.0 - this.body.insulinResistance_)*(this.body.blood.insulin);
        
        //myegine is suppose to be called, not poissonProcess
        //x = poissonProcess.sample(x*this.glycolysisMin_);
        
        x = glycolysisMin__;
        x *= this.body.bodyWeight_/1000;
        
        
        if(x > this.glycolysisMax_*(this.body.bodyWeight_)){
            x = this.glycolysisMax_*(this.body.bodyWeight_);
        }
        
        var toGlycolysis = x + scale * ( (this.glycolysisMax_ *(this.body.bodyWeight_)) - x);
        
        if(toGlycolysis > this.glucose){
            toGlycolysis = this.glucose;
        }
        
        this.glucose -= toGlycolysis;
        this.body.blood.lactate += toGlycolysis;
        
        this.body.time_stamp();
        console.log("Glycolysis in kidney: " + toGlycolysis + ", blood lactate: " + this.body.blood.lactate + " mg");
        
        this.glycolysisPerTick = toGlycolysis;
        
        //gluconeogenesis. Depends on insulin level and on substrate concentration.
    
        //4. release some glucose by consuming lactate/alanine/glycerol (gluconeogenesis)(the amount depends on body state and the concentration of lactate/alanine/glycerol in blood; when insulin is high (fed state) glycolysis is favored and when glucagon high (compared to insulin; starved state) gluconeogenesis is favored)
       
        scale = 1 - (this.body.blood.insulin)*(1 - (this.body.insulinResistance_));
        
        x = gngRate__;
        x *= this.body.bodyWeight_/1000;
        
        var gng = x * scale;
        gng = this.body.blood.consumeGNGSubstrates(gng);
        
        if(gng > 0){
            this.glucose += gng;
            this.body.time_stamp();
            console.log("GNG in Kidneys: " + gng + " mg");
        }
        
        this.gngPerTick = gng;

        x = gngFromLactateRate__;
        x *= this.body.bodyWeight_ / 1000;
        x = this.body.blood.gngFromHighLactate(x);
        
        if(x > 0){
            this.glucose += x;
            
            this.body.time_stamp();
            console.log("GNG from lactate in Kidneys: " + x + " mg");
        }
        
        this.gngPerTick += x;
        
        console.log("After GNG in kidney, glucose in kidney: " + this.glucose + " mg, blood lactate: " + this.body.blood.lactate + " mg");
        
       if(this.body.blood.glutamine > this.glutamineConsumed_){
           this.body.blood.glutamine -= this.glutamineConsumed_;
       }else{
           this.body.blood.glutamine = 0;
       }
        
        //Glucose excertion in urine
        
        bgl = this.body.blood.getBGL();
        
        this.excretionPerTick = 0;
        
        if(bgl > this.reabsorptionThreshold_){
            x = glucoseExcretionRate__;
            
            x = x/1000;
            
            this.excretionPerTick = x * (bgl - this.reabsorptionThreshold_);
            var removeGlucoseReturnValue = this.body.blood.removeGlucose(this.excretionPerTick);
            if(removeGlucoseReturnValue == -1){
                return -1;
            }
            
            this.body.time_stamp();
            console.log("glucose excertion in urine: " + g);
        }
        
        
        this.body.time_stamp();
        console.log("Kidneys:: GlucoseAbsorption: " + this.glucoseAbsorptionPerTick);
        
        this.body.time_stamp();
        console.log("Kidneys:: Glycolysis: " + this.glycolysisPerTick);
        
        this.body.time_stamp();
        console.log("Kidneys:: GNG: " + this.gngPerTick);
        
        this.body.time_stamp();
        console.log("Kidneys:: Excertion: " + this.excretionPerTick);
        return 0;
    }
    
    setParams(){
    	for(var [key, value] of this.body.metabolicParameters.get(this.body.bodyState.state).get(BodyOrgan.KIDNEY.value).entries()){
            switch(key){
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
// Kidney End


// Stomach Start
class Stomach{
    constructor(myBody){
        this.body = myBody;

        this.RAG = 0;
        this.SAG = 0;
        this.protein = 0;
        this.fat = 0;

        this.stomachEmpty = true;

        this.geConstant_ = 100.0; // mg
        this.geSlopeMin_ = 0.01; 
    }

    processTick(){
    	//send some chyme to the intestine.

    	//We assume that the nutrient composition of the chyme is same as that of the food in the stomach.

    	//The amount of chyme leaking out of stomach during a minute is equal to a certain minimum
    	//plus a part proportional to the total amount of chyme present in the stomach at that time.
    	//The proportionality constant depends on the energy density of the chyme. If the chyme is all
    	//fat, its energy density would be 9kcal/g. If it is all carbs, the energy density is 4kcal/g.
    	//The proportionality constant should decrease with increase in the energy density of the chyme.

    	//When we consider the fraction of leaked chyme that is dependent on the total amount of food in the
    	// stomach, the energy content should be same when the stomach has 9grams of carbs or 4 grams of fat.
    	//Energy leaked when the stomach has x grams of fat: k9*x*1000*9 cal
    	//Energy leaked when the stomach has x grams of carbs: k4*x*1000*4 cal

    	//Hence

    	//k9*x*1000*9 = k4*x*1000*4 
    	//=>k9*9 = k4*4
    	//=> k4 = 9*k9/4
    	//Similarly
    	//k5 = 9*k9/5

    	//So, we just need to know the proportinality constant k9 (geSlopeMin_) for pure fat.


    	//Chyme leakage does not change the relative fraction of carbs/fats/proteins in the chyme left in the stomach. 

    	if(this.stomachEmpty){
            return;
        }

        //static std::poisson_distribution<int> geConstant__ (1000.0*geConstant_);
        var geConstant__ = poissonProcess.sample(1000.0*this.geConstant_);
        
        var geConstant = geConstant__ / 1000;
    	var totalFood = this.RAG + this.SAG + this.protein + this.fat;
    	// calorific density of the food in stomach
    	var calorificDensity = (1.0) * ((4.0*(this.RAG+this.SAG+this.protein) + 9.0*this.fat)/totalFood); 
    	var geSlope = (1.0) * (9.0 * this.geSlopeMin_/calorificDensity);

        var geBolus = geConstant + geSlope * totalFood;

        this.body.time_stamp();
    	console.log("Gastric Emptying:: Total Food: " + totalFood + " Calorific Density: " + calorificDensity
    	+ " geSlopeMin: " + geSlopeMin + " geSlope: " + geSlope + " geConstant: " + geConstant + " Bolus: " + geBolus + endl);

    	if(geBolus > totalFood)
    		geBolus = totalFood;

    	var ragInBolus = (1.0) * (geBolus*this.RAG/totalFood);
    	var sagInBolus = (1.0) * (geBolus*this.SAG/totalFood);
    	var proteinInBolus = (1.0) * (geBolus*this.protein/totalFood);
    	var fatInBolus = (1.0) * (geBolus*this.fat/totalFood);

    	this.RAG -= ragInBolus;
    	this.SAG -= sagInBolus;
    	this.protein -= proteinInBolus;
    	this.fat -= fatInBolus;

    	this.body.intestine.addChyme(ragInBolus,sagInBolus,proteinInBolus,fatInBolus);

        if((this.RAG == 0) && (this.SAG == 0) && (this.protein == 0) && (this.fat == 0)){
            this.stomachEmpty = true;
            this.body.stomachEmpty();
        }
        
        this.body.time_stamp();
        console.log("Stomach : SAG: " + this.SAG + " RAG: " + this.RAG +  " protein: " + this.protein + " fat: " + this.fat + endl);
        return 0;
    }

    addFood(foodID, howmuch){
        // howmuch is in grams
        if(howmuch == 0){
            return;
        }

        for(var k = 0; k < this.body.foodTypesArr.length; k++){
            if(this.body.foodTypesArr[k].foodID == foodID){
                foodID = k;
                break;
            }
        }
        
        var name = this.body.foodTypesArr[foodID].name;
        
        var numServings = (1.0) * (howmuch/(this.body.foodTypesArr[foodID].servingSize));
       
        this.RAG += 1000.0*numServings*(this.body.foodTypesArr[foodID].RAG); // in milligrams
        this.SAG += 1000.0*numServings*(this.body.foodTypesArr[foodID].SAG); // in milligrams
        this.protein += 1000.0*numServings*(this.body.foodTypesArr[foodID].protein); // in milligrams
        this.fat += 1000.0*numServings*(this.body.foodTypesArr[foodID].fat); // in milligrams
        
        if((this.RAG > 0) || (this.SAG > 0) || (this.protein > 0) || (this.fat > 0)){
            this.stomachEmpty = false;
        }
        
        this.body.time_stamp();
        console.log("Adding " + howmuch + " grams of " + name + " to stomach."); 
    }
}
// Stomach End


//HumanBody Start
const EventType = {
    FOOD: 'Food',
    EXERCISE: 'Exercise',
    HALT: 'HALT',
    METFORMIN: 'METFORMIN',
    INSULIN_SHORT: 'INSULIN_SHORT',
    INSULIN_LONG: 'INSULIN_LONG'
}

class Event{
    constructor(){
        this.type = 0;
        this.subtype = 0;
        this.howmuch = 0;
        this.day = 0;
        this.hour = 0;
        this.minutes = 0;
        this.firetime = 0;
    }
};

class FoodEvent extends Event {
    constructor (fireTime, quantity, foodID) {
        super(fireTime);
        this.quantity_ = quantity;
        this.foodID_ = foodID;
    }
}

class ExerciseEvent extends Event {
    constructor (fireTime, duration, exerciseID) {
        super(fireTime);
        this.duration_ = duration;
        this.exerciseID_ = exerciseID;
    }
}

class HaltEvent extends Event {
    constructor (fireTime){
        super(fireTime);
    }
}

const BodyState = {
    FED_RESTING: 'FED_RESTING',
    FED_EXERCISING: 'FED_EXERCISING',
    POSTABSORPTIVE_RESTING: 'POSTABSORPTIVE_RESTING',
    POSTABSORPTIVE_EXERCISING: 'POSTABSORPTIVE_EXERCISING'
}

const BodyOrgan = {
    HUMAN_BODY: 'HUMAN_BODY',
    INTESTINE: 'INTESTINE',
    PORTAL_VEIN: 'PORTAL_VEIN',
    LIVER: 'LIVER',
    BLOOD: 'BLOOD',
    MUSCLES: 'MUSCLES',
    BRAIN: 'BRAIN',
    HEART: 'HEART',
    ADIPOSE_TISSUE: 'ADIPOSE_TISSUE',
    KIDNEY: 'KIDNEY'
}

class FoodType{
    constructor(){
        this.foodID = 0;
        this.name = "";
        this.servingSize = 0;
        this.RAG = 0;
        this.SAG = 0;
        this.protein = 0;
        this.fat = 0;
    }
};

class ExerciseType{
    constructor(){
        this.exerciseID = 0;
        this.name = "";
        this.intensity = 0;  
    }
};

class HumanBody{
    constructor(){
        // *****all commented out lines need to be uncommented when add each class for different organs*****
        
        //we need to have exerciseType array implemented
        //for organ muscles that calls body.exerciseType array
        //var intensity = this.body.exerciseTypes[this.body.currExercise].intensity;
        
        //Need to have foodTypes map implemented
        
        //Need to have array for Exercise and Food objects
        
        //Food Types Array
        this.foodTypesArr = [];

        //Exercise Types Array
        this.exerciseTypesArr = [];

        this.ticks = 0;
        this.insulinResistance_ = 0;
        this.insulinPeakLevel_ = 1.0;
        this.bodyState = BodyState.POSTABSORPTIVE_RESTING;
        this.fatFraction = 0.2;

        //this.adiposeTissue = new AdiposeTissue(this);
        //this.muscles = new musclesH(this);

        this.currExercise = 0;
        this.currEnergyExpenditure = 1.0/60.0;
        this.exerciseOverAt = 0;
        
        this.bodyWeight_ = 65; //kg

        this.eventQ = new PriorityQueue();
        
        this.portalVein = new PortalVein(this);
        this.muscles = new Muscles(this);
        this.liver = new Liver(this);
        this.blood = new Blood(this);
        this.stomach = new Stomach(this);
        this.intestine = new Intestine(this);
        this.brain = new Brain(this);
        this.heart = new Heart(this);
        this.adiposeTissue = new AdiposeTissue(this);
        this.kidneys = new Kidney(this);
    }
    
    addExerciseType(index, exerciseID, name, intensity){
        var element = new ExerciseType();
        element.exerciseID = exerciseID;
        element.name = name;
        element.intensity = intensity;
        
        this.exerciseTypesArr[index] = element;
    }
    
    addFoodType(index, foodID, name, servingSize, RAG, SAG, protein, fat){
        var element = new FoodType();
        element.foodID = foodID;
        element.name = name;
        element.servingSize = servingSize;
        element.RAG = RAG;
        element.SAG = SAG;
        element.protein = protein;
        element.fat = fat;
        
        this.foodTypesArr[index] = element;
    }

    //Original SimCtl Code now put here
    elapsed_days(){
         return this.ticks / TICKS_PER_DAY; 
    }
    
    elapsed_hours(){
        var x = this.ticks % TICKS_PER_DAY;
        return (x / TICKS_PER_HOUR);
    }
    
    elapsed_minutes(){
        var x = this.ticks % TICKS_PER_DAY;
        return (x % TICKS_PER_HOUR);
    }
    
    time_stamp(){
        console.log(this.elapsed_days() + ":" + this.elapsed_hours() + ":" + this.elapsed_minutes());
    }
    
    processTick(simulationTickValuesArray, tick){
        var brainProcessTickRet = this.brain.processTick();
        if(brainProcessTickRet == -1){
            return -1;
        }
        var liverProcessTickRet = this.liver.processTick();
        if(liverProcessTickRet == -1){
            return -2;
        }
        var kidneysProcessTickRet = this.kidneys.processTick();
        if(kidneysProcessTickRet == -1){
            return -3;
        }
        var bloodProcessTickRet = this.blood.processTick();
        if(bloodProcessTickRet == -1){
            return -4;
        }
        var heartProcessTickRet = this.heart.processTick();
        if(heartProcessTickRet == -1){
            return -5;
        }
        var portalVeinProcessTickRet = this.portalVein.processTick();
        if(portalVeinProcessTickRet == -1){
            return -6;
        }
        var intestineProcessTickRet = this.intestine.processTick();
        if(intestineProcessTickRet == -1){
            return -7;
        }
        //console.log(this.stomach.processTick());
        var adiposeProcessTickRet = this.adiposeTissue.processTick();
        if(adiposeProcessTickRet == -1){
            return -8;
        }
        var musclesProcessTickRet = this.muscles.processTick();
        if(musclesProcessTickRet == -1){
            return -9;
        }
        
        this.time_stamp();
        console.log("bgl: " + this.blood.getBGL());
        
        this.time_stamp();
        console.log("weight: " + this.bodyWeight_);
        
        this.time_stamp();
        console.log("TotalGlycolysis: " + this.intestine.glycolysisPerTick + this.liver.glycolysisPerTick + this.muscles.glycolysisPerTick + this.kidneys.glycolysisPerTick + this.blood.glycolysisPerTick);
        
        this.time_stamp();
        console.log("TotalGNG: " + this.kidneys.gngPerTick + this.liver.gngPerTick);
        
        this.time_stamp();
        console.log("TotalOxidation: " + this.brain.oxidationPerTick + this.heart.oxidationPerTick);
        

        // dont worry about time_stamp yet, will be read from real-time database
        console.log(" bgl " + this.blood.getBGL() + " weight "  + this.bodyWeight_);

        if(this.bodyState == BodyState.FED_EXERCISING){
            // need to work on if statement, read from realtime db
            //if(){
                this.bodyState = BodyState.FED_RESTING;
                this.currEnergyExpenditure = 1.0/60.0;
            //}
        }

        if(this.bodyState == BodyState.POSTABSORPTIVE_EXERCISING){
            // need to work on if statement, read ticks from realtime db
            //if(){
                this.bodyState = BodyState.POSTABSORPTIVE_RESTING;
                this.currEnergyExpenditure = 1.0/60.0;
            //}
        }

        var bodyBGL = this.blood.getBGL();

        var tickData ={
            Tick: tick,
            BGL: bodyBGL
        };

        simulationTickValuesArray.push(tickData);

        return 0;
    }
    
    processFoodEvent(foodID, howmuch){
        this.stomach.addFood(foodID, howmuch);
        this.oldState = this.bodyState;
        switch(this.bodyState){
            case BodyState.POSTABSORPTIVE_RESTING:
                this.bodyState = BodyState.FED_RESTING;
                break;
            case BodyState.POSTABSORPTIVE_EXERCISING:
                this.bodyState = BodyState.FED_EXERCISING;
                break;
            default:
                break;
        }
        
        if(this.bodyState != this.oldState){
            // all this code was commented out in original
            //setParams();
            //SimCtl::time_stamp();
            //cout << "Entering State " << bodyState << endl;
        }     
    }

    isExercising(){
        if(this.bodyState == BodyState.FED_EXERCISING || this.bodyState == BodyState.POSTABSORPTIVE_EXERCISING){
            return true;
        }else{
            return false;
        }
    }
    
    processExerciseEvent(exerciseID, duration){
        if(this.isExercising()){
            // convert when work on real-time database
            this.time_stamp();
            console.log("Exercise within Exercise!");
            process.exit();
        }

        this.currExercise = exerciseID;

        this.currEnergyExpenditure = (this.exerciseTypesArr[exerciseID].intensity_)/60.0;

        if(this.bodyState == BodyState.FED_RESTING){
            this.bodyState = BodyState.FED_EXERCISING;
            this.exerciseOverAt = this.ticks + duration;
            return;
        }

        if(this.bodyState == BodyState.POSTABSORPTIVE_RESTING){
            this.bodyState = BodyState.POSTABSORPTIVE_EXERCISING;
            this.exerciseOverAt = this.ticks + duration;
            // exerciseOverAt = SimCtl::ticks + duration;
            return;
        }
    }
    
    run_simulation(simulationTickValuesArray){
        var continueLoop = true;
        while(continueLoop == true){
            //keep looping until fire_event() returns -1
            while(this.fire_event() == 1);
            
            if(this.fire_event() == -2){
                continueLoop = false;
            }

            var processTickRet = this.processTick(simulationTickValuesArray, this.ticks);
            if(processTickRet < 0){
                continueLoop = false;
            }

            this.ticks++;
            
            console.log(this.elapsed_days() + ":" + this.elapsed_hours() + ":" + this.elapsed_minutes());
        }
    }
    
    fire_event(){
        var event_ = this.eventQ.front();

        if(event_ === "No elements in Queue"){
            console.log("No event left");
            //break;
            return -2;
        }

        //if executing run_simulation initially it will return -1 
        //because this.ticks is initially 0
        if(event_.firetime > this.ticks){
            return -1;
        }
        
        console.log("ticks = " + this.ticks + ": " + this.elapsed_days() + "::" + this.elapsed_hours() + "::" + this.elapsed_minutes());
        
        console.log("event fire time: " + event_.firetime);

        var event_type = event_.ID;

        switch(event_type){
            case EventType.FOOD:
                this.processFoodEvent(event_.subID, event_.howmuch);
                break;
            case EventType.EXERCISE:
                this.processExerciseEvent(event_.subID, event_.howmuch)
                break;
            case EventType.HALT:
                // terminate program
                break;
            default:
                break;
        }

        event_ = this.eventQ.dequeue();
        //delete event_;
        return 1;
    }
    
    addEvent(fireTime, type, subtype, howmuch){
        switch (type){
            case EventType.FOOD:
                var e = new QElement(fireTime, type, subtype, howmuch);
                this.eventQ.enqueue(e);
                break;
            case EventType.EXERCISE:
                var e = new QElement(fireTime, type, subtype, howmuch);
                this.eventQ.enqueue(e);
                break;
            case EventType.HALT:
                var e = new QElement(fireTime, type, subtype, howmuch);
                this.eventQ.enqueue(e);
            default:
                break;
        }
    }
    
    readEvents(completedActivitiesArray){
        for(var i = 0; i < completedActivitiesArray.length; i++){
            this.addEvent(completedActivitiesArray[i].fireTime, completedActivitiesArray[i].type, completedActivitiesArray[i].subtype, completedActivitiesArray[i].howmuch);
       }
    }

    currentEnergyExpenditure(){
        return this.bodyWeight_ * this.currEnergyExpenditure;
    }

    stomachEmpty(){
        var oldState = this.bodyState;

        switch(this.bodyState){
            case BodyState.FED_RESTING:
                this.bodyState = BodyState.POSTABSORPTIVE_RESTING;
                break;
            case BodyState.FED_EXERCISING:
                this.bodyState = BodyState.POSTABSORPTIVE_EXERCISING;
                break;
            default:
                break;
        }

        if(this.bodyState != this.oldState){
            // do nothing, original code just has cout but it is commented out
            //setParams();
            //time_stamp();
            //console.log("Entering State " + this.bodyState);
        }
    }
}
//HumanBody End

var activityTypesArray = [
    {
        _id: "Select Activity Type",
        name: "Select Activity Type"
    },
    {
        _id: "Food",
        name: "Food"
    },
    {
        _id: "Exercise",
        name: "Exercise"
    }
];

function timeCalculation(dayInput0, hourSelect0, minuteSelect0){
    var dayInt = parseInt(dayInput0);
    var hourInt = parseInt(hourSelect0);
    var minuteInt = parseInt(minuteSelect0);
    var totalReturn = 0;

    var dayTotal = (dayInt - 1) * 1440;
    var hourTotal = hourInt * 60;
    totalReturn = dayTotal + hourTotal + minuteInt;
    return totalReturn;
}

function runSimulationProgram(activity_type0, food_type0, exercise_type0, newFoodName0, newFoodServingSize0, newFoodFat0, newFoodProtein0, newFoodRAG0, newFoodSAG0, newExerciseName0, newExerciseIntensity0, foodQtyInput0, exerciseQtyInput0, activityDbArray, totalActivitiesInDb_1, totalExerciseTypesinDb_1, totalFoodTypesinDb_1, dayInput0, hourSelect0, minuteSelect0, deleted, req, res, endDay, endHour, endMinute, foodActivitiesArray, exerciseActivitiesArray, simulationTickValuesArray){
    var nextActivityTypeID = totalActivitiesInDb_1;
    var nextFoodTypeID = totalFoodTypesinDb_1;
    var nextExerciseTypeID = totalExerciseTypesinDb_1;
    
    var humanBody = new HumanBody();

    // adding exercise/food types to the simulation
    // start each 2 to not add select and + new options
    for(var fi = 2; fi < foodActivitiesArray.length; fi++){
        var foodActivity = foodActivitiesArray[fi];
        humanBody.addFoodType((fi - 2), foodActivity._id, foodActivity.name, foodActivity.servingSize, foodActivity.rag, foodActivity.sag, foodActivity.protein, foodActivity.fat)
    }

    for(var ei = 2; ei < exerciseActivitiesArray.length; ei++){
        var exerciseActivity = exerciseActivitiesArray[ei];
        humanBody.addExerciseType((ei - 2), exerciseActivity._id, exerciseActivity.name, exerciseActivity.intensity)
    }

    var completedActivitiesArray = [];

    var i = 1;
    while(activity_type0[i] != null){
        if(deleted[i] != "DELETED"){
            var activityType = activity_type0[i];
            if(activityType == "Food"){
                var foodType = food_type0[i];
                if(foodType == "+ New Food"){
                    var time = timeCalculation(dayInput0[i], hourSelect0[i], minuteSelect0[i]);
                    var activityTypeValue = activity_type0[i];
                    var subTypeValue = nextFoodTypeID;
                    var foodQtyInput = foodQtyInput0[i];

                    var newActivityObj = {fireTime: time, type: activityTypeValue, subtype: subTypeValue, howmuch: foodQtyInput};
                    completedActivitiesArray.push(newActivityObj);

                    nextFoodTypeID++;
                }else if(foodType == "Select Food"){
                    // no selection made, do not add to simulation
                }else{
                    var time = timeCalculation(dayInput0[i], hourSelect0[i], minuteSelect0[i]);
                    var activityTypeValue = activity_type0[i];
                    var subTypeValue = foodType;
                    var foodQtyInput = foodQtyInput0[i];

                    var newActivityObj = {fireTime: time, type: activityTypeValue, subtype: subTypeValue, howmuch: foodQtyInput};
                    completedActivitiesArray.push(newActivityObj);
                }
            }else if(activityType == "Exercise"){
                var exerciseType = exercise_type0[i];
                if(exerciseType == "+ New Exercise"){

                    var time = timeCalculation(dayInput0[i], hourSelect0[i], minuteSelect0[i]);
                    var activityTypeValue = activity_type0[i];
                    var subTypeValue = nextExerciseTypeID;
                    var exerciseQtyInput = exerciseQtyInput0[i];

                    var newActivityObj = {fireTime: time, type: activityTypeValue, subtype: subTypeValue, howmuch: exerciseQtyInput};
                    completedActivitiesArray.push(newActivityObj);
                    nextExerciseTypeID++;
                }else if(exerciseType == "Select Exercise"){
                // no selection made, do not add to simulation
                }else{
                    var time = timeCalculation(dayInput0[i], hourSelect0[i], minuteSelect0[i]);
                    var activityTypeValue = activity_type0[i];
                    var subTypeValue = exerciseType;
                    var exerciseQtyInput = exerciseQtyInput0[i];

                    var newActivityObj = {fireTime: time, type: activityTypeValue, subtype: subTypeValue, howmuch: exerciseQtyInput};
                    completedActivitiesArray.push(newActivityObj);
                }
            }else{
                // no selection made, do not add to simulation
            }
        }
        i++;
    }

    var endTime = timeCalculation(endDay, endHour, endMinute);
    var typeEnd = "HALT";
    var subTypeEnd = "HALT";
    var howMuchEnd = 0;
    var newEndTimeObj = {fireTime: endTime, type: typeEnd, subtype: subTypeEnd, howmuch: howMuchEnd};
    completedActivitiesArray.push(newEndTimeObj);

    humanBody.readEvents(completedActivitiesArray);

    humanBody.run_simulation(simulationTickValuesArray);
}

function writeActivitySetToDatabaseArray(activity_type0, food_type0, exercise_type0, newFoodName0, newFoodServingSize0, newFoodFat0, newFoodProtein0, newFoodRAG0, newFoodSAG0, newExerciseName0, newExerciseIntensity0, foodQtyInput0, exerciseQtyInput0, totalActivitiesInDb_1, totalExerciseTypesinDb_1, totalFoodTypesinDb_1, dayInput0, hourSelect0, minuteSelect0, deleted, endDay, endHour, endMinute){
    var nextActivityTypeID = totalActivitiesInDb_1;
    var nextFoodTypeID = totalFoodTypesinDb_1;
    var nextExerciseTypeID = totalExerciseTypesinDb_1;

    var userId = firebase.auth().currentUser.uid;

    var newActivitySequenceKey = firebase.database().ref().child('activitySequences').push().key;


    var d = new Date();
    var month = d.getMonth() + 1;
    var dateString = month + "/" + d.getDate() + "/" + d.getFullYear();

    var dateObj = {
        dateCreated: dateString,
        endDay: endDay,
        endHour: endHour,
        endMinute: endMinute
    };

    var exerciseSubtype = {};
    exerciseSubtype['/users/' + userId + '/activitySequences/' + newActivitySequenceKey] = dateObj;

    firebase.database().ref().update(exerciseSubtype);


    //for each element
    var i = 1;

    while(activity_type0[i] != null){
        if(deleted[i] != "DELETED"){
            var activityType = activity_type0[i];
            if(activityType == "Food"){
                var foodType = food_type0[i];
                if(foodType == "+ New Food"){
                    var newFoodName = newFoodName0[i];
                    var newFoodServingSize = newFoodServingSize0[i];
                    var newFoodFat = newFoodFat0[i];
                    var newFoodProtein = newFoodProtein0[i];
                    var newFoodRAG = newFoodRAG0[i];
                    var newFoodSAG = newFoodSAG0[i];
                    writeFoodSubtypeData(nextFoodTypeID, newFoodName, newFoodServingSize, newFoodRAG, newFoodSAG, newFoodProtein, newFoodFat);
                    var foodQtyInput = foodQtyInput0[i];
                    var daySelection = dayInput0[i];
                    var hourSelection = hourSelect0[i];
                    var minuteSelection = minuteSelect0[i];
                    writeNewActivitySequenceElement(newActivitySequenceKey, i, activityType, nextFoodTypeID, foodQtyInput, daySelection, hourSelection, minuteSelection)
                    nextFoodTypeID++;
                }else if(foodType == "Select Food"){
                    // no selection made, do not add anything to database
                }else{
                    var foodQtyInput = foodQtyInput0[i];
                    var daySelection = dayInput0[i];
                    var hourSelection = hourSelect0[i];
                    var minuteSelection = minuteSelect0[i];
                    writeNewActivitySequenceElement(newActivitySequenceKey, i, activityType, foodType, foodQtyInput, daySelection, hourSelection, minuteSelection)
                }
            }else if(activityType == "Exercise"){
                var exerciseType = exercise_type0[i];
                if(exerciseType == "+ New Exercise"){
                    var newExerciseName = newExerciseName0[i];
                    var newExerciseIntensity = newExerciseIntensity0[i];
                    writeExerciseSubtypeData(nextExerciseTypeID, newExerciseName, newExerciseIntensity);
                    var exerciseQtyInput = exerciseQtyInput0[i];
                    var daySelection = dayInput0[i];
                    var hourSelection = hourSelect0[i];
                    var minuteSelection = minuteSelect0[i];
                    writeNewActivitySequenceElement(newActivitySequenceKey, i, activityType, nextExerciseTypeID, exerciseQtyInput, daySelection, hourSelection, minuteSelection)
                    nextExerciseTypeID++;
                }else if(exerciseType == "Select Exercise"){
                    // no selection made, do not add anything to database
                }else{
                    var exerciseQtyInput = exerciseQtyInput0[i];
                    var daySelection = dayInput0[i];
                    var hourSelection = hourSelect0[i];
                    var minuteSelection = minuteSelect0[i];
                    writeNewActivitySequenceElement(newActivitySequenceKey, i, activityType, exerciseType, exerciseQtyInput, daySelection, hourSelection, minuteSelection)
                }
            }else{
                // no selection made, do not add anything to database
            }
        }
        i++;
    }
}

function writeFoodSubtypeData(totalFoodSubtypesPlus, food_name, servingSize, RAG, SAG, protein, fat){
    var userId = firebase.auth().currentUser.uid;

    var foodSubtypeEntry = {
        _id: totalFoodSubtypesPlus,
        food_name: food_name,
        servingSize: servingSize,
        RAG: RAG,
        SAG: SAG,
        protein: protein,
        fat: fat
    };

    var newFoodSubtypeKey = firebase.database().ref().child('foodSubtypes').push().key;

    var foodSubtype = {};
    foodSubtype['/users/' + userId + '/foodSubtypes/' + newFoodSubtypeKey] = foodSubtypeEntry;

    return firebase.database().ref().update(foodSubtype);
}

function writeExerciseSubtypeData(totalExerciseSubtypesPlus, exercise_activity, intensity){
    var userId = firebase.auth().currentUser.uid;

    var exerciseSubtypeEntry = {
        _id: totalExerciseSubtypesPlus,
        exercise_activity: exercise_activity,
        intensity: intensity,
    };

    var newExerciseSubtypeKey = firebase.database().ref().child('exerciseSubtypes').push().key;

    var exerciseSubtype = {};
    exerciseSubtype['/users/' + userId + '/exerciseSubtypes/' + newExerciseSubtypeKey] = exerciseSubtypeEntry;

    return firebase.database().ref().update(exerciseSubtype);
}

function writeNewActivitySequenceElement(newActivitySequenceKey, totalActivitiesInDb_1, activity, subtype, quantity, day, hour, minute){
    var userId = firebase.auth().currentUser.uid;
    var timestampRecorded = Date.now();
    var activitySequenceElement = {
        _id: totalActivitiesInDb_1,
        activity_type: activity,
        subtype: subtype,
        quantity: quantity,
        day: day,
        hour: hour,
        minute: minute,
    };

    var newActivitySequenceElementKey = firebase.database().ref().child(newActivitySequenceKey).push().key;
    var activitySequenceElements = {};
    activitySequenceElements['/users/' + userId + '/activitySequences/' + newActivitySequenceKey + '/' + newActivitySequenceElementKey] = activitySequenceElement;

    return firebase.database().ref().update(activitySequenceElements);
}

exports.new_simulation_get = function(req, res) {
    var hourArray = [];
    var hourString = "Hour";
    var hourID = "Hour";
    var hourObj = {name: hourString, _id: hourID};
    hourArray.push(hourObj);
    for(var i = 0; i < 24; i++){
        var kaString;
        var kaID;
        if(i < 10){
            kaString = "0" + i;
            kaID = "0" + i;
        }else{
            kaString = i;
            kaID = i;
        }
        var newObj = {name: kaString, _id: kaID};
        hourArray.push(newObj);
    }

    var minutesArray = [];
    var minString = "Minute";
    var minID = "Minute";
    var minObj = {name: minString, _id: minID};
    minutesArray.push(minObj);
    for(var i = 0; i < 60; i++){
        var kaString;
        var kaID;
        if(i < 10){
            kaString = "0" + i;
            kaID = "0" + i;
        }else{
            kaString = i;
            kaID = i;
        }
        var newObj = {name: kaString, _id: kaID};
        minutesArray.push(newObj);
    }

    if( firebase.auth().currentUser ) {
        var foodKeyArray = [];
        var foodKeyDataArray = [];
        var foodActivitiesArray = [];

        var sfname = "Select Food";
        var sfID = "Select Food";
        var sfrag = "";
        var sfsag = "";
        var sffat = "";
        var sfprotein = "";
        var sfservingSize = "";
        var newObjSF = {rag: sfrag, sag: sfsag, _id: sfID, fat: sffat, name: sfname, protein: sfprotein, servingSize: sfservingSize};
        foodKeyDataArray.push(newObjSF);

        var nfname = "+ New Food";
        var nfID = "+ New Food";
        var nfrag = "";
        var nfsag = "";
        var nffat = "";
        var nfprotein = "";
        var nfservingSize = "";
        var newObjSF = {rag: nfrag, sag: nfsag, _id: nfID, fat: nffat, name: nfname, protein: nfprotein, servingSize: nfservingSize};
        foodKeyDataArray.push(newObjSF);
    
        var userId = firebase.auth().currentUser.uid;
        var query = firebase.database().ref('/users/' + userId + '/foodSubtypes').orderByKey();
        query.once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var item = childSnapshot.val();
                item.key = childSnapshot.key;
    
                foodKeyArray.push(item);                                              
            });
            for(i = 0; i < foodKeyArray.length; i++){
                var rag = foodKeyArray[i].RAG;
                var sag = foodKeyArray[i].SAG;
                var _id = foodKeyArray[i]._id;
                var fat = foodKeyArray[i].fat;
                var food_name = foodKeyArray[i].food_name;
                var protein = foodKeyArray[i].protein;
                var servingSize = foodKeyArray[i].servingSize;
                var newObj = {rag: rag, sag: sag, _id: _id, fat: fat, name: food_name, protein: protein, servingSize: servingSize};
                foodKeyDataArray.push(newObj);
            }
    
            foodActivitiesArray = foodKeyDataArray;
    
            var exerciseKeyArray = [];
            var exerciseKeyDataArray = [];
            var exerciseActivitiesArray = [];

            var seName = "Select Exercise";
            var seID = "Select Exercise";
            var seIntensity = "";
            var newObjSE = {name: seName, _id: seID, intensity: seIntensity};
            exerciseKeyDataArray.push(newObjSE);
    
            var neName = "+ New Exercise";
            var neID = "+ New Exercise";
            var neIntensity = "";
            var newObjNewe = {name: neName, _id: neID, intensity: neIntensity};
            exerciseKeyDataArray.push(newObjNewe);
        
            var userId = firebase.auth().currentUser.uid;
            var query = firebase.database().ref('/users/' + userId + '/exerciseSubtypes').orderByKey();
            query.once('value').then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var item = childSnapshot.val();
                    item.key = childSnapshot.key;
        
                    exerciseKeyArray.push(item);                                              
                });
                for(i = 0; i < exerciseKeyArray.length; i++){
                    var kaString = exerciseKeyArray[i].exercise_activity;
                    var kaID = exerciseKeyArray[i]._id;
                    var kaIntensity = exerciseKeyArray[i].intensity;
                    var newObj = {name: kaString, _id: kaID, intensity: kaIntensity};
                    exerciseKeyDataArray.push(newObj);
                }
        
                exerciseActivitiesArray = exerciseKeyDataArray;

                var activitySequenceKeyArray = [];
                var activitySequenceDataArray = [];
                var activitySequenceArray = [];

                var baseName = "Create New Activity Sequence";
                var baseActivities = [];
                var activitySequenceBase = {name: baseName, activities: baseActivities};
                activitySequenceDataArray.push(activitySequenceBase);

                var userId = firebase.auth().currentUser.uid;
                var query = firebase.database().ref('/users/' + userId + '/activitySequences').orderByKey();
                query.once('value').then(function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                        var item = childSnapshot.val();
                        item.key = childSnapshot.key;

                        var date = item.dateCreated;

                        var activitiesInSequence = [];
                        childSnapshot.forEach(function(doubleChildSnapshot){
                            var item1 = doubleChildSnapshot.val();
                                item1.key = doubleChildSnapshot.key;
                                activitiesInSequence.push(item1);
                        });

                        var exerciseCt = 0;
                        var foodCt = 0;
                        for(p = 0; p < activitiesInSequence.length; p++){
                            if(activitiesInSequence[p].activity_type == "Food"){
                                foodCt++;
                            }
                            if(activitiesInSequence[p].activity_type == "Exercise"){
                                exerciseCt++;
                            }
                        }

                        var sequenceName = "Created on: " + date + ", # Exercise Activities: " + exerciseCt + ", # Food Activities: " + foodCt;
                        var newObj = {name: sequenceName, activities: activitiesInSequence};
                        activitySequenceDataArray.push(newObj);
                    });

                    activitySequenceArray = activitySequenceDataArray;
                       
                    res.render('newSimulation', {activityTypes: activityTypesArray, foodTypes: foodActivitiesArray, exerciseTypes: exerciseActivitiesArray, hours: hourArray, minutes: minutesArray, simulations: activitySequenceArray});
                });
            });
        });
    } else {
        res.render('loginfirstmsg', {result: "One needs to Sign In first before logging a new Activity."});
    } 
};

exports.new_simulation_post = function(req, res) {
    var simulationTickValuesArray = [];

    var hourArray = [];
    var hourString = "Hour";
    var hourID = "Hour";
    var hourObj = {name: hourString, _id: hourID};
    hourArray.push(hourObj);
    for(var i = 0; i < 24; i++){
        var kaString;
        var kaID;
        if(i < 10){
            kaString = "0" + i;
            kaID = "0" + i;
        }else{
            kaString = i;
            kaID = i;
        }
        var newObj = {name: kaString, _id: kaID};
        hourArray.push(newObj);
    }

    var minutesArray = [];
    var minString = "Minute";
    var minID = "Minute";
    var minObj = {name: minString, _id: minID};
    minutesArray.push(minObj);
    for(var i = 0; i < 60; i++){
        var kaString;
        var kaID;
        if(i < 10){
            kaString = "0" + i;
            kaID = "0" + i;
        }else{
            kaString = i;
            kaID = i;
        }
        var newObj = {name: kaString, _id: kaID};
        minutesArray.push(newObj);
    }

    var foodKeyArray = [];
    var foodKeyDataArray = [];
    var foodActivitiesArray = [];

    var sfname = "Select Food";
    var sfID = "Select Food";
    var sfrag = "";
    var sfsag = "";
    var sffat = "";
    var sfprotein = "";
    var sfservingSize = "";
    var newObjSF = {rag: sfrag, sag: sfsag, _id: sfID, fat: sffat, name: sfname, protein: sfprotein, servingSize: sfservingSize};
    foodKeyDataArray.push(newObjSF);

    var nfname = "+ New Food";
    var nfID = "+ New Food";
    var nfrag = "";
    var nfsag = "";
    var nffat = "";
    var nfprotein = "";
    var nfservingSize = "";
    var newObjSF = {rag: nfrag, sag: nfsag, _id: nfID, fat: nffat, name: nfname, protein: nfprotein, servingSize: nfservingSize};
    foodKeyDataArray.push(newObjSF);

    var userId = firebase.auth().currentUser.uid;
    var query = firebase.database().ref('/users/' + userId + '/foodSubtypes').orderByKey();
    query.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var item = childSnapshot.val();
            item.key = childSnapshot.key;

            foodKeyArray.push(item);                                              
        });
        for(i = 0; i < foodKeyArray.length; i++){
            var rag = foodKeyArray[i].RAG;
            var sag = foodKeyArray[i].SAG;
            var _id = foodKeyArray[i]._id;
            var fat = foodKeyArray[i].fat;
            var food_name = foodKeyArray[i].food_name;
            var protein = foodKeyArray[i].protein;
            var servingSize = foodKeyArray[i].servingSize;
            var newObj = {rag: rag, sag: sag, _id: _id, fat: fat, name: food_name, protein: protein, servingSize: servingSize};
            foodKeyDataArray.push(newObj);
        }

        foodActivitiesArray = foodKeyDataArray;

        var exerciseKeyArray = [];
        var exerciseKeyDataArray = [];
        var exerciseActivitiesArray = [];

        var seName = "Select Exercise";
        var seID = "Select Exercise";
        var seIntensity = "";
        var newObjSE = {name: seName, _id: seID, intensity: seIntensity};
        exerciseKeyDataArray.push(newObjSE);

        var neName = "+ New Exercise";
        var neID = "+ New Exercise";
        var neIntensity = "";
        var newObjNewe = {name: neName, _id: neID, intensity: neIntensity};
        exerciseKeyDataArray.push(newObjNewe);
    
        var userId = firebase.auth().currentUser.uid;
        var query = firebase.database().ref('/users/' + userId + '/exerciseSubtypes').orderByKey();
        query.once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var item = childSnapshot.val();
                item.key = childSnapshot.key;
    
                exerciseKeyArray.push(item);                                              
            });
            for(i = 0; i < exerciseKeyArray.length; i++){
                var kaString = exerciseKeyArray[i].exercise_activity;
                var kaID = exerciseKeyArray[i]._id;
                var kaIntensity = exerciseKeyArray[i].intensity;
                var newObj = {name: kaString, _id: kaID, intensity: kaIntensity};
                exerciseKeyDataArray.push(newObj);
            }
    
            exerciseActivitiesArray = exerciseKeyDataArray;
            
            var activityDbArray = [];

            var userId = firebase.auth().currentUser.uid;
            var query = firebase.database().ref('/users/' + userId + '/activities').orderByKey();
            query.once('value').then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var item = childSnapshot.val();
                    item.key = childSnapshot.key;
                    activityDbArray.push(item);                                              
                });

                
                var totalActivitiesInDb_1 = activityDbArray.length + 1;
                var totalExerciseTypesinDb_1 = exerciseActivitiesArray.length - 1;
                var totalFoodTypesinDb_1 = foodActivitiesArray.length - 1;

                var activity_type0 = req.body.activity_type0;
                var food_type0 = req.body.food_type0;
                var exercise_type0 = req.body.exercise_type0;
                var newFoodName0 = req.body.newFoodName0;
                var newFoodServingSize0 = req.body.newFoodServingSize0;
                var newFoodFat0 = req.body.newFoodFat0;
                var newFoodProtein0 = req.body.newFoodProtein0;
                var newFoodRAG0 = req.body.newFoodRAG0;
                var newFoodSAG0 = req.body.newFoodSAG0;
                var newExerciseName0 = req.body.newExerciseName0;
                var newExerciseIntensity0 = req.body.newExerciseIntensity0;
                var foodQtyInput0 = req.body.foodQtyInput0;
                var exerciseQtyInput0 = req.body.exerciseQtyInput0;
                var deleted = req.body.deleted0;
                var dayInput0 = req.body.dayNumberInput0;
                var hourSelect0 = req.body.hourSelect0;
                var minuteSelect0 = req.body.minuteSelect0;

                var endDay = req.body.endTimeDayInput;
                var endHour = req.body.endTimeHourSelect;
                var endMinute = req.body.endTimeMinuteSelect;
                
                writeActivitySetToDatabaseArray(activity_type0, food_type0, exercise_type0, newFoodName0, newFoodServingSize0, newFoodFat0, newFoodProtein0, newFoodRAG0, newFoodSAG0, newExerciseName0, newExerciseIntensity0, foodQtyInput0, exerciseQtyInput0, totalActivitiesInDb_1, totalExerciseTypesinDb_1, totalFoodTypesinDb_1, dayInput0, hourSelect0, minuteSelect0, deleted, endDay, endHour, endMinute);

                runSimulationProgram(activity_type0, food_type0, exercise_type0, newFoodName0, newFoodServingSize0, newFoodFat0, newFoodProtein0, newFoodRAG0, newFoodSAG0, newExerciseName0, newExerciseIntensity0, foodQtyInput0, exerciseQtyInput0, activityDbArray, totalActivitiesInDb_1, totalExerciseTypesinDb_1, totalFoodTypesinDb_1, dayInput0, hourSelect0, minuteSelect0, deleted, req, res, endDay, endHour, endMinute, foodActivitiesArray, exerciseActivitiesArray, simulationTickValuesArray);

                var activitySequenceKeyArray = [];
                var activitySequenceDataArray = [];
                var activitySequenceArray = [];

                var baseName = "Create New Activity Sequence";
                var baseActivities = [];
                var activitySequenceBase = {name: baseName, activities: baseActivities};
                activitySequenceDataArray.push(activitySequenceBase);

                var userId = firebase.auth().currentUser.uid;
                var query = firebase.database().ref('/users/' + userId + '/activitySequences').orderByKey();
                query.once('value').then(function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                        var item = childSnapshot.val();
                        item.key = childSnapshot.key;

                        var date = item.dateCreated;

                        var activitiesInSequence = [];
                        childSnapshot.forEach(function(doubleChildSnapshot){
                            var item1 = doubleChildSnapshot.val();
                                item1.key = doubleChildSnapshot.key;
                                activitiesInSequence.push(item1);
                        });

                        var exerciseCt = 0;
                        var foodCt = 0;
                        for(p = 0; p < activitiesInSequence.length; p++){
                            if(activitiesInSequence[p].activity_type == "Food"){
                                foodCt++;
                            }
                            if(activitiesInSequence[p].activity_type == "Exercise"){
                                exerciseCt++;
                            }
                        }

                        var sequenceName = "Created on: " + date + ", # Exercise Activities: " + exerciseCt + ", # Food Activities: " + foodCt;
                        var newObj = {name: sequenceName, activities: activitiesInSequence};
                        activitySequenceDataArray.push(newObj);
                    });

                    activitySequenceArray = activitySequenceDataArray;
                       
                    //res.render('newSimulation', {activityTypes: activityTypesArray, foodTypes: foodActivitiesArray, exerciseTypes: exerciseActivitiesArray, hours: hourArray, minutes: minutesArray, simulations: activitySequenceArray});
                    res.render('simulationResults', {tickDataArray: simulationTickValuesArray});
                });
            });
        });
    });
};
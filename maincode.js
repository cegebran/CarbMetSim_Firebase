// User defined class
// to store element and its priority
var random = require("random")
const seedrandom = require('seedrandom')
random.use(seedrandom("100"))

class QElement {
    constructor(firetime, activityID, subID, howmuch)
    {
        this.firetime = firetime;
        this.ID = activityID;
        this.subID = subID;
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
            }*/console.log("//////////////////////"+ i)
            if(this.items[i].costs_less(element) == false){
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

class RBCBin {
    constructor(){
    var RBCs = 0;
    var glycatedRBCs = 0;
}
}

class Blood {   ////////////////////================================================================================
//private RBCBin[] AgeBins = new RBCBin[MAXAGE+1];// Aging Bins
/////////////////////==========================================================================
currentHbA1c() {
    var rbcs = 0;
    var glycated_rbcs = 0;
    
    for(var i = 0; i <= Blood.MAXAGE; i++) {
        rbcs += this.AgeBins[i].RBCs;
        rbcs += this.AgeBins[i].glycatedRBCs;
        glycated_rbcs += this.AgeBins[i].glycatedRBCs;
    }
    
    if(rbcs == 0) {
        console.log("Error in Bloody::currentHbA1c");
        throw new Error("There is a mistake in this")
    }
    return glycated_rbcs/rbcs;
}
///////////////////////////////////=========================================================
updateRBCs() {
    // will be called once a day
    this.bin0--;
    if( this.bin0 < 0 ) this.bin0 = Blood.MAXAGE;
    //New RBCs take birth
    this.AgeBins[bin0].RBCs = this.rbcBirthRate_;
    this.AgeBins[bin0].glycatedRBCs = 0;
    
    //console.log("New RBCs: " + AgeBins[bin0].RBCs);bin0
    // Old (100 to 120 days old) RBCs die
    var start_bin = this.bin0 + Blood.HUNDREDDAYS;
    
    if( start_bin > Blood.MAXAGE ) {start_bin -= (Blood.MAXAGE + 1);}
    //System.out.println("Old RBCs Die");
    for(var i = 0; i < (Blood.MAXAGE-Blood.HUNDREDDAYS); i++) {
        var j = start_bin + i;
        if (j < 0) {
            this.body.time_stamp();
            console.log(" RBC bin value negative " + j);
            throw new Error("There is some mistake")///////////////////////////////////////
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
    for(var i = 0; i <= Blood.MAXAGE; i++) {
        var newly_glycated = glycation_prob * this.AgeBins[i].RBCs;
        this.AgeBins[i].RBCs -= newly_glycated;
        this.AgeBins[i].glycatedRBCs += newly_glycated;
        //System.out.println("bin: " + i + ", RBCs " + AgeBins[i].RBCs + ", Glycated RBCs " + AgeBins[i].glycatedRBCs);
    }
    
    console.log("New HbA1c: " + this.currentHbA1c()+ this.body.time_stamp());
}


    // Constructor
constructor(myBody) {
    this.body = myBody;
    this.lactate = 450.39; //450.39; //mg

    this.bin0 = 1;
    this.rbcBirthRate_ = 144.0*60*24; // in millions per minute
    this.glycationProbSlope_ = 0.085/10000.0;
    this.glycationProbConst_ = 0;
    
    // all contents are in units of milligrams of glucose
    
    this.fluidVolume_ = 50.0; // in deciliters
    
    this.gngSubstrates = 0;
    this.alanine = 0;
    this.branchedAminoAcids = 0;
    this.unbranchedAminoAcids = 0;
    this.glutamine = 0;
    this.baseInsulinLevel_ = 0;
    this.peakInsulinLevel_ = 1.0;
    this.insulin = this.baseInsulinLevel_;

    
    
    //Gerich: insulin dependent: 1 to 5 micromol per kg per minute
    this.glycolysisMin_ = 0.35 * 0.5 * 0.1801559;
    this.glycolysisMax_ =  0.35 * 2 * 0.1801559;
    
    this.glycolysisToLactate_ = 1.0;
    
    this.normalGlucoseLevel_ = 210; //mg/dl
    this.glucose = this.normalGlucoseLevel_ * this.fluidVolume_;
    this.highGlucoseLevel_ = 360; //mg/dl
    this.minGlucoseLevel_ = 40; //mg/dl
    this.highLactateLevel_ = 4053.51; // mg
    this.glycolysisPerTick = 0;
    // 9 mmol/l of lactate = 4.5 mmol/l of glucose = 4.5*180.1559*5 mg of glucose = 4053.51mg of glucose
    // 1mmol/l of lactate = 0.5mmol/l of glucose = 0.5*180.1559*5 mg of glucose = 450.39 mg of glucose

    // initial number of RBCs
    var num = 420;
    this.AgeBins = Array.apply(null, Array(num)).map(function () { return new RBCBin(); });
    for(var i = 0; i <= Blood.MAXAGE; i++)
    {
        this.AgeBins[i] = new RBCBin();
        this.AgeBins[i].RBCs = 0.94*this.rbcBirthRate_;
        this.AgeBins[i].glycatedRBCs = 0.06*this.rbcBirthRate_;
    }

    this.avgBGL = 100.0;
    this.avgBGLOneDay = 0;
    this.avgBGLOneDaySum = 0;
    this.avgBGLOneDayCount = 0;
    
    this.glycolysisPerTick = 0;
    this.totalGlycolysisSoFar = 0;
}

processTick() {
    var x; 
    
    var glycolysisMin__ =this.body.sample(1000.0 * this.glycolysisMin_);
    
    
    
    x = glycolysisMin__/1000;
    console.log("this.body.sample after random" + x)
    var toGlycolysis = this.body.glycolysis(x, this.glycolysisMax_);
    
    if(toGlycolysis > this.glucose) toGlycolysis = this.glucose;
    
    this.glucose -= toGlycolysis;
    this.glycolysisPerTick = toGlycolysis;
    this.body.blood.lactate += this.glycolysisToLactate_ * toGlycolysis;
    //console.log("Glycolysis in blood, blood glucose " + this.glucose + " mg, lactate " + this.lactate + " mg");
    
    var bgl = this.glucose/this.fluidVolume_;
    
    if( bgl >= this.highGlucoseLevel_)
        this.insulin = this.peakInsulinLevel_;
    else
    {
        
            this.insulin = this.baseInsulinLevel_+ (this.peakInsulinLevel_-this.baseInsulinLevel_)*(bgl - this.normalGlucoseLevel_)/(this.highGlucoseLevel_ - this.normalGlucoseLevel_);
            
            if(this.insulin < this.baseInsulinLevel_)
            {
                this.insulin = this.baseInsulinLevel_;
            }
    }
    
  //calculating average bgl during a day
    
    if( this.avgBGLOneDayCount == Blood.ONEDAY )
    {
        this.avgBGLOneDay = this.avgBGLOneDaySum/this.avgBGLOneDayCount;
        this.avgBGLOneDaySum = 0;
        this.avgBGLOneDayCount = 0;
        this.updateRBCs();
        this.body.time_stamp();
        console.log(" Blood::avgBGL " + this.avgBGLOneDay);
    }
    
    this.avgBGLOneDaySum += bgl;
    this.avgBGLOneDayCount++;
    
    console.log("Blood:: glycolysis " + this.glycolysisPerTick + this.body.time_stamp());
    
    console.log("Blood:: insulinLevel " + this.insulin + this.body.time_stamp());
    
    //BUKET NEW: For the calculation of Incremental AUC
    //if(glcs > 100 && SimCtl::ticks < 120){
    //  SimCtl::AUC = SimCtl::AUC + (glcs-100);
    //}
}

setParams(){
    for(var [key, value] of this.body.metabolicParameters.get(body.bodyState.state).get(BodyOrgan.BLOOD.value).entries()) {
        switch (key) {
            case "rbcBirthRate_" : { this.rbcBirthRate_ = value; break; }
            case "glycationProbSlope_" : { this.glycationProbSlope_ = value; break; }
            case "glycationProbConst_" : { this.glycationProbConst_ = value; break; }
            case "minGlucoseLevel_" : { this.minGlucoseLevel_ = value; break; }
            case "normalGlucoseLevel_" : { this.normalGlucoseLevel_ = value; break; }
            case "highGlucoseLevel_" : { this.highGlucoseLevel_ = value; break; }
            case "highLactateLevel_" : { this.highLactateLevel_ = value; break; }
            case "glycolysisMin_" : { this.glycolysisMin_ = value; break; }
            case "glycolysisMax_" : { this.glycolysisMax_ = value; break; }
        }
    }
}
getBGL() { return this.glucose/this.fluidVolume_; }

removeGlucose(howmuch) {
     this.glucose -= howmuch;
    //System.out.println("Glucose consumed " + howmuch + " ,glucose left " + glucose);
    if (this.getBGL() <= this.minGlucoseLevel_) {
        console.log(" bgl dips to: " + this.getBGL() + this.body.time_stamp());
        throw new Error("There is some error");       
    }
}

addGlucose(howmuch) {
    this.glucose += howmuch;
    
    //this.body.time_stamp();
    //console.log("BGL: " + this.getBGL());
}


getGNGSubstrates(){ 
    return (this.gngSubstrates + this.lactate + this.alanine + this.glutamine);
}

consumeGNGSubstrates(howmuch) {
                   
/*
 var total = this.gngSubstrates + this.lactate + this.alanine + this.glutamine;
 console.log("///////////////////////////////" + this.lactate);
    if( total < howmuch ) {
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
*/
if(this.lactate < howmuch){
    var total = this.lactate;
    this.lactate = 0;
    return total;
}
this.lactate -= howmuch;
return howmuch;

}

gngFromHighLactate(rate_) {
    // Gluconeogenesis will occur even in the presence of high insulin in proportion to lactate
    // concentration. High lactate concentration (e.g. due to high glycolytic activity) would 
    // cause gluconeogenesis to happen even if insulin concentration is high. But then 
    // Gluconeogenesis would contribute to glycogen store of the liver (rather than generating glucose).
    
    // rate_ is in units of mg per kg per minute
    var x = rate_ * this.lactate/this.highLactateLevel_;

    if( x > this.lactate ) 
        {x = this.lactate;}
    
    
    this.lactate -= x;
    return x;
}
}

Blood.ONEDAY = 24*60;
Blood.MAXAGE = 120;
Blood.HUNDREDDAYS = 100;

class Brain{
    constructor(myBody){
        this.glucoseOxidized_ = 83.333;
        this.glucoseToAlanine_ = 0;
        this.bAAToGlutamine_ = 0;
        this.body = myBody;
        this.oxidationPerTick = 0;
    }

    processTick() {
        var glucoseOxidized__ = this.body.sample(1000.0 * this.glucoseOxidized_);
        
        var g = glucoseOxidized__ / 1000;
        this.oxidationPerTick = g;
        this.body.blood.removeGlucose(g + this.glucoseToAlanine_);
        this.body.blood.alanine += this.glucoseToAlanine_;

        //Brain generate glutamine from branched amino acids.
        if( this.body.blood.branchedAminoAcids > this.bAAToGlutamine_ ) {
            this.body.blood.branchedAminoAcids -= this.bAAToGlutamine_;
            this.body.blood.glutamine += this.bAAToGlutamine_;
        } else {
            this.body.blood.glutamine += this.body.blood.branchedAminoAcids;
            this.body.blood.branchedAminoAcids = 0;
        }
        
        console.log("Brain Oxidation" + this.oxidationPerTick + this.body.time_stamp());
    }

    setParams(){
        for(var [key, value] of this.body.metabolicParameters.get(this.body.bodyState.state).get(BodyOrgan.BRAIN.value).entries()) {
            switch (key) {
                case "glucoseOxidized_" : { this.glucoseOxidized_ = value; break; }
                case "glucoseToAlanine_" : { this.glucoseToAlanine_ = value; break; }
                case "bAAToGlutamine_" : { this.bAAToGlutamine_ = value; break; }
            }
        }
    }
}

//package sim;
//import java.util.Map.Entry;

class Heart {
    constructor(mybody) {
    	this.body = mybody;
        this.lactateOxidized_ = 0;
        this.basalGlucoseAbsorbed_ = 14; //mg per minute
        //Skeletal Muscle Glycolysis, Oxidation, and Storage of an Oral Glucose Load- Kelley et.al.
        
        this.Glut4Km_ = 5*180.1559/10.0; //mg/dl equivalent of 5 mmol/l
        this.Glut4VMAX_ = 0; //mg per kg per minute
        this.oxidationPerTick = 0;
    }
    
    processTick()
    {
        var basalGlucoseAbsorbed__ = this.body.sample(1000.0 * this.basalGlucoseAbsorbed_);
        
        var basalAbsorption = basalGlucoseAbsorbed__ / 1000;
        
        this.body.blood.removeGlucose(basalAbsorption);
        
        this.oxidationPerTick = basalAbsorption;
        
        //Absorption via GLUT4
        /*
        var bgl = this.body.blood.getBGL();
        var scale = (1.0 - this.body.insulinResistance_)*(this.body.blood.insulin)*(this.body.bodyWeight_);
        var g = scale*this.Glut4VMAX_*bgl/(bgl + this.Glut4Km_);
        
        this.body.blood.removeGlucose(g);
        
        this.oxidationPerTick += g;
        */
       this.body.time_stamp()
        console.log("Heart:: Oxidation " + this.oxidationPerTick );
        
        /*
        var lactateOxidized = lactateOxidized__ / 1000;
        if( this.body.blood.lactate >= this.lactateOxidized_ ) {
            this.body.blood.lactate -= this.lactateOxidized_;
        } else {
            this.body.blood.lactate = 0;
        }
        */
    }
    setParams() {
    for(var [key, value] of this.body.metabolicParameters.get(this.body.bodyState.state).get(BodyOrgan.ADIPOSE_TISSUE.value).entries()) {
            switch (key) {
    			case "lactateOxidized_" : { this.lactateOxidized_ = value; break; }
    			case "basalGlucoseAbsorbed_" : { this.basalGlucoseAbsorbed_ = value; break; }
    			case "Glut4Km_" : { this.Glut4Km_ = value; break; }
    			case "Glut4VMAX_" : { this.Glut4VMAX_ = value; break; }
    		}
    	}
    }
}

class Chyme{
    constructor(){//// These are taking the double values 
        this.origRAG = 0;
        this.origSAG = 0;
        this.RAG = 0;
        this.SAG = 0;
        this.ts = 0;
    }
}

class Intestine{
    constructor(MyBody)
    {
        this.body = MyBody;

        this.RAG_Mean_ = 2;
        this.RAG_StdDev_ = 0.5;
        this.SAG_Mean_ = 30;
        this.SAG_StdDev_ = 10;
        
        this.protein = 0; // mg
        this.glucoseInLumen = 0; // in milligrams
        this.glucoseInEnterocytes = 0; // in milligrams
        
        // Carb digestion parameters
        // support only normal distribution for RAG/SAG digestion so far.
        this.fluidVolumeInEnterocytes_ = 3; //dl
        this.fluidVolumeInLumen_ = 4; //dl
        
        //Michaelis Menten parameters for glucose transport
        this.Glut2Km_In_ = 20*180.1559/10.0; // mg/deciliter equal to 20 mmol/l (Frayn Table 2.2.1)
        this.Glut2VMAX_In_ = 800; //mg
        this.Glut2Km_Out_ = 20*180.1559/10.0; // mg/deciliter equal to 20 mmol/l (Frayn Table 2.2.1)
        this.Glut2VMAX_Out_ = 800; //mg
        //active transport rate
        this.sglt1Rate_ = 30; //mg per minute
        
        this.peakGlucoseConcentrationInLumen = 200*180.1559/10.0; // mg/dl equivalent of 200mmol/l
        
        this.aminoAcidsAbsorptionRate_ = 1; //mg per minute
        this.glutamineOxidationRate_ = 1; // mg per minute
        this.glutamineToAlanineFraction_ = 0.5;
        
        //Gerich: insulin dependent: 1 to 5 micromol per kg per minute
        this.glycolysisMin_ =  0.35*0.5*0.1801559;
        this.glycolysisMax_ =  0.35* 2.0*0.1801559;
        
        this.glycolysisPerTick = 0;
        this.toPortalVeinPerTick = 0;

        this.count = 0;
        this.totalRAGDigested = 0;
        this.totalSAGDigested = 0;

        this.chyme = Array.apply(null, Array(0)).map(function () { return new Chyme(); });

    }

    addChyme(rag, sag, proteinInChyme, fat)
    {
    	var c = new Chyme();
    	c.RAG = rag;
    	c.SAG = sag;
    	c.origRAG = rag;
    	c.origSAG = sag;
    	c.ts = this.body.ticks;
    	this.chyme.push(c);
    	++this.count;
    	this.protein += proteinInChyme;

        // very simple processing of fat for now
        this.body.adiposeTissue.addFat(fat);
    }
    
    erf(x) {
  // save the sign of x
                var sign = (x >= 0) ? 1 : -1;
                x = Math.abs(x);

  // constants
                 var a1 =  0.254829592;
                 var a2 = -0.284496736;
                 var a3 =  1.421413741;
                 var a4 = -1.453152027;
                 var a5 =  1.061405429;
                 var p  =  0.3275911;

  // A&S formula 7.1.26
                var t = 1.0/(1.0 + p*x);
                var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y; // erf(-x) = -erf(x);
}
    absorbGlucose()
    {
        var x; // to hold the random samples
        var activeAbsorption = 0;
        var passiveAbsorption = 0;
        
        var glLumen = 0;
        var glEnterocytes = 0;
        var glPortalVein = 0;
        
        var basalAbsorption__ = this.body.sample(1000.0 * this.sglt1Rate_);
        var Glut2VMAX_In__ = this.body.sample(1000.0 * this.Glut2VMAX_In_);
        var Glut2VMAX_Out__ = this.body.sample(1000.0 * this.Glut2VMAX_Out_);
        var glycolysisMin__ = this.body.sample(1000.0 * this.glycolysisMin_);
        
        if(this.glucoseInLumen > 0)
        {
            if (this.fluidVolumeInLumen_ <= 0)
            {
                console.log("Intestine::absorb Glucose");
                //cout << "Intestine.absorbGlucose" << endl;
                throw new Error("There is a error")
            }
        
            // Active transport first
            activeAbsorption = basalAbsorption__ / 1000;
            
            if(activeAbsorption >= this.glucoseInLumen)
            {
                activeAbsorption = this.glucoseInLumen;
                this.glucoseInEnterocytes += activeAbsorption;
    	        this.glucoseInLumen = 0;
            }
            else
            {
                this.glucoseInEnterocytes += activeAbsorption;
    	        this.glucoseInLumen -= activeAbsorption;
        
                //passive transport via GLUT2s now
                glLumen = this.glucoseInLumen/this.fluidVolumeInLumen_;
                glEnterocytes = this.glucoseInEnterocytes/this.fluidVolumeInEnterocytes_;
                var diff = (1.0)*(glLumen - glEnterocytes);
                
                if(diff > 0)
                {
                    // glucose concentration in lumen decides the number of GLUT2s available for transport.
                    // so, Vmax depends on glucose concentration in lumen
                    x = Glut2VMAX_In__ / 1000;
                    var effectiveVmax = (1.0) *(x*glLumen/this.peakGlucoseConcentrationInLumen);
        
                    if (effectiveVmax > this.Glut2VMAX_In_)
                        effectiveVmax = this.Glut2VMAX_In_;
                    
                    passiveAbsorption = effectiveVmax*diff/(diff + this.Glut2Km_In_);
        
                    if (passiveAbsorption > this.glucoseInLumen )
                        passiveAbsorption = this.glucoseInLumen;
                    
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
        
        if(diff > 0)
        {
            x = Glut2VMAX_Out__ / 1000;
            this.toPortalVeinPerTick = x*diff/(diff + this.Glut2Km_Out_);
            
            if(this.toPortalVeinPerTick > this.glucoseInEnterocytes )
                this.toPortalVeinPerTick = this.glucoseInEnterocytes;
            
            this.glucoseInEnterocytes -= this.toPortalVeinPerTick;
            this.body.portalVein.addGlucose(this.toPortalVeinPerTick);
        }
        
        // Modeling the glucose consumption by enterocytes: glycolysis to lactate.
        
        //Glycolysis. Depends on insulin level. Consumed glucose becomes lactate (Ref: Gerich).
        
        
        //x = (1.0)*(this.body.sample.sample(1000.0*this.glycolysisMin_));
        x = glycolysisMin__/1000.0; 
        console.log(".......////////////" + x)   
        this.glycolysisPerTick = this.body.glycolysis(x, this.glycolysisMax_);
        console.log(".......////////////" + x)   

        if( this.glycolysisPerTick > this.glucoseInEnterocytes){
            this.body.blood.removeGlucose(this.glycolysisPerTick - this.glucoseInEnterocytes);
            this.glucoseInEnterocytes = 0;
        }
        else{
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
        console.log("Intestine:: glLumen: " + glLumen + " glEntero " + glEnterocytes + " glPortal " + glPortalVein + ", " + x + "activeAbsorption " + activeAbsorption + " passiveAbsorption " + passiveAbsorption);
    }
    
    //The BCAAs, leucine, isoleucine, and valine, represent 3 of the 20 amino acids that are used in the formation of proteins. Thus, on average, the BCAA content of food proteins is about 15% of the total amino acid content."Interrelationship between Physical Activity and Branched-Chain Amino Acids"

    //The average content of glutamine in protein is about %3.9. "The Chemistry of Food" By Jan Velisek
    //Do we consider the dietary glutamine? I did not consider in my code but I can add if we need it.

    //Looks like cooking destroys dietary glutamine. So, no need to consider diet as source of glutamine.
    //-Mukul

    absorbAminoAcids()
    {
        var aminoAcidsAbsorptionRate__ =this.body.sample(1000.0 * this.aminoAcidsAbsorptionRate_);
        
        var glutamineOxidationRate__ = this.body.sample(1000.0 * this.glutamineOxidationRate_);
        
        var absorbedAA = (1.0) * aminoAcidsAbsorptionRate__/1000.0;
        

        if(this.protein < absorbedAA )
        {
            absorbedAA = this.protein;
        }
        
        this.body.portalVein.addAminoAcids(absorbedAA);
        this.protein -= absorbedAA;
        
        //Glutamine is oxidized
        var g = (1.0) * glutamineOxidationRate__/1000.0;

        if(this.body.blood.glutamine < g)
        {
                this.body.blood.alanine += this.glutamineToAlanineFraction_*(this.body.blood.glutamine);
                this.body.blood.glutamine = 0;
        }
        else
        {
            this.body.blood.glutamine -= g;
            this.body.blood.alanine += this.glutamineToAlanineFraction_*g;
        }
    }

    processTick(){

        var totalRAGConsumed = 0;
        var totalSAGConsumed = 0;
        var allDigested = true;

        for(var i = 0; i < this.count; i++){
            var RAGConsumed = 0;
            var t = this.body.ticks - this.chyme[i].ts;
            
            if(t == 0){
                RAGConsumed = this.chyme[i].origRAG * 0.5 * (1 + this.erf((t - this.RAG_Mean_) / (this.RAG_StdDev_ * Math.sqrt(2))));
            }
            else{
                RAGConsumed = this.chyme[i].origRAG * 0.5 * (this.erf((t - this.RAG_Mean_) / (this.RAG_StdDev_ * Math.sqrt(2))) - this.erf((t - 1 - this.RAG_Mean_) / (this.RAG_StdDev_ * Math.sqrt(2))));
            }
            
            if(this.chyme[i].RAG < RAGConsumed){
                RAGConsumed = this.chyme[i].RAG;
            }
            /*
            if(this.chyme[i].RAG < 0.01 * (this.chyme[i].origRAG)){
                RAGConsumed = this.chyme[i].RAG;
            }
            */
                
                
            this.chyme[i].RAG -= RAGConsumed;
            this.glucoseInLumen += RAGConsumed;
            totalRAGConsumed += RAGConsumed;
            
            var SAGConsumed = 0;
                
            if(t == 0){
                SAGConsumed = this.chyme[i].origSAG * 0.5 * (1 + this.erf((t - this.SAG_Mean_) / (this.SAG_StdDev_ * Math.sqrt(2))));
            }

            else{
                SAGConsumed = this.chyme[i].origSAG * 0.5 * (this.erf((t - this.SAG_Mean_) / (this.SAG_StdDev_ * Math.sqrt(2))) - this.erf((t - 1 - this.SAG_Mean_) / (this.SAG_StdDev_ * Math.sqrt(2))));
            }

            if(this.chyme[i].SAG < SAGConsumed){
                SAGConsumed = this.chyme[i].SAG;
            }
            /*
            if(this.chyme[i].SAG < 0.01 * this.chyme[i].origSAG){
                SAGConsumed = this.chyme[i].SAG;
            }
            */
            
            this.chyme[i].SAG -= SAGConsumed;
            this.glucoseInLumen += SAGConsumed;
            this.totalSAGConsumed += SAGConsumed;
            /*
            this.body.time_stamp();
            console.log("Chyme:: RAG " + this.chyme[i].RAG + "SAG " + this.chyme[i].SAG + " origRAG " + this.chyme[i].origRAG + " origSAG " + this.chyme[i].origSAG + " glucoseInLumen " + this.glucoseInLumen + " RAGConsumed " + RAGConsumed + " SAGConsumed " + SAGConsumed);
            
            if(this.chyme[i].RAG == 0 && this.chyme[i].SAG == 0){
                this.chyme.pop[i];
            }
            */
            if(this.chyme[i].RAG  > 0 || this.chyme[i].SAG > 0){
                    allDigested = false;
            }

        }
        if(allDigested){
            this.chyme = [];
        }

        this.totalRAGDigested += totalRAGConsumed;
        this.totalSAGDigested += totalSAGConsumed;

        this.body.time_stamp();
        console.log("Intestine:: RAGConsumed " + totalRAGConsumed + " SAGConsumed " + totalSAGConsumed);

        
        this.absorbGlucose();
        this.absorbAminoAcids();
        
        this.body.time_stamp();
        console.log("Intestine:: Glycolysis " + this.glycolysisPerTick);
        this.body.time_stamp();
        console.log("Intestine:: ToPortalVein " + this.toPortalVeinPerTick);
    }

    /*setParams()
    {
        for( ParamSet::iterator itr = body.metabolicParameters[body.bodyState][INTESTINE].begin();
            itr != body.metabolicParameters[body.bodyState][INTESTINE].end(); itr++)
        {
            if(itr.first.compare("aminoAcidAbsorptionRate_") == 0)
            {
                this.aminoAcidsAbsorptionRate_ = itr.second;
            }
            if(itr.first.compare("glutamineOxidationRate_") == 0)
            {
                this.glutamineOxidationRate_ = itr.second;
            }
            if(itr.first.compare("glutamineToAlanineFraction_") == 0)
            {
                this.glutamineToAlanineFraction_ = itr.second;
            }
            if(itr.first.compare("Glut2VMAX_In_") == 0)
            {
                this.Glut2VMAX_In_ = itr.second;
            }
            if(itr.first.compare("Glut2Km_In_") == 0)
            {
                this.Glut2Km_In_ = itr.second;
            }
            if(itr.first.compare("Glut2VMAX_Out_") == 0)
            {
                this.Glut2VMAX_Out_ = itr.second;
            }
            if(itr.first.compare("Glut2Km_Out_") == 0)
            {
                this.Glut2Km_Out_ = itr.second;
            }
            if(itr.first.compare("sglt1Rate_") == 0)
            {
                this.sglt1Rate_ = itr.second;
            }
            if(itr.first.compare("fluidVolumeInLumen_") == 0)
            {
                this.fluidVolumeInLumen_ = itr.second;
            }
            if(itr.first.compare("fluidVolumeInEnterocytes_") == 0)
            {
                this.fluidVolumeInEnterocytes_ = itr.second;
            }
            if(itr.first.compare("glycolysisMin_") == 0)
            {
                this.glycolysisMin_ = itr.second;
            }
            if(itr.first.compare("glycolysisMax_") == 0)
            {
                this.glycolysisMax_ = itr.second;
            }
            if(itr.first.compare("RAG_Mean_") == 0)
            {
                    this.RAG_Mean_ = itr.second;
            }
            if(itr.first.compare("RAG_StdDev_") == 0)
            {
                    this.RAG_StdDev_ = itr.second;
            }
            if(itr.first.compare("SAG_Mean_") == 0)
            {
                    this.SAG_Mean_ = itr.second;
            }
            if(itr.first.compare("SAG_StdDev_") == 0)
            {
                    this.SAG_StdDev_ = itr.second;
            }        
        }
    }*/
}

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

        this.fluidVolume_ = 12; //dl
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
    
    erf(x) {
  // save the sign of x
                var sign = (x >= 0) ? 1 : -1;
                x = Math.abs(x);

  // constants
                 var a1 =  0.254829592;
                 var a2 = -0.284496736;
                 var a3 =  1.421413741;
                 var a4 = -1.453152027;
                 var a5 =  1.061405429;
                 var p  =  0.3275911;

  // A&S formula 7.1.26
                var t = 1.0/(1.0 + p*x);
                var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y; // erf(-x) = -erf(x);
}
    
    processTick() {
        var x;  // to hold the random samples
       
        var glycogenToGlucose__ = this.body.sample(1000.0 * this.glycogenToGlucose_);
        
        var glucoseToGlycogen__ = this.body.sample(1000.0 * this.glucoseToGlycogen_);
        
        var glycolysisMin__ = this.body.sample(1000.0 * this.glycolysisMin_);
        
        var gngFromLactate__ =  this.body.sample(1000.0 * this.gngFromLactate_);
        
        var gngFromGlycerol__ =  this.body.sample(1000.0 * this.gngFromGlycerol_);
        
        var gngFromGlutamine__ =  this.body.sample(1000.0 * this.gngFromGlutamine_);
        
        var gngFromAlanine__ =  this.body.sample(1000.0 * this.gngFromAlanine_);
        
        var Glut2VMAX__ =  this.body.sample(1000.0 * this.Glut2VMAX_);
       

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

class PortalVein {
    constructor(body_) {
        this.body = body_;
        this.glucose = 0; //mg
        this.branchedAA = 0;	//mg
        this.unbranchedAA = 0; //mg
        this.fluidVolume_ = 5; // dl
    }
    
    processTick() {
        var bgl = this.body.blood.getBGL();
        var glucoseFromBlood = bgl*this.fluidVolume_;
        this.body.blood.removeGlucose(glucoseFromBlood);
        this.glucose += glucoseFromBlood;
        
        //this.body.time_stamp();
        //console.log("PortalVein:: " + this.glucose + " glucose/fluidVolume_ " + this.branchedAA + " " + this.unbranchedAA);
    }
    
    setParams() {
        for(var [key, value] of this.body.metabolicParameters.get(this.body.bodyState.state).get(BodyOrgan.PORTAL_VEIN.value).entrySet()) {            
            switch (key) {
                case "fluidVolume_" : { this.fluidVolume_ = value; break; }
            }
        }
    }
    
    getConcentration() {
        var gl = this.glucose/this.fluidVolume_;
        //this.body.time_stamp();
        //console.log("GL in Portal Vein: " + gl);
     
        return gl;
    }
    
    addGlucose(g) {this.glucose += g;}/////////////// Need to check this perfectly
    
    getGlucose(){return this.glucose;}
    
    removeGlucose(g) {
        this.glucose -= g;
        if( this.glucose < 0 ) {
            console.log("PortalVein glucose went negative");
            System.exit(-1);
        }
    }
    
    releaseAllGlucose() {
        this.body.blood.addGlucose(this.glucose);
        this.glucose = 0;
    }
    
    addAminoAcids(aa) {
        this.branchedAA += 0.15*aa;
        this.unbranchedAA += 0.85*aa;
        //this.body.time_stamp();
        //console.log(" PortalVein: bAA " + this.branchedAA + ", uAA " + this.unbranchedAA);
    }
    
    releaseAminoAcids() {
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
        //console.log(" BodyWeight: " + this.body.bodyWeight_);
	}

	setParams(){
		for(var [key, value] of this.body.metabolicParameters.get(this.body.bodyState.state).get(BodyOrgan.ADIPOSE_TISSUE.value).entries()) {
    		switch (key) {
    			case "glucoseOxidized_" : { this.glucoseAbsorbed = value; break; }
    			case "glucoseToAlanine_" : { this.lipolysisRate_ = value; break; }
    			case "bAAToGlutamine_" : { this.bAAToGlutamine_ = value; break; }
    		}
    	}
	}

	 lipogenesis(glucoseInMG) {
    	// one gram of glucose has 4kcal of energy
        // one gram of TAG has 9 kcal of energy
        //System.out.println("BodyWeight: Lipogenesis " + body.bodyWeight_ + " glucose " + glucoseInMG + " fat " + fat);
        this.body.bodyWeight_ -=  this.fat/1000.0;
        this.fat += (glucoseInMG/1000) * 4.0 / 9.0;
        this.body.bodyWeight_ += this.fat / 1000.0;
        //console.log("BodyWeight: Lipogenesis " + this.body.bodyWeight_ + " glucose " + glucoseInMG + " fat " + this.fat);
    }

     consumeFat(kcal) {

    	this.body.bodyWeight_ -= this.fat/1000.0;
        this.fat -= kcal/9.0;
        this.body.bodyWeight_ += this.fat/1000.0;
    }

      addFat(newFatInMG) {
    	 this.body.bodyWeight_ -= this.fat/1000.0;
    	 this.fat += newFatInMG/1000.0;
    	 this.body.bodyWeight_ += this.fat/1000.0;
    	 //console.log("BodyWeight: addFat " + this.body.bodyWeight_ + " newfat " + newFatInMG);
    } 
}

//package sim;

//import java.util.Map.Entry;

//import org.apache.commons.math3.distribution.PoissonDistribution;

class Muscles {
    constructor(myBody) {
        this.body = myBody;
        this.glycogenMax_ = 0.4*(this.body.bodyWeight_)*15000.0; //40% of body weight is muscles
        this.glycogen = this.glycogenMax_;
        this.glucose = 0;
        this.volume_ = 250;
        
        this.bAAToGlutamine_ = 0;
        
        this.basalGlucoseAbsorbed_ = 0; //mg per kg body weight per minute 
        
        //See the explanation in processTick()
        this.glycolysisMin_ = 0.35 * 1.0 * 0.1801559; //mg per kg per minute
        // 2.22 micromol per kg per minute = 2.22*180.1559/1000 mg per kg per minute = 0.4 mg per per minute
        this.glycolysisMax_ = 0.35 * 15.0 * 0.1801559; //mg per kg per minute
        this.glucoseToGlycogen_ = 15.0 * 0.1801559;
        this.Glut4Km_ = 5*180.1559/10.0; //mg/dl equivalent of 5 mmol/l
        this.Glut4VMAX_ = 2.7; //mg per kg per minute
        
        this.glucoseOxidationFraction_ = 0.5;
        this.totalGlucoseAbsorbed = 0;
        this.glucoseAbsorbedPerTick = 0;
        this.glycogenSynthesizedPerTick = 0;
        this.glycogenBreakdownPerTick = 0;
        this.oxidationPerTick = 0;
        this.glycogenOxidizedPerTick = 0;
        this.glycolysisPerTick = 0;
    }
    
    processTick() {
        var rand__ =this.body.sample(100);
        
        var glycolysisMin__ =  this.body.sample(1000.0 * this.glycolysisMin_);        
        
        var basalAbsorption__ =  0;
        
        var Glut4VMAX__ =  this.body.sample(1000.0 * this.Glut4VMAX_);
        
        //var baaToGlutamine__ = this.body.sample(1000.0 * this.bAAToGlutamine_);

        var glucoseToGlycogen__ =  this.body.sample(1000.0 * this.glucoseToGlycogen_);
        
        
        var x; // to hold the random samples
        var currEnergyNeed = this.body.currentEnergyExpenditure();
        var insulin_level = this.body.blood.insulin; 

        if( this.body.isExercising() ) {
            x =  rand__;
            this.oxidationPerTick = 0.1 * (x/100.0) * 1000.0 * (currEnergyNeed)/4;
        }
        
        if(this.glucose >= this.oxidationPerTick){
            this.glucose -= this.oxidationPerTick;
        }
        else{
            var g = this.oxidationPerTick - this.glucose;
            this.glucose = 0;
            this.body.blood.removeGlucose(g);
            this.glucoseAbsorbedPerTick += g;
        }
            
        var glycogenShare = 0;
        //Need to check this
        //var intensity = this.body.execiseTypes[this.body.currExercise].intensity_;
        var intensity = this.body.exerciseArray[this.body.currExercise].intensity;
        if(intensity >= 6){
            glycogenShare = 0.3;
        }
        else{
            if( intensity < 3.0 )
            {
                glycogenShare = 0;
            }
            else
            {
                glycogenShare = 0.3*(intensity - 3.0 )/3.0;
            }
        }
        
        x = rand__;
        this.glycogenOxidizedPerTick = glycogenShare * (x/100.0) * 1000.0 * (currEnergyNeed)/4;
        
        this.glycogen -= this.glycogenOxidizedPerTick;
        this.glycogenBreakdownPerTick += this.glycogenOxidizedPerTick;
        
        if(intensity < 18){
            x = glycolysisMin__;
            x = x * this.body.bodyWeight_ / 1000;
            
            if(x > this.glycolysisMax_ * this.body.bodyWeight_){
                x = this.glycolysisMax_ * this.body.bodyWeight_;
            }
            
            this.glycolysisPerTick = x + ((intensity - 1) / 17) * ((this.glycolysisMax_ * this.body.bodyWeight_) - x);
        }
        else{
            this.glycolysisPerTick = this.glycolysisMax_ * this.body.bodyWeight_;
        }
        
        this.glycogen -= this.glycolysisPerTick;
        console.log("/////////////////////////" + this.glycogen);
        this.glycogenBreakdownPerTick += this.glycolysisPerTick;
        this.body.blood.lactate += this.glycolysisPerTick;
        var kcalgenerated = (this.oxidationPerTick + this.glycogenOxidizedPerTick) * 0.004 + (this.glycolysisPerTick * 0.004/15.0);
        
        if(kcalgenerated < currEnergyNeed){
            this.body.adiposeTissue.consumeFat(currEnergyNeed - kcalgenerated);
        }
        else{
            x = basalAbsorption__;
            x = x * this.body.bodyWeight_ / 1000.0;
            
            this.body.blood.removeGlucose(x);
            this.glucoseAbsorbedPerTick = x;
            this.glucose += x;
            
            var bgl = this.body.blood.getBGL();
            var glMuscles = this.glucose / this.volume_;
            var diff = bgl - glMuscles;
            
            var scale = (this.body.glut4Impact_) * this.body.blood.insulin;
            var g;
            
            if(diff > 0){
                x = Glut4VMAX__;
                x = x * this.body.bodyWeight_ / 1000;
                g = scale * x * diff / (diff + this.Glut4Km_);
                

                this.body.time_stamp();
                console.log("Puzzle" + bgl + " " + diff + " " + this.body.glut4Impact_+ " " + this.body.blood.insulin + " " + scale + " " + x + " " + g);

                this.body.blood.removeGlucose(g);
                this.glucoseAbsorbedPerTick += g;
                this.glucose += g;
            }
            
                        
            x = glycolysisMin__/1000.0;
            this.glycolysisPerTick = this.body.glycolysis(x, this.glycolysisMax_);
            g = this.glycolysisPerTick;
       
            if(g <= this.glucose){
                this.glucose -= g;
                this.body.blood.lactate += g;
            }
            else{
                this.body.blood.lactate += this.glucose;
                this.glycolysisPerTick = this.glucose;
                this.glucose = 0;


                /*******************************
                g -= this.glucose;
                this.body.blood.lactate += this.glucose;
                this.glucose = 0;
                
                if(this.glycogen >= g){
                    this.glycogen -= g;
                    this.body.blood.lactate += g;
                    this.glycogenBreakdownPerTick += g;
                }
                else{
                    this.body.blood.lactate += this.glycogen;
                    this.glycolysisPerTick = this.glycolysisPerTick - g + this.glycogen;
                    this.glycogenBreakdownPerTick += this.glycogen;
                    this.glycogen = 0;
                }
                *******************/
            }
            var toGlycogen = (glucoseToGlycogen__ * this.body.bodyWeight_ )/ 1000.0;


            if(toGlycogen > this.glucose){
                toGlycogen = this.glucose;
            }

            if(toGlycogen > 0){
                this.glycogen += toGlycogen;
            }



            if(this.glycogen > this.glycogenMax_){
                toGlycogen -= this.glycogen - this.glycogenMax_;
                this.glycogen = this.glycogenMax_;
            }
            this.glycogenSynthesizedPerTick = toGlycogen;
            this.glucose -= toGlycogen;
            this.oxidationPerTick = this.glucose;
            this.glucose = 0;
            var kcalgenerated = (this.oxidationPerTick * 0.004) + (this.glycolysisPerTick * 0.004) / 15;
            if(kcalgenerated < currEnergyNeed){
                this.body.adiposeTissue.consumeFat(currEnergyNeed-kcalgenerated);
            }
            
            
            
        }
        
        if(this.glycogen < 0){
            this.body.time_stamp();
            console.log("Glycogen went negative\n");
            throw new Error("There is a error")
        }
        
        this.body.time_stamp();
        console.log("Muscles:: GlucoseAbsorbed" + this.glucoseAbsorbedPerTick);
        
        this.body.time_stamp();
        console.log("Muscles:: GlycogenSynthesis" + this.glycogenSynthesizedPerTick);
        
        this.body.time_stamp();
        console.log("Muscles:: GlycogenBreakdown" + this.glycogenBreakdownPerTick);
        
        this.body.time_stamp();
        console.log("Muscles:: glycogen" + this.glycogen);
        
        this.body.time_stamp();
        console.log("Muscles:: Oxidation" + this.oxidationPerTick);
        
        this.body.time_stamp();
        console.log("Muscles:: GlycogenOxidation" + this.glycogenOxidizedPerTick);
        
        this.body.time_stamp();
        console.log("Muscles:: Glycolysis" + this.glycolysisPerTick); 

        this.totalGlucoseAbsorbed += this.glucoseAbsorbedPerTick;
        
        this.body.time_stamp();
        console.log("Muscles:: totalGlucoseAbsorbed" + this.totalGlucoseAbsorbed); 
    }
   
    setParams() {
        for(var [key, value] of this.body.metabolicParameters.get(this.body.bodyState.state).get(BodyOrgan.MUSCLES.value).entries()) {
            switch (key) {
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


        
        
        //myegine is suppose to be called, not this.body.sample
        //x = this.body.sample.sample(x*this.glycolysisMin_);
        
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

class Stomach{
    constructor(myBody)
    {
        this.body = myBody;

        this.RAG = 0;
        this.SAG = 0;
        this.protein = 0;
        this.fat = 0;

        this.stomachEmpty = true;

        this.geConstant_ = 500.0; // mg
        this.geSlopeMin_ = 0.03; 
    }

    processTick()
    {
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

    	if(this.stomachEmpty)
    		return;

        //static std::poisson_distribution<int> geConstant__ (1000.0*geConstant_);
        var geConstant__ = this.body.sample.sample(1000.0*this.geConstant_);
        
        var geConstant = geConstant__ / 1000;
     
    	var totalFood = this.RAG + this.SAG + this.protein + this.fat;
    	// calorific density of the food in stomach
    	var calorificDensity = (1.0) * (4.0*(this.RAG+this.SAG+this.protein) + 9.0*this.fat)/totalFood; 
    	var geSlope = (1.0) * (9.0 * this.geSlopeMin_/calorificDensity);

        var geBolus = geConstant + geSlope * totalFood;

        //this.body.time_stamp();
    	//console.log("Gastric Emptying:: Total Food " + totalFood + " Calorific Density " + calorificDensity
    	//+ " geSlopeMin " + geSlopeMin + " geSlope " + geSlope + " geConstant " + geConstant + " Bolus " + geBolus + endl);

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

        this.body.time_stamp();
        console.log("Gastric Emptying:: Total Food" + totalFood + "Calorific Density "+ calorificDensity + " geSlope" + geSlope + 
            "ragInBolus " + ragInBolus + "sagInBolus " + sagInBolus);

        if((this.RAG == 0) && (this.SAG == 0) && (this.protein == 0) && (this.fat == 0))
        {
            this.stomachEmpty = true;
            this.body.stomachEmpty();
        }
        
        //this.body.time_stamp();
        //console.log("Stomach : SAG " + this.SAG + " RAG " + this.RAG +  " protein " + this.protein + " fat " + this.fat + endl); 
    }

    addFood(foodID, howmuch)
    {
        // howmuch is in grams
        if(howmuch == 0)
            return;
        
        //name is type string
        var name = this.body.foodTypes[foodID].name;
        
        var numServings = (1.0) * (howmuch/(this.body.foodTypes[foodID].servingSize));
       
        this.RAG += 1000.0*numServings*(this.body.foodTypes[foodID].RAG); // in milligrams
        this.SAG += 1000.0*numServings*(this.body.foodTypes[foodID].SAG); // in milligrams
        this.protein += 1000.0*numServings*(this.body.foodTypes[foodID].protein); // in milligrams
        this.fat += 1000.0*numServings*(this.body.foodTypes[foodID].fat); // in milligrams
        
        if((this.RAG > 0) || (this.SAG > 0) || (this.protein > 0) || (this.fat > 0))
            this.stomachEmpty = false;
        
        //this.body.time_stamp();
        //console.log("Adding " + howmuch + " grams of " + name + " to stomach");   
    }

    /*
    setParams()
    {
        for( ParamSet::iterator itr = body.metabolicParameters[body.bodyState][STOMACH].begin();
            itr != body.metabolicParameters[body.bodyState][STOMACH].end(); itr++)
        {
            if(itr.first.compare("geConstant_") == 0)
            {
                    geConstant_ = itr.second;
            }
            if(itr.first.compare("geSlopeMin_") == 0)
            {
                    geSlopeMin_ = itr.second;
            }
        }
    }
    */
}

//var firebase = require('firebase');
//var async = require('async');

const TICKS_PER_DAY = 24 * 60;
const TICKS_PER_HOUR = 60;

const EventType = {
    FOOD: 'FOOD',
    EXERCISE: 'EXERCISE',
    HALT: 'HALT',
    METFORMIN: 'METFORMIN',
    INSULIN_SHORT: 'INSULIN_SHORT',
    INSULIN_LONG: 'INSULIN_LONG'
}    

class Event{
    constructor(fireTime, type){
        this.type = type;
        this.subtype = "";
        this.howmuch = "";
        this.day = 0;
        this.hour = 0;
        this.minutes = 0;
        this.fireTime = fireTime;
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
        super(fireTime, EventType.HALT);
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
        var num = 420;
        this.exerciseArray = Array.apply(null, Array(num)).map(function () { return new ExerciseType(); });
        this.foodArray = Array.apply(null, Array(num)).map(function () { return new FoodType(); });
        this.EventArray  = Array.apply(null, Array(num)).map(function () { return new Event(); });
     
        this.glut4Impact_ = 0.5;
    	this.liverGlycogenBreakdownImpact_ = 1.27;
    	this.liverGlycogenSynthesisImpact_ = 0.8;
    	this.gngImpact_ = 1.46;
    	this.glycolysisMinImpact_ = 6.0;
    	this.glycolysisMaxImpact_ = 0.9;
		this.excretionKidneysImpact_ = 1.40;

        this.bodyWeight_ = 93; //kg
        this.fatFraction = 0.2;
        this.ticks = 0;
        this.insulinResistance_ = 0;
        this.insulinPeakLevel_ = 0.5;
        this.bodyState = BodyState.POSTABSORPTIVE_RESTING;

        //this.adiposeTissue = new AdiposeTissue(this);
        //this.muscles = new Muscles(this);

        this.currExercise = 0;
        this.currEnergyExpenditure = 1.0/60.0;
        this.exerciseOverAt = 0;

		this.insulinImpactOnGlycolysis_Mean = 0.45;
		this.insulinImpactOnGlycolysis_StdDev = 0.05;
		this.insulinImpactOnGNG_Mean = 0.9999;
		this.insulinImpactOnGNG_StdDev = 0.0001;
		this.insulinImpactGlycogenBreakdownInLiver_Mean = 0.1;
		this.insulinImpactGlycogenBreakdownInLiver_StdDev = 0.01;
		this.insulinImpactGlycogenSynthesisInLiver_Mean = 0.3;
		this.insulinImpactGlycogenSynthesisInLiver_StdDev = 0.1;

		this.totalGlycolysisSoFar = 0;
    	this.totalOxidationSoFar = 0;
    	this.totalGlycogenStorageSoFar = 0;
    	this.totalGlycogenBreakdownSoFar = 0;
    	this.totalGNGSoFar = 0;
    	this.totalEndogeneousGlucoseReleaseSoFar = 0;
		this.totalGlucoseReleaseSoFar = 0;



        this.eventQ = new PriorityQueue();


        this.stomach = new Stomach(this);
        this.intestine = new Intestine(this);
        this.portalVein = new PortalVein(this);
        this.liver = new Liver(this);
        this.brain = new Brain(this);
        this.heart = new Heart(this);
        this.blood = new Blood(this);


        this.kidneys = new Kidney(this);
        this.adiposeTissue = new AdiposeTissue(this);
        this.muscles = new Muscles(this);


        this.tempGNG = 0;
        this.tempGlycolysis = 0;
        this.tempOxidation = 0;
        this.tempExcretion = 0;
        this.tempGlycogenStorage = 0;
        this.tempGlycogenBreakdown = 0; 
    }


    readExerciseFile(file){
        var count = 0
        var exerciseArray = [];
 
        jQuery.get(file, function(data){
        console.log("READING EXERCISE FILE");
        console.log("-------------------------------");
        var lines = data.split('\n');
        var lineNum = 0;
        var count = 0;      
        var exercise = new ExerciseType();
        
        //for loop to seperate each new line of text file
        for(var line = 0; line < lines.length; line++){
            var properties = lines[line].split(' ');
            var exercise = new ExerciseType();
            exercise.exerciseID = properties[0];
            exercise.name = properties[1];
            exercise.intensity = properties[2];
            count++;

            exerciseArray[lineNum] = exercise;
            console.log("exercise: " + exerciseArray[lineNum].name + " " + exerciseArray[lineNum].intensity);
          
            lineNum++;
            
            console.log("-------------------------------");
        }
        });
    }

    addExeciseType(id, name, intensity){
        this.exerciseArray[id] = new ExerciseType();
        this.exerciseArray[id].exerciseID = id
        this.exerciseArray[id].name       = name
        this.exerciseArray[id].intensity  = intensity
        console.log("exercise: " + this.exerciseArray[id].name + " " + this.exerciseArray[id].intensity);
    }
 
    sample(value){
   
        var poisson = random.poisson(value)
        return (poisson());
    }


    erf(x) {
  // save the sign of x
                var sign = (x >= 0) ? 1 : -1;
                x = Math.abs(x);

  // constants
                 var a1 =  0.254829592;
                 var a2 = -0.284496736;
                 var a3 =  1.421413741;
                 var a4 = -1.453152027;
                 var a5 =  1.061405429;
                 var p  =  0.3275911;

  // A&S formula 7.1.26
                var t = 1.0/(1.0 + p*x);
                var y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y; // erf(-x) = -erf(x);
}
    //Original SimCtl Codde now put here
    elapsed_days(){
         return this.ticks / TICKS_PER_DAY; 
    }
    
    elapsed_hours() {
        var x = this.ticks % TICKS_PER_DAY;
        return (x / TICKS_PER_HOUR);
    }
    
    elapsed_minutes() {
        var x = this.ticks % TICKS_PER_DAY;
        return (x % TICKS_PER_HOUR);
    }
    
    time_stamp(){
        console.log(parseInt(this.elapsed_days()) + ":" + parseInt(this.elapsed_hours()) + ":" + parseInt(this.elapsed_minutes()) + ":    "+ this.ticks);
    }

    insulinImpactOnGlycolysis(){
    	var insulin_level = this.blood.insulin;
    	var scale = 0.5*(1 + this.erf((insulin_level - this.insulinImpactOnGlycolysis_Mean)/(this.insulinImpactOnGlycolysis_StdDev*Math.sqrt(2))));
    	
    	return scale;
    }

    insulinImpactOnGNG(){
    	return 1.0;
    }

    insulinImpactOnGlycogenBreakdownInLiver(){
    	var insulin_level = this.blood.insulin;
    	var scale = 0.5*(1 + this.erf((insulin_level - this.insulinImpactGlycogenSynthesisInLiver_Mean)/(this.insulinImpactGlycogenSynthesisInLiver_StdDev*Math.sqrt(2))));
     
        return (1.0 - scale);
    }

    insulinImpactOnGlycogenSynthesisInLiver(){
    	var insulin_level = this.blood.insulin;
    	var scale =  0.5*(1 + this.erf((insulin_level - this.insulinImpactGlycogenSynthesisInLiver_Mean)/(this.insulinImpactGlycogenSynthesisInLiver_StdDev*Math.sqrt(2))));
    	return scale;
    }

    glycolysis(min, max){
    	var max_ = max * this.bodyWeight_ * this.glycolysisMaxImpact_;
    	var min_ = min * this.bodyWeight_ * this.glycolysisMinImpact_;

    	if(min_ > max_){
    		min_ = max_;
    	}

    	var toGlycolysis = min_ + this.insulinImpactOnGlycolysis() * (max_ - min_);
    	return toGlycolysis;
    }

    
    currentEnergyExpenditure(){
    	return this.bodyWeight_ * this.currEnergyExpenditure;
    }


    
    processTick(){

        this.portalVein.processTick();

        this.stomach.processTick();
        this.intestine.processTick();
        this.liver.processTick();
        this.adiposeTissue.processTick();

        this.brain.processTick();
        this.heart.processTick();
        
        this.muscles.processTick();


        this.kidneys.processTick();
        this.blood.processTick();


        var x = (this.intestine.glycolysisPerTick + this.liver.glycolysisPerTick + this.kidneys.glycolysisPerTick + this.muscles.glycolysisPerTick+ this.blood.glycolysisPerTick);
        //////////////////////////////////There should be a Time stamp (remember)
        
        console.log(" bgl : " + this.blood.getBGL() + " weight :"  + this.bodyWeight_ + this.time_stamp());
     
        console.log("TotalGlucolysis :" + (this.intestine.glycolysisPerTick + this.liver.glycolysisPerTick + this.kidneys.glycolysisPerTick + this.muscles.glycolysisPerTick+ this.blood.glycolysisPerTick) + this.time_stamp());
        this.totalGlycolysisSoFar += x;
       
        console.log("HumanBody:: TotalGlycolysisSoFar " + this.totalGlycolysisSoFar + this.time_stamp())

        x = (this.kidneys.gngPerTick + this.liver.gngPerTick);
        this.totalGNGSoFar += x;

        console.log("HumanBody:: Total GNG :" + (this.kidneys.gngPerTick + this.liver.gngPerTick) + this.time_stamp());

        console.log("HumanBody:: Total GNGSoFar :" + this.totalGNGSoFar + this.time_stamp());

        console.log("Total Oxidation :" + (this.brain.oxidationPerTick+this.heart.oxidationPerTick+this.muscles.oxidationPerTick) + this.time_stamp());
        this.totalOxidationSoFar += (this.brain.oxidationPerTick+this.heart.oxidationPerTick+this.muscles.oxidationPerTick);

        console.log("HumanBody:: TotalOxidationSoFar " + this.totalOxidationSoFar + this.time_stamp());

        console.log("HumanBody:: UseOfGlucoseOutsideLiverKidneysMuscles :" + (this.blood.glycolysisPerTick + this.brain.oxidationPerTick + this.heart.oxidationPerTick + this.intestine.glycolysisPerTick) + this.time_stamp());

        x = (this.liver.toGlycogenPerTick + this.muscles.glycogenSynthesizedPerTick);
        this.totalGlycogenStorageSoFar += x;

        console.log("HumanBody:: TotalGlycogenStoragePerTick " + x + this.time_stamp());

        console.log("HumanBody:: TotalGlycogenStorageSoFar  " + this.totalGlycogenStorageSoFar + this.time_stamp());

        x = (this.liver.fromGlycogenPerTick + this.kidneys.gngPerTick + this.liver.gngPerTick);
        this.totalEndogeneousGlucoseReleaseSoFar += x;

        console.log("HumanBody:: TotalEndogeneousGlucoseReleasePerTick " + x + this.time_stamp());

        console.log("HumanBody:: TotalEndogeneousGlucoseReleaseSoFar " + this.totalEndogeneousGlucoseReleaseSoFar + this.time_stamp());


        x = (this.intestine.toPortalVeinPerTick + this.liver.fromGlycogenPerTick + this.kidneys.gngPerTick + this.liver.gngPerTick);
        this.totalGlucoseReleaseSoFar += x;

        console.log("HumanBody:: TotalGlucoseReleasePerTick " + x + this.time_stamp());

        console.log("HumanBody:: TotalGlucoseReleaseSoFar  " + this.totalGlucoseReleaseSoFar + this.time_stamp());



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
        console.log("///////////////////" + this.ticks)
        if(this.ticks == 600){

            this.tempGNG = this.totalGNGSoFar;
            this.tempGlycolysis = this.totalGlycolysisSoFar;
            this.tempOxidation = this.totalOxidationSoFar;
            this.tempExcretion = this.kidneys.totalExcretion;
            this.tempGlycogenStorage = this.totalGlycogenStorageSoFar;
            this.tempGlycogenBreakdown = this.totalGlycogenBreakdownSoFar;

        }

        if(this.ticks == 960){
            console.log("Simulation Results :: GNG" + this.totalGNGSoFar - this.tempGNG +
                "  glycolysis : "+ this.totalGlycolysisSoFar - this.tempGlycolysis
                + "  Oxidation :" + this.totalOxidationSoFar - this.tempOxidation +
                "   Excretion: " + this.kidneys.totalExcretion - this.tempExcretion +
                "  Glycogen Storage : " + this.totalGlycogenStorageSoFar - this.tempGlycogenStorage +
                "  Glycogen breakdown" + this.totalGlycogenBreakdownSoFar - this.tempGlycogenBreakdown)
        
        }

    }
    
    run_simulation(){
         while(true){
            var val;
            while( (val = this.fire_event()) == 1);
                this.processTick();
                this.ticks++;
            
                console.log(this.elapsed_days() + ":" + this.elapsed_hours() + ":" + this.elapsed_minutes());
}
    }
    
    processFoodEvent(foodID, howmuch){
        this.stomach.addFood(foodId, howmuch);
        var oldState = this.bodyState;
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
        
        if(this.bodyState != oldState){
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
            // SimCtl::time_stamp();

            Console.log("Exercise within Exercise!");
            process.exit();
        }

        this.currExercise = exerciseID;

        // need to look into Javascript maps
        this.currEnergyExpenditure = (this.exerciseTypes[exerciseID].intensity_)/60.0;

        if(this.bodyState == BodyState.FED_RESTING){
            this.bodyState = BodyState.FED_EXERCISING;
            // Look into accessing SimCtl
            this.exerciseOverAt = this.ticks + duration;
            return;
        }

        if(this.bodyState == BodyState.POSTABSORPTIVE_RESTING){
            this.bodyState = BodyState.POSTABSORPTIVE_EXERCISING;
            // Look into accessing SimCtl
            this.exerciseOverAt = this.ticks + duration;
            return;
        }
    }


    addFoodType(id, name, servingSize,RAG,SAG,protein,fat){
        this.foodArray[id] = new ExerciseType();
        this.foodArray[id].foodID   = id
        this.foodArray[id].name     = name
        this.foodArray[id].servingSize = servingSize
        this.foodArray[id].RAG = RAG
        this.foodArray[id].SAG = SAG
        this.foodArray[id].protein  = protein
        this.foodArray[id].fat = fat
        console.log("exercise: " + this.foodArray[id].name + " " + this.foodArray[id].protein);
    }
    
    fire_event(){
        var event_ = this.eventQ.front();;
           

         if(event_.fireTime > this.ticks){
            console.log("I am here ");

            return -1;
        }


        if(event_ === "No elements in Queue"){
            console.log("No event left");
            throw new Error("There is some wrong");
        }

        
        console.log("ticks = " + this.ticks + ": " + this.elapsed_days() + "::" + this.elapsed_hours() + "::" + this.elapsed_minutes());
        
        console.log("event fire time: " + event_.fireTime);

        var event_type = event_.ID;
        console.log("///////////////" + event_type)
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
            case 0:
                var e = new FoodEvent(fireTime, howmuch, subtype);
                this.eventQ.enqueue(e);
                console.log("/////////////////////////////////////"+ e)
                break;
            case  1:
                var e = new ExerciseEvent(fireTime, howmuch, subtype);
                console.log("/////////////////////////////////////"+ e)

                this.eventQ.enqueue(e);
                break;
            case 2:
                var e = new HaltEvent(fireTime);
                console.log("///////////////////////////////////// I came correctly to here"+ e)

                this.eventQ.enqueue(e);
                break;
            default:
                break;
        }
    }
    

    addEventType(id,type, subtype, howmuch, day, hour, minutes){
        this.EventArray[id] = new Event();
        this.EventArray[id].type = type
        this.EventArray[id].subtype  = subtype
        this.EventArray[id].howmuch = howmuch
        this.EventArray[id].day = day
        this.EventArray[id].hour = hour
        this.EventArray[id].minutes  = minutes
        this.EventArray[id].fire = this.EventArray[id].fireTime = this.EventArray[id].day * TICKS_PER_DAY + this.EventArray[id].hour  * TICKS_PER_HOUR + this.EventArray[id].minutes;
        
        this.addEvent(this.EventArray[id].fireTime,this.EventArray[id].type,  this.EventArray[id].subtype, this.EventArray[id].howmuch)
        console.log("event: " + "type: " + this.EventArray[id].type + " subtype: " +  this.EventArray[id].subtype + " firetime: " + this.EventArray[id].fireTime);
    }

    currentEnergyExpenditure(){
        return this.bodyWeight_ * this.currEnergyExpenditure;
    }

    stomachEmpty(){
        var oldState = this.bodyState;

        switch (this.bodyState){
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

    /*setParams(){
        // need to look into how to do iterator
        stomach.setParams();
        intestine.setParams();
        portalVein.setParams();
        liver.setParams();
        adiposeTissue.setParams();
        brain.setParams();
        heart.setParams();
        muscles.setParams();
        blood.setParams();
        kidneys.setParams();
    }
    */
    readParams(file){
        // may not need to be implemented depending on real-time database
    }
}

var humanBody = new HumanBody();

	
    humanBody.addExeciseType(1,"LightHouseWork", 2.5)
    humanBody.addExeciseType(2,"Walking", 3.5)
    humanBody.addExeciseType(3,"HeavyHousework", 4.5)
	humanBody.addExeciseType(4,"Dancing", 7)
	humanBody.addExeciseType(5,"Swimming", 11)
	humanBody.addExeciseType(6,"HillWalking", 9)
	humanBody.addExeciseType(7,"Jogging", 12)
	humanBody.addExeciseType(8,"Squash", 12)
	humanBody.addExeciseType(9,"Marathon", 18)


	humanBody.addFoodType(1,"glucose", 75, 75, 0, 0, 0)
    humanBody.addFoodType(2,"White_Bread", 100, 41.4, 4.1, 5, 3.3)
    humanBody.addFoodType(3,"Brown_Rice", 100, 16.3, 10.2, 2, 1)
	humanBody.addFoodType(4,"Kidney_Bean", 100, 5.6, 10.9, 9, 1)
	humanBody.addFoodType(5,"Rice_Krispies", 100, 80.3, 1.9, 6.8, 1)
	humanBody.addFoodType(6,"Frozen_Pea", 100, 5.8, 1.1, 5, 0)
	humanBody.addFoodType(7,"glucose+protein ", 50, 50, 0, 50, 0)
	humanBody.addFoodType(8,"EqualRAGSAG+FAT", 50, 25, 25, 0, 50)
	humanBody.addFoodType(9,"PastaLFAT", 100, 12, 13, 4.92,0.62)
	humanBody.addFoodType(10,"PastaMF ", 100, 12, 13, 4.92, 6.4)
    humanBody.addFoodType(11,"PastaHF", 100, 12, 13, 4.92, 16)
    humanBody.addFoodType(12,"Glucose00", 50, 50, 0, 0, 0)
	humanBody.addFoodType(13,"Glucose05", 50, 50, 0, 0, 5)
	humanBody.addFoodType(14,"Glucose010", 50, 50, 0, 0, 10)
	humanBody.addFoodType(15,"Glucose030", 50, 50, 0, 0, 30)
	humanBody.addFoodType(16,"Glucose50", 50, 50, 0, 5, 0)
	humanBody.addFoodType(17,"Glucose55", 50, 50, 0, 5, 5)
	humanBody.addFoodType(18,"Glucose510", 50, 50, 0, 5, 10)
	humanBody.addFoodType(19,"Glucose530", 50, 50, 0, 5, 30)
    humanBody.addFoodType(20,"Glucose100", 50, 50, 0, 10, 0)
    humanBody.addFoodType(21,"Glucose105", 50, 50, 0, 10, 5)
	humanBody.addFoodType(21,"Glucose1010", 50, 50, 0, 10, 10)
	humanBody.addFoodType(23,"Glucose1030", 50, 50, 0, 10, 30)
	humanBody.addFoodType(24,"Glucose300", 50, 50, 0, 30, 0)
	humanBody.addFoodType(25,"Glucose305", 50, 50, 0, 30, 5)
	humanBody.addFoodType(26,"Glucose3010", 50, 50, 0, 30, 10)
	humanBody.addFoodType(27,"Glucose3030", 50, 50, 0, 30, 30)
	humanBody.addFoodType(28,"Protein", 50, 0, 0, 50, 0)
    humanBody.addFoodType(29,"White_Rice", 100, 19.3, 6.2, 2.7, 0.3)
    humanBody.addFoodType(30,"Parboiled_Rice",  100, 18.5, 11.1, 2.9, 0.4)
	humanBody.addFoodType(31,"Pasta_Macaroni", 100, 15.1, 13.3, 5.8, 1)
	humanBody.addFoodType(32,"Pasta_Spaghetti", 100, 15.1, 10, 5.8, 1)
	humanBody.addFoodType(33,"Kidneybeans_Canned", 100, 9.1, 5.8, 5.3, 0.4)
	humanBody.addFoodType(34,"Pinto_Beans", 100, 10.7, 5.6, 9.0, 0.7)

    humanBody.addEventType(0, 2, 0, 0, 0, 5, 0)

    humanBody.run_simulation();



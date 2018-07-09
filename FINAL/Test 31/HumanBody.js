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

        var rands = new Rands();
        var seedrandom = Math.seedrandom
        var rng = new seedrandom('charlotte');
        var r = new Rands(rng);
        return r.poisson(value);
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
            // terminate program
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

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
    constructor(){
        this.type = "";
        this.subtype = "";
        this.howmuch = "";
        this.day = 0;
        this.hour = 0;
        this.minutes = 0;
        this.fireTime = 0;
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
        this.foodID = "";
        this.name = "";
        this.servingSize = "";
        this.RAG = "";
        this.SAG = "";
        this.protein = "";
        this.fat = "";
    }
};

class ExerciseType{
    constructor(){
        this.exerciseID = "";
        this.name = "";
        this.intensity = "";  
    }
};

class HumanBody{
    constructor(){
        // *****all commented out lines need to be uncommented when add each class for different organs*****
        this.glut4Impact_ = 1.0;
    	this.liverGlycogenBreakdownImpact_ = 1.0;
    	this.liverGlycogenSynthesisImpact_ = 1.0;
    	this.gngImpact_ = 1.0;
    	this.glycolysisMinImpact_ = 1.0;
    	this.glycolysisMaxImpact_ = 1.0;
		this.excretionKidneysImpact_ = 1.0;

        this.bodyWeight_ = 65; //kg
        this.fatFraction = 0.2;
        this.ticks = 0;
        this.insulinResistance_ = 0;
        this.insulinPeakLevel_ = 1.0;
        this.bodyState = BodyState.POSTABSORPTIVE_RESTING;

        //this.adiposeTissue = new AdiposeTissue(this);
        //this.muscles = new Muscles(this);

        this.currExercise = 0;
        this.currEnergyExpenditure = 1.0/60.0;
        this.exerciseOverAt = 0;

		this.insulinImpactOnGlycolysis_Mean = 0.8;
		this.insulinImpactOnGlycolysis_StdDev = 0.2;
		this.insulinImpactOnGNG_Mean = 0.9999;
		this.insulinImpactOnGNG_StdDev = 0.0001;
		this.insulinImpactGlycogenBreakdownInLiver_Mean = 0.1;
		this.insulinImpactGlycogenBreakdownInLiver_StdDev = 0.01;
		this.insulinImpactGlycogenSynthesisInLiver_Mean = 0.9;
		this.insulinImpactGlycogenSynthesisInLiver_StdDev = 0.1;

		this.totalGlycolysisSoFar = 0;
    	this.totalOxidationSoFar = 0;
    	this.totalGlycogenStorageSoFar = 0;
    	this.totalGlycogenBreakdownSoFar = 0;
    	this.totalGNGSoFar = 0;
    	this.totalEndogeneousGlucoseReleaseSoFar = 0;
		this.totalGlucoseReleaseSoFar = 0;



        this.blood = new Blood(this);
        this.eventQ = new PriorityQueue();


        this.stomach = new Stomach(this);
        this.intestine = new Intestine(this);
        this.portalVein = new PortalVein(this);
        this.liver = new Liver(this);
        this.brain = new Brain(this);
        this.heart = new Heart(this);

        this.kidneys = new Kidney(this);
        this.adiposeTissue = new AdiposeTissue(this);
        this.muscles = new Muscles(this);
       
      
       
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
        console.log(this.elapsed_days() + ":" + this.elapsed_hours() + ":" + this.elapsed_minutes());
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
        this.time_stamp();
        console.log(" bgl : " + this.blood.getBGL() + " weight :"  + this.bodyWeight_);
        
        this.time_stamp();
        console.log("TotalGlucolysis :" + (this.intestine.glycolysisPerTick + this.liver.glycolysisPerTick + this.kidneys.glycolysisPerTick + this.muscles.glycolysisPerTick+ this.blood.glycolysisPerTick));
        this.totalGlycolysisSoFar += x;
        this.time_stamp();
        console.log("HumanBody:: TotalGlycolysisSoFar " + this.totalGlycolysisSoFar)

        x = (this.kidneys.gngPerTick + this.liver.gngPerTick);
        this.totalGNGSoFar += x;

        this.time_stamp();
        console.log("HumanBody:: Total GNG :" + (this.kidneys.gngPerTick + this.liver.gngPerTick));
        this.time_stamp();
        console.log("HumanBody:: Total GNGSoFar :" + this.totalGNGSoFar);

        this.time_stamp();
        console.log("Total Oxidation :" + (this.brain.oxidationPerTick+this.heart.oxidationPerTick+this.muscles.oxidationPerTick));
        this.totalOxidationSoFar += (this.brain.oxidationPerTick+this.heart.oxidationPerTick+this.muscles.oxidationPerTick);

        this.time_stamp();
        console.log("HumanBody:: TotalOxidationSoFar " + this.totalOxidationSoFar);

        this.time_stamp();
        console.log("HumanBody:: UseOfGlucoseOutsideLiverKidneysMuscles :" + (this.blood.glycolysisPerTick + this.brain.oxidationPerTick + this.heart.oxidationPerTick + this.intestine.glycolysisPerTick));

        x = (this.liver.toGlycogenPerTick + this.muscles.glycogenSynthesizedPerTick);
        this.totalGlycogenStorageSoFar += x;

        this.time_stamp();
        console.log("HumanBody:: TotalGlycogenStoragePerTick " + x);

        this.time_stamp();
        console.log("HumanBody:: TotalGlycogenStorageSoFar  " + this.totalGlycogenStorageSoFar);

        x = (this.liver.fromGlycogenPerTick + this.kidneys.gngPerTick + this.liver.gngPerTick);
        this.totalEndogeneousGlucoseReleaseSoFar += x;

        this.time_stamp();
        console.log("HumanBody:: TotalEndogeneousGlucoseReleasePerTick " + x);

        this.time_stamp();
        console.log("HumanBody:: TotalEndogeneousGlucoseReleaseSoFar " + this.totalEndogeneousGlucoseReleaseSoFar);


        x = (this.intestine.toPortalVeinPerTick + this.liver.fromGlycogenPerTick + this.kidneys.gngPerTick + this.liver.gngPerTick);
        this.totalGlucoseReleaseSoFar += x;

        this.time_stamp();
        console.log("HumanBody:: TotalGlucoseReleasePerTick " + x);

        this.time_stamp();
        console.log("HumanBody:: TotalGlucoseReleaseSoFar  " + this.totalGlucoseReleaseSoFar);



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
    }
    
    run_simulation(){
        while(true){
            var val;
            //while( (val = this.fire_event()) == 1);
                this.processTick();
                this.ticks++;
            
                console.log(this.elapsed_days() + ":" + this.elapsed_hours() + ":" + this.elapsed_minutes);
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
        //currEnergyExpenditure = (exerciseTypes[exerciseID].intensity_)/60.0;

        if(this.bodyState == BodyState.FED_RESTING){
            this.bodyState = BodyState.FED_EXERCISING;
            // Look into accessing SimCtl
            //exerciseOverAt = SimCtl::ticks + duration;
            return;
        }

        if(this.bodyState == BodyState.POSTABSORPTIVE_RESTING){
            this.bodyState = BodyState.POSTABSORPTIVE_EXERCISING;
            // Look into accessing SimCtl
            // exerciseOverAt = SimCtl::ticks + duration;
            return;
        }
    }

    readExerciseFile(file){
        jQuery.get(file, function(data){
        console.log("READING EXERCISE FILE");
        console.log("-------------------------------");
        var lines = data.split('\n');
        var lineNum = 0;
        var exerciseArray = [];
        var exercise = new ExerciseType();
        //for loop to seperate each new line of text file
        for(var line = 0; line < lines.length; line++){
            var properties = lines[line].split(' ');
            exercise.exerciseID = properties[0];
            exercise.name = properties[1];
            exercise.intensity = properties[2];
    
            exerciseArray[lineNum] = exercise;
            
            console.log("exercise: " + exerciseArray[lineNum].name + " " + exerciseArray[lineNum].intensity);
            lineNum++;
            
            console.log("-------------------------------");
        }
    });
    }

    readFoodFile(file){
        jQuery.get(file, function(data){
        console.log("READING FOOD FILE");
        console.log("-------------------------------");
        var lines = data.split('\n');
        var lineNum = 0;
        var foodArray = [];
        var food = new FoodType();
        //for loop to seperate each new line of text file
        for(var line = 0; line < lines.length; line++){
            var properties = lines[line].split(' ');
            food.foodID = properties[0];
            food.name = properties[1];
            food.servingSize = properties[2];
            food.RAG = properties[3];
            food.SAG = properties[4];
            food.protein = properties[5];
            food.fat = properties[6];
    
            foodArray[lineNum] = food;
            
            console.log("food types: " + foodArray[lineNum].name + " " + foodArray[lineNum].protein);
            lineNum++;
            
            console.log("-------------------------------");
        }
    });
    }
    
    fire_event(){
        var event_ = this.eventQ.front();

        if(event_ === "No elements in Queue"){
            console.log("No event left");
            // terminate program
        }

        if(event_.firetime > this.ticks){
            return -1;
        }
        
        console.log("ticks = " + this.ticks + ": " + this.elapsed_days() + "::" + this.elapsed_hours() + "::" + this.elapsed_minutes());
        
        console.log("event fire time: " + event_.fireTime);

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
    
    readEvents(file){
        jQuery.get(file, function(data){
        console.log("READING EVENTS FILE");
        console.log("-------------------------------");
        var lines = data.split('\n');
        var lineNum = 0;
        var eventArray = [];
        var event = new Event();
        //for loop to seperate each new line of text file
        //type, subtype, howmuch, day, hour, minutes, fireTime
        for(var line = 0; line < lines.length; line++){
            var properties = lines[line].split(':');
            event.type = properties[0];
            event.subtype = properties[1];
            event.howmuch = properties[2];
            event.day = properties[3];
            event.hour = properties[4];
            event.minutes = properties[5];
            event.fire = event.fireTime = event.day * TICKS_PER_DAY + event.hour * TICKS_PER_HOUR + event.minutes;
    
            eventArray[lineNum] = event;
            
            console.log("event: " + "type: " + eventArray[lineNum].type + " subtype: " +  eventArray[lineNum].subtype + " firetime: " + eventArray[lineNum].fireTime);
            lineNum++;
            
            console.log("-------------------------------");
        }
    });
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

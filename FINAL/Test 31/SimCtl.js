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

class SimCtl {
    constructor(){
        this.ticks = 0;
        this.eventQ = new PriorityQueue();
        this.body = new HumanBody();
    }

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
    
    run_simulation(){
        while(true){
            var val;
            while( (val = this.fire_event()) == 1);
            body.processTick();
            this.ticks++;
        }
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
                body.processFoodEvent(event_.subID, event_.howmuch);
                break;
            case EventType.EXERCISE:
                body.processExerciseEvent(event_.subID, event_.howmuch)
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

   elapsed_days(){
        return(this.ticks/TICKS_PER_DAY);
    }

    elapsed_hours(){
        var x = this.ticks % TICKS_PER_DAY;
        return(x/TICKS_PER_HOUR);
    }

    elapsed_minutes(){
        var x = this.ticks % TICKS_PER_DAY;
        return(x % TICKS_PER_HOUR);
    }
}
// TODO need to figure out how to implement the main function in JavaScript
// also need to determine how we will pass in the arguments that are used when sim ran in colsole
function run_simulation(){
    while (true) {
        var val;
        while( (val = fire_event()) == 1);
        body.processTick();
        this.ticks++;
        console.log(this.elapsed_days() + ":" + this.elapsed_hours() + ":" + this.elapsed_minutes);
    }
    return 0;
}


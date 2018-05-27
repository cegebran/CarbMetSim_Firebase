$('document').ready(function(){
    // creating object for queue classs
    var priorityQueue = new PriorityQueue();
    var humanBody = new HumanBody();
    var blood = new Blood(humanBody);
    var adipose = new AdiposeTissue(humanBody);
    var brain  = new Brain(humanBody);
    //console.log(adipose.consumeFat(4));
    //console.log(adipose.processTick());
   // console.log(blood.processTick());
 

    // testing isEmpty and front on an empty queue
    // return true
    //console.log(priorityQueue.isEmpty());

    // returns "No elements in Queue"
    //console.log(priorityQueue.front());
    
    //creating elements
    // (firetime, id, howmuch)
    var element1 = new QElement(100, "heart", "sub1", 2);
    
    var element2 = new QElement(10, "kidney", "sub2", 4);//check
    
    var element3 = new QElement(8, "liver", "sub3", 3);//check
    
    var element4 = new QElement(20, "brain", "sub4", 1);//check
    
    var element5 = new QElement(25, "heart2", "sub5", 2);
    
    // adding elements to the queue
    priorityQueue.enqueue(element1);
    priorityQueue.enqueue(element2);
    priorityQueue.enqueue(element3);
    priorityQueue.enqueue(element4);

    //printing  brain, heart, heart2, liver, kidney
    //console.log(priorityQueue.printPQueue());

    //printing brian
    //console.log(priorityQueue.front());

    //printing kidney
    //console.log(priorityQueue.rear());

    //printing kidney
    //console.log(priorityQueue.dequeue());

    // Adding another element to the queue
    //priorityQueue.enqueue(element5);

    //console.log(priorityQueue.printPQueue());

    //console.log("events start here");
    //humanBody.readEvents("Events.txt");
    
    //humanBody.addEvent(2018, EventType.FOOD, '2', 1);
    //humanBody.addEvent(2017, EventType.FOOD, '3', 1);
    //humanBody.addEvent(2016, EventType.EXERCISE, '2', 1);
    //console.log(humanBody.eventQ.front());
    //console.log(humanBody.fire_event());
    var  i = 0;
    while(i < 100){
    console.log("///////////////////////////////////////////////////////////////////"+i++);
    console.log(humanBody.processTick());
    }
  //  humanBody.run_simulation();

    
    //console.log(humanBody.currentEnergyExpenditure);

    //console.log(humanBody.elapsed_days());
    //console.log(humanBody.elapsed_hours());
  //  console.log(humanBody.elapsed_minutes());
    
   // var body = new HumanBody();
//    body.readFoodFile("Food.txt");
  //  body.readExerciseFile("Exercise.txt");
//    body.readParams("MetaParams.txt");
    
    
});
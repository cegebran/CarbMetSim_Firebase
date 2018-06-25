$('document').ready(function(){
    // creating object for queue classs
    var priorityQueue = new PriorityQueue();
    
    //var blood = new Blood(humanBody);
    //var adipose = new AdiposeTissue(humanBody);
    //var brain  = new Brain(humanBody);
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
    /*var element1 = new QElement(100, "heart", "sub1", 2);
    
    var element2 = new QElement(10, "kidney", "sub2", 4);//check
    
    var element3 = new QElement(8, "liver", "sub3", 3);//check
    
    var element4 = new QElement(20, "brain", "sub4", 1);//check
    
    var element5 = new QElement(25, "heart2", "sub5", 2);
    
    // adding elements to the queue
    priorityQueue.enqueue(element1);
    priorityQueue.enqueue(element2);
    priorityQueue.enqueue(element3);
    priorityQueue.enqueue(element4);
*/
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


    humanBody.addEventType(1, 0, 5, 0, 2, 0, 0)

    humanBody.run_simulation();


	// humanBody.run_simulation();
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
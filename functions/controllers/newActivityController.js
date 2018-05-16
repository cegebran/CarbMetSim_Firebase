var firebase = require('firebase');
var async = require('async');

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

var amPmArray = [
    {
        _id: "AM",
        name: "AM"
    },
    {
        _id: "PM",
        name: "PM"
    }
];

var monthArray = [
    {
        _id: "Month",
        name: "Month"
    },
    {
        _id: "01",
        name: "January"
    },
    {
        _id: "02",
        name: "February"
    },
    {
        _id: "03",
        name: "March"
    },
    {
        _id: "04",
        name: "April"
    },
    {
        _id: "05",
        name: "May"
    },
    {
        _id: "06",
        name: "June"
    },
    {
        _id: "07",
        name: "July"
    },
    {
        _id: "08",
        name: "August"
    },
    {
        _id: "09",
        name: "September"
    },
    {
        _id: "10",
        name: "October"
    },
    {
        _id: "11",
        name: "November"
    },
    {
        _id: "12",
        name: "December"
    }
];

function writeNewActivity(totalActivitiesInDb_1, activity, subtype, quantity, month, day, year, hour, minute, amPm){
    var userId = firebase.auth().currentUser.uid;
    var timestampRecorded = Date.now();
    var activityEntry = {
        _id: totalActivitiesInDb_1,
        activity_type: activity,
        subtype: subtype,
        quantity: quantity,
        month: month,
        day: day,
        year: year,
        hour: hour,
        minute: minute,
        amPm: amPm
    };

    var newActivityKey = firebase.database().ref().child('activities').push().key;

    var activities = {};
    activities['/users/' + userId + '/activities/' + newActivityKey] = activityEntry;

    return firebase.database().ref().update(activities);
}

function writeNewFoodType(totalFoodTypesinDb_1, foodCreationName, foodServingSize, foodFat, foodProtein, foodRAG, foodSAG){
    var userId = firebase.auth().currentUser.uid;
    var timestampRecorded = Date.now();
    var foodEntry = {
        _id: totalFoodTypesinDb_1,
        food_name: foodCreationName,
        servingSize: foodServingSize,
        fat: foodFat,
        protein: foodProtein,
        RAG: foodRAG,
        SAG: foodSAG
    };

    var newFoodKey = firebase.database().ref().child('foodSubtypes').push().key;

    var foods = {};
    foods['/users/' + userId + '/foodSubtypes/' + newFoodKey] = foodEntry;

    return firebase.database().ref().update(foods);
}

function writeNewExerciseType(totalExerciseTypesinDb_1, exerciseCreationName, exerciseIntensity){
    var userId = firebase.auth().currentUser.uid;
    var timestampRecorded = Date.now();
    var exerciseEntry = {
        _id: totalExerciseTypesinDb_1,
        exercise_activity: exerciseCreationName,
        intensity: exerciseIntensity
    };

    var newExerciseKey = firebase.database().ref().child('exerciseSubtypes').push().key;

    var exercises = {};
    exercises['/users/' + userId + '/exerciseSubtypes/' + newExerciseKey] = exerciseEntry;

    return firebase.database().ref().update(exercises);
}

exports.new_activity_get = function(req, res) {
    var dayArray31 = [];
    var dayArray30 = [];
    var dayArray28 = [];
    var dayString = "Day";
    var dayID = "Day";
    var dayObj = {name: dayString, _id: dayID};
    dayArray31.push(dayObj);
    dayArray30.push(dayObj);
    dayArray28.push(dayObj);
    for(var i = 1; i < 32; i++){
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
        if(i < 32){
            dayArray31.push(newObj);
        }
        if(i < 31){
            dayArray30.push(newObj);
        }
        if(i < 29){
            dayArray28.push(newObj);
        }
    }

    var yearArray = [];
    var yearString = "Year";
    var yearID = "Year";
    var yearObj = {name: yearString, _id: yearID};
    yearArray.push(yearObj);
    for(var i = 2018; i > 2009; i--){
        var kaString = i;
        var kaID = i;
        var newObj = {name: kaString, _id: kaID};
        yearArray.push(newObj);
    }

    var hourArray = [];
    var hourString = "Hour";
    var hourID = "Hour";
    var hourObj = {name: hourString, _id: hourID};
    hourArray.push(hourObj);
    for(var i = 1; i < 13; i++){
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
        
                res.render('newActivity', {activityTypes: activityTypesArray, foodTypes: foodActivitiesArray, exerciseTypes: exerciseActivitiesArray, hours: hourArray, minutes: minutesArray, amPms: amPmArray, months: monthArray, days31: dayArray31, days30: dayArray30, days28: dayArray28, years: yearArray});
            });
        });
    } else {
        res.render('loginfirstmsg', {result: "One needs to Sign In first before logging a new Activity."});
    } 
};

exports.new_activity_post = function(req, res) {
    var dayArray31 = [];
    var dayArray30 = [];
    var dayArray28 = [];
    var dayString = "Day";
    var dayID = "Day";
    var dayObj = {name: dayString, _id: dayID};
    dayArray31.push(dayObj);
    dayArray30.push(dayObj);
    dayArray28.push(dayObj);
    for(var i = 1; i < 32; i++){
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
        if(i < 32){
            dayArray31.push(newObj);
        }
        if(i < 31){
            dayArray30.push(newObj);
        }
        if(i < 29){
            dayArray28.push(newObj);
        }
    }

    var yearArray = [];
    var yearString = "Year";
    var yearID = "Year";
    var yearObj = {name: yearString, _id: yearID};
    yearArray.push(yearObj);
    for(var i = 2018; i > 2009; i--){
        var kaString = i;
        var kaID = i;
        var newObj = {name: kaString, _id: kaID};
        yearArray.push(newObj);
    }

    var hourArray = [];
    var hourString = "Hour";
    var hourID = "Hour";
    var hourObj = {name: hourString, _id: hourID};
    hourArray.push(hourObj);
    for(var i = 1; i < 13; i++){
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

                var activity = req.body.activity_type;
                var month = req.body.month;
                var day = req.body.day;
                var year = req.body.year;
                var hour = req.body.hour;
                var minute = req.body.minute;
                var amPm = req.body.amPm;

                var foodType;
                var exerciseType;

                if(activity == "Food"){
                    foodType = req.body.food_type;
                    if(foodType == "+ New Food"){
                        foodType = req.body.newFoodName;
                        var foodServingSize = req.body.newFoodServingSize;
                        var foodFat = req.body.newFoodFat;
                        var foodProtein = req.body.newFoodProtein;
                        var foodRAG = req.body.newFoodRAG;
                        var foodSAG = req.body.newFoodSAG;
                        writeNewFoodType(totalFoodTypesinDb_1, foodType, foodServingSize, foodFat, foodProtein, foodRAG, foodSAG);
                        foodType = "+ New Food";
                    }
                    var foodQty = req.body.foodQtyInput;

                    if(foodType == "+ New Food"){
                        writeNewActivity(totalActivitiesInDb_1, activity, totalFoodTypesinDb_1, foodQty, month, day, year, hour, minute, amPm);
                    }else{
                        writeNewActivity(totalActivitiesInDb_1, activity, foodType, foodQty, month, day, year, hour, minute, amPm);
                    }
                }else if(activity = "Exercise"){
                    exerciseType = req.body.exercise_type;
                    if(exerciseType == "+ New Exercise"){
                        exerciseType = req.body.newExerciseName;
                        var exerciseIntensity = req.body.newExerciseIntensity;
                        writeNewExerciseType(totalExerciseTypesinDb_1, exerciseType, exerciseIntensity);
                        exerciseType = "+ New Exercise";
                    }
                    var exerciseQty = req.body.exerciseQtyInput;

                    if(exerciseType == "+ New Exercise"){
                        writeNewActivity(totalActivitiesInDb_1, activity, totalExerciseTypesinDb_1, exerciseQty, month, day, year, hour, minute, amPm);
                    }else{
                        writeNewActivity(totalActivitiesInDb_1, activity, exerciseType, exerciseQty, month, day, year, hour, minute, amPm);
                    }
                }
    
                res.render('newActivity', {activityTypes: activityTypesArray, foodTypes: foodActivitiesArray, exerciseTypes: exerciseActivitiesArray, hours: hourArray, minutes: minutesArray, amPms: amPmArray, months: monthArray, days31: dayArray31, days30: dayArray30, days28: dayArray28, years: yearArray});
            });
        });
    });
};
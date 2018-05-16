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

exports.editSubtype_get = function(req, res) {
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
        var valuesString = sfrag + "," + sfsag + "," + sfID + "," + sffat + "," + sfname + "," + sfprotein + "," + sfservingSize;
        var newObjSF = {name: sfname, values: valuesString};
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
                var valuesString = rag + "," + sag + "," + _id + "," + fat + "," + food_name + "," + protein + "," + servingSize;
                var newObj = {name: food_name, values: valuesString};
                foodKeyDataArray.push(newObj);
            }
    
            foodActivitiesArray = foodKeyDataArray;

            var exerciseKeyArray = [];
            var exerciseKeyDataArray = [];
            var exerciseActivitiesArray = [];

            var seName = "Select Exercise";
            var seID = "Select Exercise";
            var seIntensity = "";
            var valuesString = seID + "," + seName + "," + seIntensity;
            var newObjSE = {name: seName, values: valuesString};
            exerciseKeyDataArray.push(newObjSE);
        
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
                    var valuesString = kaID + "," + kaString + "," + kaIntensity;
                    var newObj = {name: kaString, values: valuesString};
                    exerciseKeyDataArray.push(newObj);
                }
        
                exerciseActivitiesArray = exerciseKeyDataArray;

                res.render('editActivitySubtype', {mainTypes: activityTypesArray, foodActivities: foodActivitiesArray, exerciseActivities: exerciseActivitiesArray});
            });
        });
    } else {
        res.render('loginfirstmsg', {result: "One needs to Sign In first before logging a new Activity."});
    } 
};

exports.editSubtype_post = function(req, res) {
    var foodKeyArray = [];
    var foodKeyDataArray = [];
    var foodActivitiesArray = [];
    var foodDbKeyArray = [];

    var sfname = "Select Food";
    var sfID = "Select Food";
    var sfrag = "";
    var sfsag = "";
    var sffat = "";
    var sfprotein = "";
    var sfservingSize = "";
    var valuesString = sfrag + "," + sfsag + "," + sfID + "," + sffat + "," + sfname + "," + sfprotein + "," + sfservingSize;
    var newObjSF = {name: sfname, values: valuesString};
    foodKeyDataArray.push(newObjSF);

    var userId = firebase.auth().currentUser.uid;
    var query = firebase.database().ref('/users/' + userId + '/foodSubtypes').orderByKey();
    query.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var item = childSnapshot.val();
            item.key = childSnapshot.key;
            foodDbKeyArray.push(item.key);
    
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
            var valuesString = rag + "," + sag + "," + _id + "," + fat + "," + food_name + "," + protein + "," + servingSize;
            var newObj = {name: food_name, values: valuesString};
            foodKeyDataArray.push(newObj);
        }
    
        foodActivitiesArray = foodKeyDataArray;

        var exerciseKeyArray = [];
        var exerciseKeyDataArray = [];
        var exerciseActivitiesArray = [];
        var exerciseDbKeyArray = [];

        var seName = "Select Exercise";
        var seID = "Select Exercise";
        var seIntensity = "";
        var valuesString = seID + "," + seName + "," + seIntensity;
        var newObjSE = {name: seName, values: valuesString};
        exerciseKeyDataArray.push(newObjSE);
        
        var userId = firebase.auth().currentUser.uid;
        var query = firebase.database().ref('/users/' + userId + '/exerciseSubtypes').orderByKey();
        query.once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var item = childSnapshot.val();
                item.key = childSnapshot.key;
                exerciseDbKeyArray.push(item.key);
        
                exerciseKeyArray.push(item);                                              
            });
            for(i = 0; i < exerciseKeyArray.length; i++){
                var kaString = exerciseKeyArray[i].exercise_activity;
                var kaID = exerciseKeyArray[i]._id;
                var kaIntensity = exerciseKeyArray[i].intensity;
                var valuesString = kaID + "," + kaString + "," + kaIntensity;
                var newObj = {name: kaString, values: valuesString};
                exerciseKeyDataArray.push(newObj);
            }
        
            exerciseActivitiesArray = exerciseKeyDataArray;

            var mainActivityType = req.body.activityMainTypeSelect;
            var foodActivityType = req.body.foodActivitySelect;
            var exerciseActivityType = req.body.exerciseActivitySelect;
            var foodName = req.body.newFoodName0;
            var foodServingSize = req.body.newFoodServingSize0;
            var foodFat = req.body.newFoodFat0;
            var foodProtein = req.body.newFoodProtein0;
            var foodRag = req.body.newFoodRAG0;
            var foodSag = req.body.newFoodSAG0;
            var exerciseName = req.body.newExerciseName0;
            var exerciseIntensity = req.body.newExerciseIntensity0;
            var activityTypeId = req.body.activityTypeId;

            if(mainActivityType == "Food"){
                for(var i = 0; i < foodActivitiesArray.length; i++){
                    var foodValueString = foodActivitiesArray[i].values
                    var valuesArray = foodValueString.split(",");
                    var foodId = valuesArray[2];
                    if(foodId == activityTypeId){
                        var foodKey = foodDbKeyArray[i - 1];
                        var foodEntry = {
                            _id: activityTypeId,
                            food_name: foodName,
                            servingSize: foodServingSize,
                            fat: foodFat,
                            protein: foodProtein,
                            RAG: foodRag,
                            SAG: foodSag
                        };
                    
                        var foods = {};
                        foods['/users/' + userId + '/foodSubtypes/' + foodKey] = foodEntry;
                    
                        firebase.database().ref().update(foods);

                        var valueStringNew = foodRag + "," + foodSag + "," + activityTypeId + "," + foodFat + "," + foodName + "," + foodProtein + "," + foodServingSize;
                        foodActivitiesArray[i].values = valueStringNew;
                        foodActivitiesArray[i].name = foodName;
                    }
                }
            }else{  // exercise
                for(var i = 0; i < exerciseActivitiesArray.length; i++){
                    var exerciseValueString = exerciseActivitiesArray[i].values;
                    var valuesArray = exerciseValueString.split(",");
                    var exerciseId = valuesArray[0];
                    if(exerciseId == activityTypeId){
                        var exerciseKey = exerciseDbKeyArray[i - 1];
                        var exerciseEntry = {
                            _id: activityTypeId,
                            exercise_activity: exerciseName,
                            intensity: exerciseIntensity
                        };

                        var exercises = {};
                        exercises['/users/' + userId + '/exerciseSubtypes/' + exerciseKey] = exerciseEntry;

                        firebase.database().ref().update(exercises);

                        var valueStringNew = activityTypeId + "," + exerciseName + "," + exerciseIntensity;
                        exerciseActivitiesArray[i].values = valueStringNew;
                        exerciseActivitiesArray[i].name = exerciseName;
                    }
                }
            }

            res.render('editActivitySubtype', {mainTypes: activityTypesArray, foodActivities: foodActivitiesArray, exerciseActivities: exerciseActivitiesArray});
        });
    });
};
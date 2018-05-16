var firebase = require('firebase');

exports.display_last_ten = function(req, res) {

    var activityArray = [];

    if( firebase.auth().currentUser ) {

        var activityKeyArray = [];
        var activityTypeArray = [];

        var userId = firebase.auth().currentUser.uid;
        var query = firebase.database().ref('/users/' + userId + '/activitytypes').orderByKey();
        query.once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                var item = childSnapshot.val();
                item.key = childSnapshot.key;
                activityKeyArray.push(item);                                              
            });
            for(i = 0; i < activityKeyArray.length; i++){
                var activityTypeObject = {activityType: activityKeyArray[i].activity, activityTypeDescription: activityKeyArray[i].description};
                activityTypeArray.push(activityTypeObject);
            }

            var keyArray = [];
            var activitiesArray = [];

            var userId = firebase.auth().currentUser.uid;
            var query = firebase.database().ref('/users/' + userId + '/activities').orderByChild('timestamp');
            query.once('value').then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    var item = childSnapshot.val();
                    keyArray.push(item);                                              
                });
                var startLoopCt = keyArray.length - 1;
                var totalInActivityArray = 0;
                for(i = startLoopCt; i >= 0; i--){
                    if(totalInActivityArray < 10){

                        var activityMainType = "";
                        for(z = 0; z < activityTypeArray.length; z++){
                            if(keyArray[i].activity == activityTypeArray[z].activityTypeDescription){
                                activityMainType = activityTypeArray[z].activityType;
                            }
                        }
                        var activityValueConcatLabel = "";
                        if(activityMainType == "Exercise"){
                            activityValueConcatLabel = keyArray[i].value + " minutes";
                        }else if(activityMainType == "Food"){
                            activityValueConcatLabel = keyArray[i].value + " grams";
                        }else if(activityMainType == "BGL"){
                            activityValueConcatLabel = keyArray[i].value + " bgl";
                        }else if(activityMainType = "Medication"){
                            activityValueConcatLabel = keyArray[i].value + " grams";
                        }else{
                            activityValueConcatLabel = keyArray[i].value;
                        }

                        var displayedTableDate = "";
                        var dateSplit = keyArray[i].date.split("-");
                        var displayedTableDate = dateSplit[1] + "-" + dateSplit[2] + "-" + dateSplit[0];

                        var activityObject = {maintype: activityMainType, type: keyArray[i].activity, value: activityValueConcatLabel, date: displayedTableDate, timeofday: keyArray[i].recordedTime};
                        activityArray.push(activityObject);
                        totalInActivityArray++;
                    }
                }
                res.render('home', {activity_list: activityArray});
            });
        });
    }else{
        res.render('loginfirstmsg', {result: "One needs to Sign In first before viewing their home page with the last 10 activity entries."});
    }
};
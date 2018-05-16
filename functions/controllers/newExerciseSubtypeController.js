var firebase = require('firebase');

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

// Display list of all Authors.
exports.new_datatype_get = function(req, res) {
    // res.send('NOT IMPLEMENTED: Author list'); I commented out this line
    if( firebase.auth().currentUser ) {
        res.render('newExerciseSubtype');
    } else {
        res.render('loginfirstmsg', {result: "One needs to Sign In first before creating a new Activity Type."});
    }   
};

exports.new_datatype_post = function(req, res) {

    var keyArray = [];

    var userId = firebase.auth().currentUser.uid;
    var query = firebase.database().ref('/users/' + userId + '/exerciseSubtypes').orderByKey();
    query.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var item = childSnapshot.val();
            item.key = childSnapshot.key;

            keyArray.push(item);                                              
        });
        
        var totalExerciseSubtypesPlus = keyArray.length + 1;

        var exercise_activity = req.body.exercise_activity;
        var intensity = req.body.intensity;

        console.log(exercise_activity);

        writeExerciseSubtypeData(totalExerciseSubtypesPlus, exercise_activity, intensity);

        res.render('newExerciseSubtype');

    });
};
var firebase = require('firebase');

function writeFoodSubtypeData(totalFoodSubtypesPlus, food_name, servingSize, RAG, SAG, protein, fat){
    var userId = firebase.auth().currentUser.uid;

    var foodSubtypeEntry = {
        _id: totalFoodSubtypesPlus,
        food_name: food_name,
        servingSize: servingSize,
        RAG: RAG,
        SAG: SAG,
        protein: protein,
        fat: fat
    };

    var newFoodSubtypeKey = firebase.database().ref().child('foodSubtypes').push().key;

    var foodSubtype = {};
    foodSubtype['/users/' + userId + '/foodSubtypes/' + newFoodSubtypeKey] = foodSubtypeEntry;

    return firebase.database().ref().update(foodSubtype);
}

// Display list of all Authors.
exports.new_datatype_get = function(req, res) {
    // res.send('NOT IMPLEMENTED: Author list'); I commented out this line
    if( firebase.auth().currentUser ) {
        res.render('newFoodSubtype');
    } else {
        res.render('loginfirstmsg', {result: "One needs to Sign In first before creating a new Activity Type."});
    }   
};

exports.new_datatype_post = function(req, res) {

    var keyArray = [];

    var userId = firebase.auth().currentUser.uid;
    var query = firebase.database().ref('/users/' + userId + '/foodSubtypes').orderByKey();
    query.once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var item = childSnapshot.val();
            item.key = childSnapshot.key;

            keyArray.push(item);                                              
        });
        
        var totalFoodSubtypesPlus = keyArray.length + 1;

        var food_name = req.body.food_name;
        var servingSize = req.body.servingSize;
        var RAG = req.body.RAG;
        var SAG = req.body.SAG;
        var protein = req.body.protein;
        var fat = req.body.fat;

        writeFoodSubtypeData(totalFoodSubtypesPlus, food_name, servingSize, RAG, SAG, protein, fat);

        res.render('newFoodSubtype');

    });
};
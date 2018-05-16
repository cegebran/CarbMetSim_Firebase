var firebase = require('firebase');
var async = require('async');

exports.querySimulation_get = function(req, res) {
    if( firebase.auth().currentUser ) {
        var simulationsArray = [];
        var simulationString = "Select a Simulation";
        var simulationObj = {name: simulationString, _id: simulationString};
        simulationsArray.push(simulationObj);

        // retrieve simulations from db
        res.render('simulationResultsQuery', {simulations: simulationsArray});
    } else {
        res.render('loginfirstmsg', {result: "One needs to Sign In first before logging a new Activity."});
    } 
};

exports.querySimulation_post = function(req, res) {

};


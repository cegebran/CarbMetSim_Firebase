var firebase = require('firebase');
var express = require('express');
var app = express();

exports.signup_get = function(req, res) {
    if( firebase.auth().currentUser ) {
	res.render('signup_result', {result: "Already signed in! Please logout first."});
    } else {
    	res.render('signup_form', {});
    }
};

exports.signup_post = function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
	//var errorCode = error.code;
        //var errorMessage = error.message;
    	res.render('signup_result', {result: error.message});
    });

    firebase.auth().onAuthStateChanged(function(user) {
  	if (user) {
    		// User is signed in.
    		res.render('signup_result', {result: "Successfully signed up!"});
  	} else {
    		// No user is signed in.
  	}
    });
};



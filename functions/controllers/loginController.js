var firebase = require('firebase');

// login
exports.login_get = function(req, res) {
	if( firebase.auth().currentUser ) {
		res.render('logout_form', { message: "Already Logged in!" });
	} else {
		res.render('login_form', { title: 'Login' });
	}
};

exports.logout_post = function(req, res) {
	if( firebase.auth().currentUser ) {
		firebase.auth().signOut();
		res.render('login_form', { title: 'Login' });
	} else {
		res.render('login_form', { title: 'Login' });
	}
};

exports.login_post = function(req, res) {
	var email = req.body.email;
	var password = req.body.password;
	
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
          // Handle Errors here.
          //var errorCode = error.code;
    	  res.render('login_result', {result: error.message});
        });
	
        firebase.auth().onAuthStateChanged(function(user) {
  		if (user) {
    		// User is signed in.
    			res.render('login_result', {result: "Successfully signed in!"});
  		} else {
    		// No user is signed in.
  		}
    	});
};


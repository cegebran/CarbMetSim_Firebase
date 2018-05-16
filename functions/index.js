const functions = require('firebase-functions');

var firebase = require('firebase');

var express = require('express');
var app = express();

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBc3zZi32Qr7tpHyi12VrDOVT7_TPErrWI",
    authDomain: "carbmetsim-17460.firebaseapp.com",
    databaseURL: "https://carbmetsim-17460.firebaseio.com",
    projectId: "carbmetsim-17460",
    storageBucket: "carbmetsim-17460.appspot.com",
    messagingSenderId: "428192973487"
  };
  firebase.initializeApp(config);

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
  } else {
    // No user is signed in.
  }
});


var path = require('path');

var index = require('./routes/index');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//module.exports = app;
exports.app = functions.https.onRequest(app);

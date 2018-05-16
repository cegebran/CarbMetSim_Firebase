var express = require('express');
var router = express.Router();

var home_controller = require('../controllers/homeController');
var login_controller = require('../controllers/loginController');
var signup_controller = require('../controllers/signupController');
var query_controller = require('../controllers/queryController');
var newFoodSubtype_controller = require('../controllers/newFoodSubtypeController');
var newExerciseSubtype_controller = require('../controllers/newExerciseSubtypeController');
var newActivity_controller = require('../controllers/newActivityController');
var newSimulation_controller = require('../controllers/newSimulationController');
var simuationResultsQuery_controller = require('../controllers/simulationResultsQueryController');
var editActivitySubtype_controller = require('../controllers/editActivitySubtypeController');


/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.redirect('/login');
});

router.get('/login',login_controller.login_get);
router.post('/login',login_controller.login_post);
router.post('/logout',login_controller.logout_post);
router.get('/signup',signup_controller.signup_get);
router.post('/signup',signup_controller.signup_post);
router.get('/home',home_controller.display_last_ten);
router.get('/query',query_controller.query_get);
router.post('/query',query_controller.query_post);
router.get('/newFoodSubtype',newFoodSubtype_controller.new_datatype_get);
router.post('/newFoodSubtype',newFoodSubtype_controller.new_datatype_post);
router.get('/newExerciseSubtype',newExerciseSubtype_controller.new_datatype_get);
router.post('/newExerciseSubtype',newExerciseSubtype_controller.new_datatype_post);
router.get('/newActivity',newActivity_controller.new_activity_get);
router.post('/newActivity',newActivity_controller.new_activity_post);
router.get('/newSimulation',newSimulation_controller.new_simulation_get);
router.post('/newSimulation',newSimulation_controller.new_simulation_post);
router.get('/simulationResultsQuery',simuationResultsQuery_controller.querySimulation_get);
router.post('/simulationResultsQuery',simuationResultsQuery_controller.querySimulation_post);
router.get('/editActivitySubtype',editActivitySubtype_controller.editSubtype_get);
router.post('/editActivitySubtype',editActivitySubtype_controller.editSubtype_post);

module.exports = router;
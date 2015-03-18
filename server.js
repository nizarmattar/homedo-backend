// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');
var User = require('./models/user.js');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mydb');
// connect to our database

var currTime = new Date();
var testUser = new User({
	username: 'nizar.mattar23@gmail.com' + currTime.getTime(),
	password: '_P6625bzw12__'
});
testUser.save(function(err) {
	if (err) throw err;

	// fetch user and test password verification
	User.findOne({
		username: 'nizar.mattar23@gmail.com'
	}, function(err, user) {
		if (err) throw err;

		// test a matching password
		user.comparePassword('_P6625bzw12__', function(err, isMatch) {
			if (err) throw err;
			console.log('_P6625bzw12__:', isMatch); // -> Password123: true
		});

		// test a failing password
		user.comparePassword('_P6625bzw12__', function(err, isMatch) {
			if (err) throw err;
			console.log('_P6625bzw12__:', isMatch); // -> 123Password: false
		});
	});
});



var Schema = mongoose.Schema;

var Contact = new Schema({
	name: {
		type: String,
		required: true
	}
});

var Product = new Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	style: {
		type: String,
		unique: true
	},
	modified: {
		type: Date,
		default: Date.now
	}
});
var ProductModel = mongoose.model('Product', Product);
var ContactModel = mongoose.model('Contact', Contact);

var current_date = new Date();
var c1 = new ContactModel({
	name: "nizar" + current_date.getTime()
});
c1.save(function(err) {

});

/*

for (var i = 0; i < 10; i++) {
	var nizar = new ProductModel({
		title: "title" + i,
		description: "desc" + i,
		style: "styllllee" + i
	});
	nizar.save(function(err) {
		if (err) console.log('error');
	});
}*/

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/contacts/', function(req, res) {
	return ContactModel.find(function(err, contacts) {
		if (!err) {
			res.json(contacts);
		}
	});
});
router.get('/users/', function(req, res) {
	return User.find(function(err, users) {
		if (!err) {
			res.json(users);
		} else {
			res.json({
				message: 'error'
			});
		}
	});
});
router.get('/', function(req, res) {
	/*
		res.json({
			message: "asdasd"
		});
	*/
	return ProductModel.find(function(err, products) {
		if (!err) {
			res.json(products);
		} else {
			res.json({
				message: 'error'
			});
		}
	});
	/*
		res.json({
			message: 'hooray! welcome to our api!'
		});*/
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
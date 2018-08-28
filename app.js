var express = require('express');
var fileUpload = require('express-fileupload');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exppug = require('pug');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var expressSession = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var User = require('./models/user');
mongoose.connect('mongodb://localhost/loginpage');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');

// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//express session
app.use(
	expressSession({
		secret: 'secret',
		saveUninitialized: false,
		resave: true
	})
);
app.use(function(req, res, next) {
	if (!req.session) {
		res.redirect('/login');
	}
	next();
});
// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(
	expressValidator({
		errorFormatter: function(param, msg, value) {
			var namespace = param.split('.'),
				root = namespace.shift(),
				formParam = root;

			while (namespace.length) {
				formParam += '[' + namespace.shift() + ']';
			}
			return {
				param: formParam,
				msg: msg,
				value: value
			};
		}
	})
);

// Connect Flash
app.use(flash());

// Global Vars
app.use(function(req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

app.post('/register', function(req, res) {
	console.log(req.body);
	var name = req.body.name;
	var email = req.body.email;
	var contactnumber = req.body.contactnumber;
	var username = req.body.username;
	var password = req.body.password;
	var Highestqualification = req.body.Highestqualification;
	var percentage = req.body.percentage;
	var gender = req.body.gender;
	var martialstatus = req.body.martialstatus;
	var country = req.body.country;
	var state = req.body.state;
	var city = req.body.city;
	var currentaddress = req.body.currentaddress;
	var parmanentaddress = req.body.parmanentaddress;
	var pincode = req.body.pincode;
	var uploadfile = req.body.uploadfile;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();

	var newUser = {
		name: name,
		email: email,
		username: username,
		password: password,
		contactnumber: contactnumber,
		Highestqualification: Highestqualification,
		percentage: percentage,
		gender: gender,
		martialstatus: martialstatus,
		country: country,
		state: state,
		city: city,
		currentaddress: currentaddress,
		parmanentaddress: parmanentaddress,
		pincode: pincode,
		uploadfile: uploadfile
	};
	User.create(newUser, function(err, user) {
		if (err) throw err;
		console.log(user);
	});
	req.flash('success_msg', 'You are registered and can now login');
	res.redirect('/users/login');
});

app.use('/', routes);
app.use('/users', users);

// Set Port
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
	console.log('Server started on port ' + app.get('port'));
});

var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var User = require('../models/user');
var bcrypt = require('bcrypt');

// Register
// router.get('/register', function (req, res) {
// 	res.render('register');
// });

// Login
router.get('/login', function(req, res) {
	res.render('login');
});

// Register view
router.get('/register', function(req, res) {
	res.render('register');
});

// Register User
router.post('/register', function(req, res) {
	// user.find({email:req.body.email})`
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

	// default options
	app.use(fileUpload());

	app.post('/upload', function(req, res) {
		console.log(req.files.my_profile_pic.name);
		console.log(req.files.my_signature - my_thumb_photo.name);
		console.log(req.files.my_thumb_photo.name);

		if (!req.files) return res.status(400).send('No files were uploaded.');

		// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
		let sampleFile = req.files.sampleFile;

		// Use the mv() method to place the file somewhere on your server
		sampleFile.mv('/somewhere/on/your/server/filename.jpg', function(err) {
			if (err) return res.status(500).send(err);

			res.send('File uploaded!');
		});
	});

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();

	var err = req.validationErrors();
	if (err) {
		res.render('register', {
			err: err
		});
	} else {
		//checking for email and username are already taken
		User.findOne(
			{
				username: {
					$regex: '^' + username + '\\b',
					$options: 'i'
				}
			},
			function(err, user) {
				User.findOne(
					{
						email: {
							$regex: '^' + email + '\\b',
							$options: 'i'
						}
					},
					function(err, mail) {
						if (user || mail) {
							res.render('register', {
								user: user,
								mail: mail
							});
						} else {
							var newUser = new User({
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
								pincode: pincode
							});
							User.createUser(newUser, function(err, user) {
								if (err) throw err;
								console.log(user);
							});
							req.flash('success_msg', 'You are registered and can now login');
							res.redirect('/users/login');
						}
					}
				);
			}
		);
	}
});

passport.use(
	new LocalStrategy(function(username, password, done) {
		User.getUserByUsername(username, function(err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function(err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	})
);

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/users/login',
		failureFlash: true
	}),
	function(req, res) {
		res.redirect('/');
	}
);

router.get('/logout', function(req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;

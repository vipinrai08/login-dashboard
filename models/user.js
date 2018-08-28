 var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},

	name: {
		type: String
	},
	contactnumber: {
		type: String
	},

	Highestqualification: {
		type: String
	},

	percentage: {
		type: String
	},

	gender: {
		type: String
	},

	martialstatus: {
		type: String
	},

	country: {
		type: String
	},

	state: {
		type: String
	},

	city: {
		type: String
	},

	currentaddress: {
		type: String
	},

	parmanentaddress: {
		type: String
	},

	pincode: {
		type: String
	},
	fileupload: {
		type: String
	}
});

var User = (module.exports = mongoose.model('User', UserSchema));

module.exports.createUser = function(newUser, callback) {
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(newUser.password, salt, function(err, hash) {
			newUser.password = hash;
			newUser.save(callback);
		});
	});
};

module.exports.getUserByUsername = function(username, callback) {
	var query = { username: username };
	User.findOne(query, callback);
};

module.exports.getUserById = function(id, callback) {
	User.findById(id, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
		if (err) throw err;
		callback(null, isMatch);
	});
};

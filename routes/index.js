var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res) {
	res.render('index', {
		title: 'form validator',
		success: false,
		errors: req.session.errors
	});
	req.session.errors = null;
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/register');
	}
}

module.exports = router;

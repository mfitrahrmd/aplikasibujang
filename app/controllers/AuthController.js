const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../models/User');
const Session = require('../models/Session');

const message = (req) => {
	let message = req.flash('error');
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}

	return message;
}

const oldInput = (req) => {
	let oldInput = req.flash('oldInput');
	if (oldInput.length > 0) {
		oldInput = oldInput[0];
	} else {
		oldInput = null;
	}
	
	return oldInput;
}

exports.signInPage = (req, res, next) => {
	if(res.locals.isAuthenticated){
		res.redirect('/');
	} else {
		res.render('sign_in',{layout: 'sign_in_layout', loginPage: true, pageTitle: 'Login', errorMessage: message(req), oldInput: oldInput(req)});
	}
};

exports.signIn = (req, res, next) => {
	const validationErrors = [];
	if (!validator.isEmail(req.body.email)) validationErrors.push('Please enter a valid email address.');
	if (validator.isEmpty(req.body.password)) validationErrors.push('Password cannot be blank.');
	if (validationErrors.length) {
		req.flash('error', validationErrors);
		return res.redirect('/sign-in');
	}
	User.findOne({
		where: {
			email: req.body.email
		}
	}).then(user => {
		if(user) {
			bcrypt
				.compare(req.body.password, user.password)
				.then(doMatch => {
					if (doMatch) {
						req.session.isLoggedIn = true;
			            req.session.user = user.dataValues;
			            return req.session.save(err => {
							console.log(err);
							res.redirect('/');
			            });
					}
					req.flash('error', 'Invalid email or password.');
					req.flash('oldInput',{email: req.body.email});
					return res.redirect('/sign-in');
				})
				.catch(err => {
					console.log(err);
					req.flash('error', 'Sorry! Somethig went wrong.');
					req.flash('oldInput',{email: req.body.email});
					return res.redirect('/sign-in');
				});
		} else {
			req.flash('error', 'No user found with this email');
			req.flash('oldInput',{email: req.body.email});
			return res.redirect('/sign-in');
		}
	})
	.catch(err => console.log(err));
};

exports.signOut = (req, res, next) => {
	if(res.locals.isAuthenticated){
		req.session.destroy(err => {
			return res.redirect('/');
		});
	} else {
		return res.redirect('/sign-in');
	}
};

exports.signUpPage = (req, res, next) => {
	res.render('sign_up',{layout: 'sign_in_layout', signUpPage: true, errorMessage: message(req), oldInput: oldInput(req)});
};

exports.signUp = (req, res, next) => {
	User.findOne({
		where: {
			email: req.body.email
		}
	}).then(user => {
		if(!user) {
			return bcrypt
					.hash(req.body.password, 12)
					.then(hashedPassword => {
						const user = new User({
							fullName: req.body.name,
							email: req.body.email,
							password: hashedPassword,
						});
						return user.save();
					})
					.then(result => {
						return res.redirect('/sign-in');
					});
		} else {
			req.flash('error', 'E-Mail exists already, please pick a different one.');
			req.flash('oldInput',{name: req.body.name});
        	return res.redirect('/sign-up');
		}
	})
	.catch(err => console.log(err));
};

exports.forgotPasswordPage = (req, res, next) => {
	if(res.locals.isAuthenticated){
		return res.redirect('/');
	} else {
		return res.render('forgot_password',{layout: 'sign_in_layout', loginPage: true, pageTitle: 'Forgot Password', errorMessage: message(req), oldInput: oldInput(req)});
	}
};

exports.forgotPassword = (req, res, next) => {
	const validationErrors = [];
	if (!validator.isEmail(req.body.email)) validationErrors.push('Please enter a valid email address.');

	if (validationErrors.length) {
		req.flash('error', validationErrors);
		return res.redirect('/forgot-password');
	}
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log(err);
			return res.redirect('/forgot-password');
		}
		const token = buffer.toString('hex');
		User.findOne({where: {
				email: req.body.email
				}
			})
			.then(user => {
				if(!user){
					req.flash('error', 'No user found with that email');
					return res.redirect('/forgot-password');
				}
				user.resetToken = token;
				user.resetTokenExpiry = Date.now() + 3600000;
				return user.save();
			}).then(result => {
				if(result) return res.redirect('/resetlink');
			}).catch(err => {console.log(err)})
	});
};
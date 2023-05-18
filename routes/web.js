const express = require('express');
const router = express.Router();
const HomeController = require('../app/controllers/HomeController');
const AuthController = require('../app/controllers/AuthController');
const EventController = require('../app/controllers/EventController');
const isAuth = require('../app/middlewares/isAuth');

router.get('/', HomeController.homePage);
router.get('/sign-in', AuthController.signInPage);
router.post('/sign-in', AuthController.signIn);
router.post('/sign-out', AuthController.signOut);
router.get('/sign-up', AuthController.signUpPage);
router.post('/sign-up', AuthController.signUp);
router.get('/forgot-password', AuthController.forgotPasswordPage);
router.post('/forgot-password', AuthController.forgotPassword);
router.get('/add-event', EventController.addEventPage);
router.post('/add-event', EventController.addEvent);

module.exports = router;
const express = require('express');

const router = express.Router();

const passport = require('passport');

const usersController = require('../controllers/users_controller');

//need to map a route to this users controller that is route to profile action(function) which is inside controller
router.get('/profile/:id', passport.checkAuthentication, usersController.profile); //Authentication is check then profile is accessible
router.post('/update/:id', passport.checkAuthentication, usersController.update);//for updating signed in user profile

router.get('/sign-up',usersController.signUp);
router.get('/sign-in',usersController.signIn);

//matching the routes =method in form is post
router.post('/create',usersController.create);



//using passport as a middleware to authenticate
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect : '/users/sign-in'},
),usersController.createSession);

//working - request comes in to create-session then passport.authenticate authenticates it
//if authentication is done then done(callback function) is return to user if it is not done then redirect to user signin
//if its done then usersController.createSession is called

router.get('/sign-out',usersController.destroySession);

router.get('/auth/google', passport.authenticate('google',{scope: ['profile','email']}));   //scope is info we are looking to fetch //email is not part of profile so take it seperately
router.get('/auth/google/callback',passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession) ; //this is url at which i will receive the data and it will first go through midddleware then passport.authenticate  //usersController.createSession redirecting to home page

module.exports = router;
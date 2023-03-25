const express = require('express');
const router = express.Router();
const passport = require('passport');

const commentsController = require('../controllers/comments_controller');

//Accesing all action posted in comments_controller
// router.post('/create', commentsController.create)

router.post('/create',passport.checkAuthentication, commentsController.create); //check authentication is function we have created  

//creting authenticated route-- commentsController check if user id matches and user is logged in then  delete button works
router.get('/destroy/:id', passport.checkAuthentication, commentsController.destroy);


//need to map a route to this post controller that is route to post action(function) which is inside controller

module.exports = router;
const express = require('express');
const router = express.Router();
const passport = require('passport');

const postsController = require('../controllers/posts_controller');

//Accesing all action posted in posts_constroller
// router.post('/create', postsController.create)

router.post('/create',passport.checkAuthentication, postsController.create); //check authentication is function we have created  

//creating route for delete
router.get('/destroy/:id', passport.checkAuthentication,postsController.destroy);

//need to map a route to this post controller that is route to post action(function) which is inside controller

module.exports = router;

//to make this route usable we need to call it from index.js of routes
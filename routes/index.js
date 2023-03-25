const express = require('express'); //everytime i do require express it will not create new instance of express it will just fetch the existing instance
//express is created and required only once

const homeController = require('../controllers/home_controller');

const router = express.Router();


console.log('router loaded');

////This router(index router) is accessing home_controller

router.get('/',homeController.home); //handles home request   

router.use('/users', require('./users')); //handles users request
//FOR REFERENCE
//for any further routes, access from here
//router.use('/routerName', require('./routerfile'));


router.use('/posts', require('./posts')); //now every posts in posts router will be mapped with /posts and then the route we have given in the post.js(router.post('/create', postsController.create))

router.use('/comments',require('./comments'));//comments router is being required

router.use('/api', require('./api'));

//we need to export it to be available for index.js
//we read that export and mosule.export do the same thing but here it is not doing same thing
module.exports = router;

////This router was accessing home_controller and in the index.js of the app it is saying app will be using this router
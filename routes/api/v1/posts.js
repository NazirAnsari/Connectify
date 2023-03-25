const express = require('express');

const router = express.Router();

const passport = require('passport');

//need post api controller
const postApi = require("../../../controllers/api/v1/posts_api"); 

router.get('/',postApi.index);

//we are setting session to be false as we do not want session cookies to be generated
//now this will put authentication check over passport
router.delete('/:id',passport.authenticate('jwt',{session: false}), postApi.destroy);//format is api-v1-post-postid   trying deleting a post with delete request 

module.exports = router;
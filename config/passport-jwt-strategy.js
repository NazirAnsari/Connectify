const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy; //importing strategy
//importing module which will help us extract JWT from the header
const ExtractJWT = require('passport-jwt').ExtractJwt;

//SINCE WE WILL BE using user model for authentication,we will also require that
const User = require('../models/user');

//while defining JWT strategy we need to have some options
let opts = {
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(), //header has key called authorization,we can have key called bearer which have JWT token
    secretOrKey : 'codeial' //this is encryption and decryption string//if i change it after generating a token i will not be able to decrypt that token back

}

//telling passport to use JWT strategy

// here user is already present in JWT,we are just fetching out id from payload and checking if user is there or not everytime

//passing opts and callback function which reads data from JWT payload which contain the info of user
passport.use(new JWTStrategy(opts,function(jwtPayLoad,done){
    //finding information based on payload
    //going to storing complete users information in the payload information encrypted info
    User.findById(jwtPayLoad._id,function(err,user){
        if(err){
            console.log('Error in finding user from JWT');
            return;
        }
        //here we do not need to match the password beacuse once user jwt has been generated (passport.use) is used after that to authenticate JWT
        if(user){
            return done(null,user); //done function contains the user
        }else{
            return done(null,false); //false means user not found
        }
    })

}));

module.exports = passport;
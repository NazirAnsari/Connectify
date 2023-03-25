const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy; //USING THIS STRATEGY
const crypto = require('crypto');

//we will be using user
const User = require('../models/user');

//telling passport to use a new strategy for google login
passport.use(new googleStrategy({
    //passing in the options
        clientID: "64326076452-vbidgec3oijabc2daoa9v9oq6se6phfs.apps.googleusercontent.com",
        clientSecret : "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",
        callbackURL : "http://localhost:8000/users/auth/google/callback", //this callback url will be matched with the one with google
    },
    //callback function
    function(accessToken,refreshToken, profile,done){ //profile will contain users information so will match users with the email in the database
        //find a user
        User.findOne({email: profile.emails[0].value}).exec(function(err,user){     //email: profile.emails[0] is an array of users email
            if(err){
                console.log('error in google strategy-passport',err);
                return;
            }
            console.log(accessToken,refreshToken);
            console.log(profile);

            if(user){
                //if found, set this user as req.user
                return done(null,user);
            }else{
                // if not found means user is not in system, create the user and set it as req.user(sign in that user)
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex') //for every user who signs up it will be generating a password for them
                },function(err,user){   //if there is callback function to it
                    if(err){
                        console.log('error in creating user google strategy-passport',err);
                        return;
                    }
                    return done(null,user);
                        
                });
            }
            
        });

    }
));

module.exports = passport;
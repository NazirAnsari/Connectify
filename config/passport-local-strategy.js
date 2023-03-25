//Importing passport
const passport = require('passport');
//require passport-local strategy
const LocalStrategy = require('passport-local').Strategy;

//import user
const User = require('../models/user');

//creating authentication function using passport - 
//need to tell passport to use this lcoal strategy that we have created

passport.use(new LocalStrategy({
    usernameField : 'email',                   //defining userName field in schema
    passReqToCallback: true    //it allows us to set first argument as request
    }, 
    //callback after the user signs in                                      // function inside local strategy which has email,password and done as 3 arguments
    function(req, email, password, done){           //done is callback function inbuilt to passport which is reporting back to passport.js which is automatically called //done takes 2 arguments 1 one is error, 2nd something else 
        //find a user and establish the identity
        User.findOne({email,email}, function(err,user){       //email-property, 2nd email- value passed on
            if(err){
                req.flash('error',err);
                return done(err);   //report error to passport
            }

            if(!user || user.password!=password){
                req.flash('error','Invalid Username/Password');
                return done(null,false);  //no error(put as null) but user is not found(authentication is false)

            } 
            //if user is found,pass on the user
            return done(null,user); 
        });          
    }    
));

// serializing the user to decide which key is to be kept in the cookies
//serailizeUser is inbuilt function
passport.serializeUser(function(user,done){
    done(null,user.id);    //wanting to store userid in encrypted format//here it automatically encrypts in the cookie
});


//deserializing the user from the key in the cookies
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log('Error in finding user ==> Passport');
            return done(err);   //report error to passport
        }

        return done(null,user);
    });
});

//check if the user is authenticated
//we are using function as middleware which is just to check if user is signed in or not
//req.is Authenticaed checks if user is signed in or not
passport.checkAuthentication = function(req,res,next){
    //if the user is signed in ,then pass on the request to the next function(controller's action)
    if(req.isAuthenticated()){
        return next();            //yes now user view the page
    }

    //if the user is not signed in
    return res.redirect('/users/sign-in');
}

//whenever any request is coming in this middleware will be called and user will be set in locals and user should be accessible in views
passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        //req. user contains the info of current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user; 
    }
    next();
}


module.exports = passport;
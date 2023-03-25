const User = require('../models/user');
const fs = require('fs');
const path = require('path');

//let's keep it same as before because there is no nesting level we have in this only one callback
module.exports.profile = function(req,res){
    //locating the user
    User.findById(req.params.id, function(err,user){
        return res.render('user_profile',{
            title: "User Profile", 
            profile_user: user   //we cannot use the key user because its already there in locals
        });

   // res.end('<h1>User Profile</h1>');   
    });
}
//This controller is ready to be accessed by a router,that route needs to be accessed by web browser
//web brower tells me to go to this route then the controller or action returns whatever data it have. otherwise if action is not present -error is thrown that you cannot access it
//now we need to create a route for it.
//everytime we create a controller 's action if i wanted it to be accessible it needs a route


//Now adding couple of actions 
//let's keep it same as before because there is no nesting level we have in this only one callback
module.exports.update = async function(req,res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id, req.body,function(err,user){    //req.params.id -id which i need user to be found with
    //         return res.redirect('back');  //back to page from where i came from
    //     });//if user does not match someone fiddling with my system
    // }else{
    //     return res.status(401).send('Unauthorized');
    //}
    if(req.user.id == req.params.id){

        try{
            //find the user
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){   //analyse the req part here and response when i have saved the user
                if(err){
                    console.log('*****Multer Error:',err);
                }

                    user.name = req.body.name;  //req contains the file
                    user.email = req.body.email;

                    if(req.file){
                        
                        if(user.avatar){
                            //function for deleting previous avtars
                            fs.unlinkSync(path.join(__dirname,'..', user.avatar));   //passing by validating with path module
                        }

                        //this is saving the path of the uploaded file into the avatar field in the user
                        user.avatar = User.avatarPath + '/' + req.file.filename;
                    }
                    user.save();
                    return res.redirect('back');
            }) ;   

        }catch(err){
            req.flash('error',err);
            return res.redirect('back');

        }

    }else{
        req.flash('error','Unauthorized');
        return res.status(401).send('Unauthorized');
    }
}

//render the sign up page
module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up',{
        title: "Connectify | Sign Up"
    });
}

//render the sign in page
module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in',{
        title: "Connectify | Sign In"
    });
}

//get the sign up data
module.exports.create = function(req,res){
    if (req.body.password!= req.body.confirm_password){
        return res.redirect('back');
    }
    //if same try to find out user with same email id beacuse email need to be unique
    User.findOne({email: req.body.email}, function(err,user){
        if(err){
            console.log('Error in finding user in signing up');
            return;
        }
        if(!user){
            User.create(req.body, function(err,user){
                if(err){
                    console.log('error in creating user while signing up');
                    return;
                }
                return res.redirect('/users/sign-in');
            })
        }else{return res.redirect('back'); 
        }

    });

}

// sign in And create session for user
//when passport.js uses local-strategy to authenticate the user comes here
module.exports.createSession = function(req,res){
    //setting up flash message
    req.flash('success', 'Logged in successfully');
    return res.redirect('/');
}
//session is created in passport.js

//this function is given to request using passport.js  passport gives it to request
module.exports.destroySession = function(req,res){
    req.logout(function(err){
        if(err){
             console.log(err);
         }
         req.flash('success', 'You Have Logged out!!');
         return res.redirect('/');
     });
}



const User = require('../../../models/user'); //imported user and json web token library 
const jwt = require('jsonwebtoken');

module.exports.createSession = async function(req,res){

    try{
    //finding the user and generating json web token corresponding to that user
        let user = await User.findOne({email: req.body.email});

        if(!user || user.password != req.body.password){
            return res.json(422,{
                message: "Invalid username or password"
            });
        }

        return res.json(200, {
            message: 'Sign in successful, here is your token,please keep it safe',
            data:{
                token: jwt.sign(user.toJSON(), 'codeial',{expiresIn: '100000'})// token pass on using JWT token lib  //user.toJSON()--encrypted part
            }
        })
    }catch(err){
        console.log('*******',err);
        return res.json(500,{
            message: "Internal Server Error"
        });
    }
}
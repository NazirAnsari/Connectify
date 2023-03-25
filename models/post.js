const mongoose = require('mongoose');  //importing mongoose

//for creating schema whenver created collection that goes on to database
//this mongoose.Schema will have fields
const postSchema = new mongoose.Schema({
    content:{
        type: String,  
        require :true       //Without it data wont be saved
    },  
    //linking it to user
    user:{
        type: mongoose.Schema.Types.ObjectId,  //this type is reference to Object Id present in studio3T ,, this type should refer to users schema
        ref: 'User' //refering to users schema
    },
    //include the array of ids of all comments in this post schema itself
    comments:[{
        type: mongoose.Schema.Types.ObjectId,  //this type is reference to Object Id present in studio3T ,, this type should refer to users schema
        ref: 'Comment' //refering to users schema
    }],
},{
    //Adding timeStamps--it introduces 2 fields-createdAt and UpdatedIt
    timestamps: true
});

//to tell this will be going to be model in the database
const Post = mongoose.model('Post', postSchema);

//exporting the module //Wherever we use it we will just import this file
module.exports = Post;
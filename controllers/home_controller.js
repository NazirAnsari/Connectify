const Post = require('../models/post'); //referencing to the model to find all the post

const User = require('../models/user'); //requiring users to get list of all users

//IN THIS WE NEED TO EXPORT THE FUNCTION WHICH IS PUBLICALLY AVAILABLE TO ROUTES FILE AND THAT SHOULD RETURN SOMETHING

//using async await function
module.exports.home = async function(req,res){
    try{
        //populate the user of each post  //found out all the post from inside the database
        //awaited this post to be completed
        let posts = await Post.find({})
        .sort('-createdAt') //prepending by this latest post will be at top
        .populate('user')
        .populate({
            path: 'comments',
            populate:{
                path: 'user'
            }
        });

        //awaited this user search query to be executed
        let users = await User.find({});

        //returned something to browser
        return res.render('home',{
            title: "Connectify | Home",
            posts : posts,           //passing on all the post
            all_users: users
        });
    
    //any sort of error comes here
    }catch(errr){
        console.log('Error',err);
        return;
    }
}







//Older way of  writing where there arer callback hells
// module.exports.home = function(req,res){
//     // return res.end('<h1>Express is up for Codeial</h1>');

//     // console.log(req.cookies);
//     // res.cookie('user_id',25);

//     //to return all the post
//     // Post.find({}, function(err,posts){
//     //     return res.render('home',{
//     //         title: "Codeial | Home",
//     //         posts : posts           //passing on all the post
//     //     });
//     // });

//     //1st way = populate the user of each post
//     Post.find({})
//     .populate('user')
//     .populate({
//         path: 'comments',
//         populate:{
//             path: 'user'
//         }
//     })//making a callback for post.find
//     .exec(function(err,posts){

//         //finding all users //callback for exec
//         User.find({}, function(err,users){
//             //returning to browser the list of all users and list of posts along with the title
//             return res.render('home',{
//                 title: "Codeial | Home",
//                 posts : posts,           //passing on all the post
//                 all_users: users
//             }); 
//         })

//     })
// }





//module.exports.actionName = function(req,res){}

//2nd way - using then 
//Post.find({}).populate('comments').exec();

//3rd way - 
//let posts = Post.find({}).populate('comments').exec();

//posts.then()
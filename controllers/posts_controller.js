//need to create a new post,,post belongs to post schema we need to import that
const Post = require('../models/post');
const Comment = require('../models/comment');

//using async await
module.exports.create = async function(req,res){
    //creating new post from the data into the form
    //directly saving the data coming from form into the post but also i need to save the user which is logged in

    //we are creating an action to submit the data of the form and saving it in database
    //we have created an post action to create a post in the db

    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        //checking if the request is ajax request
        if(req.xhr){
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            })
        }

        req.flash('success','Post published');
        return res.redirect('back');

    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }
    
}



//old way of writing -it is asynchronous code in which we have use multiple callback function that is creating callback hell

// module.exports.create = function(req,res){
//     //creating new post from the data into the form
//     //directly saving the data coming from form into the post but also i need to save the user which is logged in

//     //we are creating an action to submit the data of the form and saving it in database
//     //we have created an post action to create a post in the db
//     Post.create({
//         content: req.body.content,
//         user: req.user._id
//     }, function(err,post){
//         if(err){
//             console.log('error in creating a post');
//             return;
//         }
//         return res.redirect('back');
//     });

// }


//using async await
module.exports.destroy = async function(req,res){
    //before deleting check if post exist in database or not
    try{
        let post = await Post.findById(req.params.id);

    //checking if the user deleting the post is the user who created the post
        //post.user is the id of user
        // .id means converting the object id into string
        if(post.user == req.user.id){
            post.remove();

            //first import then delete the comment
            //deleteMany deletes all the comments based on some query passed
            //req.params.id- strings are being matched
            //if err it want return all the comments that are deleted because they are delelted we will not keep them in db
            //if req.user and req.post is not matched then we will return back
            
            await Comment.deleteMany({post:req.params.id});

            if(req.xhr){
                console.log(req.params.id);
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success','Post and associated comments deleted');

            return res.redirect('back');
        }else{
            req.flash('error','You cannot delete this post');
            return res.redirect('back');
        }
        
    }catch(err){
        console.log(err);
        req.flash('error',err);
        return res.redirect('back');
    }
} 






//old way of writing -it is asynchronous code in which we have use multiple callback function that is creating callback hell

// module.exports.destroy = function(req,res){
//     //before deleting check if post exist in database or not
//     Post.findById(req.params.id, function(err,post){
//         //checking if the user deleting the post is the user who created the post
//         //post.user is the id of user
//         // .id means converting the object id into string
//         if(post.user == req.user.id){
//             post.remove();

//             //first import then delete the comment
//             //deleteMany deletes all the comments based on some query passed
//             //req.params.id- strings are being matched
//             //if err it want return all the comments that are deleted because they are delelted we will not keep them in db
//             //if req.user and req.post is not matched then we will return back
            
//             Comment.deleteMany({post:req.params.id},function(err){
//                 return res.redirect('back');
//             });
//         }else{
//             return res.redirect('back');
//         }
//     });
// } 
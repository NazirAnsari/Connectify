const Comment = require('../models/comment');//using schema of comment
const Post = require('../models/post');   //accessing the post model

//using async await
//here 2 things are done 1.post is being found then commment is found
//2.after creating commnet and allocating it to post, we are adding that comment id in post list of comment ids
module.exports.create = async function(req,res){

    try{
        //finding the post  
    let post = await Post.findById(req.body.post);

        if(post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,  //beacuse id name is post see in home.ejs
                user: req.user._id
            });
            post.comments.push(comment); //Updating comment pushing to post, mongoDB will automatically fetch the id and push it 
            post.save();

            if(req.xhr){
                //similar for comments to fetch the user's id

                return res.status(200).json({
                    
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
            }

            req.flash('success','Comment published!');

            res.redirect('/');
        }
    }catch(err){
        console.log('Error',err);
        return;
    }
}



//old way of writing -it is asynchronous code in which we have use multiple callback function that is creating callback hell

// module.exports.create = function(req,res){
//         //finding the post  
//         console.log(req.body);
//         Post.findById(req.body.post,function(err,post){
//             if(post){
//                 console.log(post);
//                 Comment.create({
//                     content: req.body.content,
//                     post: req.body.post,  //beacuse id name is post see in home.ejs
//                     user: req.user._id
//                 },function(err,comment){
//                     //handle error
//                     if(err){
//                         console.log(err);
//                         return;
//                     }
//                     console.log(comment);
//                     post.comments.push(comment); //Updating comment pushing to post, mongoDB will automatically fetch the id and push it 
//                     post.save();

//                     res.redirect('/');
//                 });
//             }
//         });
// }

//using async await
module.exports.destroy = async function(req,res){
    try{
        //finding the comment
        let comment = await Comment.findById(req.params.id);

        if(comment.user == req.user.id){
            //before deleting the comment we need to fetch the id of comment--go inside the post ,find the comment and delete it
            //if yes then remove the comment
            let postId = comment.post;  

            comment.remove();

            //if comment is there its post should be there
            //i need to update the post as i am deleting one of the reference id
            //find it by postId
            //what need to update : we will pull out the comment id from list of comments for which we can use inbuilt function in mongoose
            //pull throws us the id which is matching with the comment id
            let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});

            //send the comment id which was deleted back to the views
            if(req.xhr){
                return res.status(200).json({
                    data:{
                        comment_id : req.params.id
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success', 'Comment deleted!');

            //doingnothing with the post 
            return res.redirect('back');

        }else{
            req.flash('error','unauthorized');
            return res.redirect('back');
        }
    }catch(err){
        console.log('Error',err);
        return;
    }
}



//old way of writing -it is asynchronous code in which we have use multiple callback function that is creating callback hell
// module.exports.destroy = function(req,res){
//     //finding the comment
//     Comment.findById(req.params.id, function(err,comment){
//         if(comment.user == req.user.id){
//             //before deleting the comment we need to fetch the id of comment--go inside the post ,find the comment and delete it
//             //if yes then remove the comment
//             let postId = comment.post;  

//             comment.remove();

//             //if comment is there its post should be there
//             //i need to update the post as i am deleting one of the reference id
//             //find it by postId
//             //what need to update : we will pull out the comment id from list of comments for which we can use inbuilt function in mongoose
//             //pull throws us the id which is matching with the comment id
//             Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}},function(err,post){
//                 //doingnothing with the post 
//                 return res.redirect('back');
//             })
//         }else{
//             return res.redirect('back');
//         }
//     });

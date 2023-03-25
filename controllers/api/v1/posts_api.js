//since we are finding it from post Schema we need to reqire it from there
const Post = require('../../../models/post');
const Comment = require('../../../models/comment');//refering a comment for deleting it

module.exports.index= async function(req,res){   //index is used to list down something as action name

    let posts = await Post.find({})    //found out all the post from inside the database
        .sort('-createdAt') //prepending by this latest post will be at top
        .populate('user')
        .populate({
            path: 'comments',
            populate:{
                path: 'user'
            }
        });

    //to send back json data we do 
    return res.json(200,{
        message: "List of posts",
        posts: posts
    })
} 

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

            

        
            return res.json(200,{
                message: "Post and associated comments deleted successfully!"
            });
        }else{
            return res.json(401,{
                message: "You cannot delete this post! "
            });
        }
        
    }catch(err){
        console.log('**********',err);
        return res.json(500,{
            message: "Internal Server Error"
        });
    }
} 
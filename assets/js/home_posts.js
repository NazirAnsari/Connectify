// function that send the data to controller function

{
    //method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        //whenever this form is submitted i did not want it to submit naturally so we will do prevent default
        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),  //this converts the form data into json like content will be key and value will be value filled in the form
                success: function(data){
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);

                    //caling the function using jquery-it needs to be inside new post
                    //new post object has 'delete-post-button' class indside it and we are getting object for it
                    deletePost($(' .delete-post-button', newPost));  //this is how it works in jquery
                    new PostComments(data.data.post._id);

                },error: function(error){
                    console.log(error.responseText);
                }
            })

        });
    }
    
    //method to create a post in DOM-- we need a function that would help in converting this html text(copied) into jQuery object
    let newPostDom = function(post){
        return $(`<li id="post-${post._id}"> 
            <p>
                    <small>
                            <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
                    </small>
                    ${post.content }
                    <br>
                    <small>
                    ${post.user.name }      
                    </small>
            </p> 
            <div class ="post-comments">
                  
                    <form action="/comments/create" method="POST">
                            <input type="text" name="content" placeholder="Type Here to add comment..." required>
                            
                            <!--  we need to send the post id at which i need to add comment to.. -->
                            <input type="hidden" name="post" value="${post._id}">
                            <input type="submit" value="Add Comment">
                    </form>
        
                    <div class="post-comments-list">
                            <ul id="post-comments-${post._id}">  
                                    
                            </ul>
                    </div>
            </div>     
        </li>`)
    }

    //method to delete a post from DOM
    let deletePost = function(deleteLink){    //passing just the delete link
        $(deleteLink).click(function(e){  //work on any delete link associated with post  // e is for event
            e.preventDefault();           //dont want natural behavoiur for delete link does not want to go somewhere after clicking

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),//getting the value of href in `a` tag

                success: function(data){
                    console.log('*****************');
                    console.log(data);
                    console.log('*****************');
                    //getting the data of the id which was deleted , sending it in url we will get it back
                    $(`#post-${data.data.post_id}`).remove();   //it will remove/delete the post

                },error: function(error){
                    console.log(error.responseText); //display the error
                }
            });
        });
    }//now after creating delete button i can loop over all the delete link but now we will be adding to every post that is dynamically added to the page without refereshing

    let convertPostsToAjax = function(){
        
        $('#posts-list-container>ul>li').each(function(){

            let self = $(this);
            let deleteButton = $('.delete-post', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]

            console.log(postId);
            new PostComments(postId);
        });
    }

    convertPostsToAjax();
     
    createPost();
}
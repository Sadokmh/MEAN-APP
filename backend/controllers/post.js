const Post = require('../models/post');



exports.addPost = (req,res,next) => {
    console.log('Posting a new post...');
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content:  req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId
    });
    post.save()
        .then( post => {
            //console.log(post);
            res.status(201).json({
            message: 'Posts added successfully !',
            post: {
                ...post,   // title: post.title,content: post.content,imagePath: post.imagePath
                id: post._id,
            }
        });
        })
        .catch( err => {
            console.log('Error !');
            res.status(500).json({
                message: 'Created post failed !'
            })
        })
    
}









exports.getPosts = (req,res,next) => {
    const pageSize= +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts ;
    if (pageSize && currentPage ) {
         postQuery
             .skip(pageSize * (currentPage - 1))
             .limit(pageSize)
    }
    postQuery
        .then( posts => {
              fetchedPosts = posts;
              return Post.countDocuments()
        })
        .then( postCount => {
            res.status(200).json({
                message: 'Posts successfully fetched !',
                posts: fetchedPosts,
                count: postCount
            })
        })
        .catch( err => {
            console.log('error occured !');
            res.status(500).json({
                message: 'Fetching posts failed !'
            });
        });
 }





exports.getOnePost = (req,res,next) => {
    Post.findOne({_id: req.params.id})
        .then( post => {
            res.status(200).json(post);
        })
        .catch( err => {
            console.log('Error !');
            res.status(500).json({
                message: 'Fetching post failed !'
            });
        })
}





exports.updatePost = (req,res,next) => {
    
    if (req.file) {  // ken taswira tbadlet chnal9a file fel request donc chnen3awed nafs logique mtaa create                     newpost 
        const url = req.protocol + '://' + req.get('host');
        req.body.imagePath = url + '/images/' + req.file.filename;
    }    //ken taswira metbadletech chto93ed string (path mte3ha)
    post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: req.body.imagePath,
        creator: req.userData.userId
    })
    Post.updateOne({ _id:req.params.id , creator: req.userData.userId }, post )
        .then( result => {
            if ( result.n > 0 ) {        // yaani fama haja tbadlet
                console.log('Post updated successfully !');
                res.status(200).json({
                    message: 'Post successfully updated !'
                });
            }
            else {
                res.status(401).json({
                    message: 'Not authorized !'
                });
            }
        })
        .catch( err => {
            console.log('Error occured while updating !');
            console.log(err.message)
            res.status(500).json({
                message: 'Post upadting failed !'
            })
        })
} 









exports.deletePost = (req,res,next) => {
    console.log(req.params.id);
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
        .then( result => {
            if ( result.n > 0 ) {        // yaani fama haja tbadlet
                console.log('Post deleted successfully !');
                res.status(200).json({
                    message: 'Post successfully deleted !'
                });
            }
            else {
                res.status(401).json({
                    message: 'Not authorized !'
                });
            }
        } )
        .catch( err => {
            console.log('Error occured !');
            res.status(500).json({
                message: 'Deleting post failed !'
            });
        })
   
} 
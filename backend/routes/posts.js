const express = require('express');
const router = express.Router();
const multer = require('multer');


const Post = require('../models/post');


const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({ // where multer should put files which it detects un the incoming request
    destination: (req,file,cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype]; //check if the file type is one of our defined types 
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }
        cb(error,"backend/images"); //cb: Callback
    },
    filename: (req,file,cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);  //cb: Callback
    }
});   


router.post('', multer({storage:storage}).single('image') , (req,res,next) => {
    console.log('Posting a new post...');
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content:  req.body.content,
        imagePath: url + '/images/' + req.file.filename
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
            res.status(404).json({
                message: 'Post not found !'
            })
        })
    
})



router.get('',(req,res,next) => {
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
           console.log(postCount);
           res.status(200).json({
               message: 'Posts successfully fetched !',
               posts: fetchedPosts,
               count: +postCount
           })
       })
       .catch( err => {
           console.log('error occured !');
           res.status(500);
       });
})



router.get('/:id' , (req,res,next) => {
    Post.findOne({_id: req.params.id})
        .then( post => {
            res.status(200).json(post);
        })
        .catch( err => {
            console.log('Error !');
        })
});


router.delete('/:id', (req,res,next) => {
    console.log(req.params.id);
    Post.deleteOne({ _id: req.params.id })
        .then( result => {
            console.log('Post successfully deleted ! ');
            res.status(200).json({
                message: 'Post deleted !'
            });
        } )
        .catch( err => {
            console.log('Error occured !');
            res.status(500);
        })
   
})



router.put('/update/:id', multer({storage:storage}).single('image'), (req,res,next) => {
    
    if (req.file) {  // ken taswira tbadlet chnal9a file fel request donc chnen3awed nafs logique mtaa create newpost 
        const url = req.protocol + '://' + req.get('host');
        req.body.imagePath = url + '/images/' + req.file.filename;
    }    //ken taswira metbadletech chto93ed string (path mte3ha)
    Post.updateOne({ _id:req.params.id }, {...req.body} )
        .then( result => {
            console.log('Post updated successfully !');
            res.status(200).json({
                message: 'Post successfully updated !'
            });
        })
        .catch( err => {
            console.log('Error occured while updating !');
            console.log(err.message)
        })
})

module.exports = router;

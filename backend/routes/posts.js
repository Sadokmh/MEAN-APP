const express = require('express');
const router = express.Router();

const Post = require('../models/post');


router.post('', (req,res,next) => {
    const post = new Post({
        title: req.body.title,
        content:  req.body.content
    });
    post.save()
        .then( post => {
            console.log(post);
            res.status(201).json({
            message: 'Posts added successfully !',
            postid: post._id
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
   Post.find()
       .then( post => {
           console.log('Posts found: ' + post);
           res.status(200).json({
            message: 'Posts fetched successfully',
            posts: post
        });
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



router.put('/update/:id', (req,res,next) => {
    Post.updateOne({ _id:req.body.id }, {...req.body} )
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

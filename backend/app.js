const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

const Post = require('./models/post');


mongoose.connect("mongodb+srv://sadokmh:DJUmWaQA8DwDgQx8@cluster0-gpr8s.mongodb.net/mean-app?retryWrites=true")
        .then( () => {
            console.log('Connected to the Database !');
        })
        .catch( () => {
            console.log('Connection failed !');
        })

//Allow CORS
app.use( (req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-with, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    next();
} )


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.post('/api/posts', (req,res,next) => {
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
        })
    
})



app.get('/api/posts',(req,res,next) => {
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


app.delete('/api/posts/:id', (req,res,next) => {
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


module.exports = app;
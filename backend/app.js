const express = require('express');

const app = express();
const bodyParser = require('body-parser');

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
    const posts = req.body;
    console.log(posts);
    res.status(201).json({
        message: 'Posts addes successfully !'
    });
})



app.get('/api/posts',(req,res,next) => {
    const posts= [
        { id:'54555454',
          title:'Post 1',
          content: 'Post 1\'s content'
         },
         { id:'989898',
          title:'Post 2',
          content: 'Post 2\'s content'
         },
         { id:'5258787',
          title:'Post 3',
          content: 'Post 3\'s content'
         }
    ];
    res.status(200).json({
        message: 'Posts fetched successfully',
        posts
    });
})

module.exports = app;
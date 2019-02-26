const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

const postRoutes = require('./routes/posts');

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

app.use('/api/posts', postRoutes);




module.exports = app;
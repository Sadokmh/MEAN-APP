const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users'); 

mongoose.connect("mongodb+srv://sadokmh:"+process.env.MONGO_ATLAS_PW+"@cluster0-gpr8s.mongodb.net/mean-app?retryWrites=true" , { useNewUrlParser: true })
        .then( () => {
            console.log('Connected to the Database !');
        })
        .catch( () => {
            console.log('Connection failed !');
        })


        


//Allow CORS
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/images", express.static(path.join("backend/images"))); //any request starting /images will be                                                 allowed to continue and fetched their files from there.. make sure                                            that images is the folder in backend folder


app.use('/api/users',userRoutes);
app.use('/api/posts', postRoutes);





module.exports = app;
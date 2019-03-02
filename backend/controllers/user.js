const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');



exports.createUser = (req,res,next) => {
    console.log('Creating a new user...');
    console.log(req.body);
    bcrypt.hash(req.body.password,10)
          .then( hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            console.log(user);
            user.save()
                .then( usr => {
                    res.status(201).json({
                        message: 'User successfully created !',
                        user: usr
                    });
                })
                .catch( err =>{
                    res.status(500).json({
                            message: 'Invalid authentication credentials'
                    });
                });
          });
    
}





exports.loginUser = (req,res,next) => {
    console.log('logging in...');
    let fetchedUser;
    User.findOne({email: req.body.email})
        .then( usr =>{
            if (!usr) {
                return res.status(401).json({
                    message: 'Email incorrect'
                });
            }
            fetchedUser=usr;   
            return bcrypt.compare(req.body.password, usr.password);
        })
        .then( result =>{
            if (!result) {
                return res.status(401).json({
                    message: 'Incorrect password '
                });
            }
            const token = jwt.sign(
                {email: fetchedUser.email , id: fetchedUser._id},
                process.env.JWT_KEY,
                {expiresIn: '1h'}  //this is optional, yaani yo93ed valable ken 1 heure el token 
            );
            res.status(200).json({
                token: token,
                userId: fetchedUser._id,
                expiresIn: 3600
            });
        })
        .catch( err => {
            return res.status(401).json({
                message: 'Invalid authentication credentials'
            });
        })
}
const express = require('express');
const router = express.Router();



const postController = require('../controllers/post');

//middleware for token
const checkAuth = require('../middleware/check-auth');
//middleware for multer file upload
const extractFile = require('../middleware/file');


  


router.post('',checkAuth, extractFile , postController.addPost);



router.get('', postController.getPosts);



router.get('/:id' , postController.getOnePost);


router.delete('/:id', checkAuth, postController.deletePost);



router.put('/update/:id', checkAuth, extractFile , postController.updatePost);

module.exports = router;

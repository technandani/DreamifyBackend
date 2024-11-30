const express = require('express');
const { createPost, getAllPosts } = require('../controllers/post');
const router = express.Router();

router.use(express.urlencoded({ extended: false }));

router.route('/create-post').post(createPost);  
router.route('/allPosts').get(getAllPosts);  

module.exports = router;
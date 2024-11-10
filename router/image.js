const express = require('express');
const { GenerateImage, GetPosts } = require('../controllers/image');
const router = express.Router();

router.use(express.urlencoded({ extended: false }));

router.route('/generate-image').get(GenerateImage);  
router.route('/images').get(GetPosts);    

module.exports = router;
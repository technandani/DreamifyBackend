const express = require('express');
const { GenerateImage, GetGeneratedImage } = require('../controllers/image');
const router = express.Router();

router.use(express.urlencoded({ extended: false }));

router.route('/generate-image').get(GenerateImage);  
router.route('/allImages').get(GetGeneratedImage);    

module.exports = router;
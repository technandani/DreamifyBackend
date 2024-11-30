const express = require("express");
const { Register, Login } = require("../controllers/user");
const router = express.Router();

const { upload } = require("../service/auth");
router.use(express.urlencoded({ extended: false }));

router.route('/register').post(upload.single('profilePic'), Register); 
router.route('/login').post(Login);

module.exports = router;

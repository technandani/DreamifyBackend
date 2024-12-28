const express = require("express");
const { Register, Login, loginWithGoogle } = require("../controllers/user");
const upload = require("../middlewares/multer");
const router = express.Router();

router.post("/register", upload.single("profilePic"), Register);
router.post("/login", Login);
router.post("/loginWithGoogle", loginWithGoogle);

module.exports = router;
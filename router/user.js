const express = require("express");
const { Register, Login } = require("../controllers/user");
const upload = require("../middlewares/multer");
const router = express.Router();

router.post("/register", upload.single("profilePic"), Register);
router.post("/login", Login);

module.exports = router;
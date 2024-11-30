const { setUser } = require("../service/auth");
const User = require("../model/user");
const bcrypt = require('bcryptjs');
const cloudinary = require("cloudinary").v2; 
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname); 
  },
});

async function Register(req, res) {
  try {
    const { name, email, password } = req.body;
    const profilePic = req.file; 

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({
        success: false,
        message: "User already present, use another email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePicUrl = "images/user.png";

    if (profilePic) {
      const result = await cloudinary.uploader.upload(profilePic.path);
      profilePicUrl = result.url; 
    }

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      profilePic: profilePicUrl, 
    });

    return res.status(200).json({
      success: true,
      message: "User created successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function Login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid user, Register first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Password does not match",
      });
    }

    const token = setUser(user);

    res.cookie("uid", token, {
      httpOnly: true,  
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'None',
      path: '/',
      maxAge: 60 * 60 * 1000,  // 1 hour
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = { Register, Login };

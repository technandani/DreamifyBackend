const User = require("../model/user");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const secret = "Nandani@123";

async function Register(req, res) {
  try {
    const { name, email, password } = req.body;
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already in use. Please use a different email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePicUrl = "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/default-user.png";
    if (req.file) {
      const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "users/profile_pics",
      });
      profilePicUrl = cloudinaryResult.secure_url;
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
      data: {
        name: newUser.name,
        email: newUser.email,
        profilePic: newUser.profilePic,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({
      success: false,
      message: "Error during registration.",
      error: error.message,
    });
  }
}

async function Login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    const token = jwt.sign({ email: user.email, _id: user._id }, secret, {
      expiresIn: "120h",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      data: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = { Register, Login };
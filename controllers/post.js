const jwt = require("jsonwebtoken");
const Post = require("../model/post");
const secret = "Nandani@123";

async function createPost(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1]; 
    console.log("tokenthatcomes from frontend is: ",token);

    if (!token) {
      console.log("No token provided.");
      return res.status(401).json({
        success: false,
        message: "User not logged in. Token missing.",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (error) {
      console.log("Token verification failed:", error);
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    const user = decoded; 

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid user token.",
      });
    }

    const { url, prompt } = req.body;

    if (!url || !prompt) {
      return res.status(400).json({
        success: false,
        message: "URL and prompt are required.",
      });
    }

    const newPost = await Post.create({
      user: user._id,
      url,
      prompt,
      visitingTime: [Date.now()],
    });

    return res.status(200).json({
      success: true,
      message: "Post created successfully.",
      post: newPost,
    });
  } catch (error) {
    console.log("Server error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}



async function getAllPosts(req, res) {
    try {
      const posts = await Post.find({})
        .sort({ _id: -1 })
        .populate("user", "name profilePic");
  
      return res.json(posts);
    } catch (error) {
      console.error("Error fetching images:", error);  
      res.status(500).send("Error fetching images");
    }
  }
  
module.exports = { createPost, getAllPosts };

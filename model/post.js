const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  visitingTime: [
    {
      type: Date,
      default: Date.now, 
    },
  ],
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;

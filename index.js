const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define the image schema and model
const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
});

const Image = mongoose.model("Image", imageSchema);

app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Route to generate and store the image
app.get("/generate-image", async (req, res) => {
  try {
    const prompt = req.query.prompt || "default prompt"; // Use query parameter for prompt

    console.log(`Generating image for prompt: "${prompt}"`);

    // Fetch the generated image from Pollinations
    const response = await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`, {
      responseType: "arraybuffer",
    });

    // Create a stream to upload the image to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload failed:", error);
          return res.status(500).send("Cloudinary upload failed");
        }

        try {
          // Save the Cloudinary URL to MongoDB
          const newImage = await Image.create({ url: result.url, prompt: prompt });
          console.log(`Image saved to MongoDB with URL: ${result.url}`);
          
          // Respond with the generated image URL
          res.json({ imageUrl: result.url });
        } catch (dbError) {
          console.error("Error saving image to MongoDB:", dbError);
          res.status(500).send("Error saving image to MongoDB");
        }
      }
    );

    // Pass the image buffer to the Cloudinary upload stream
    uploadStream.end(response.data);

  } catch (error) {
    console.error("Error generating or uploading image:", error);
    res.status(500).send("Error generating or uploading image");
  }
});


// Route to get all images
app.get("/images", async (req, res) => {
  try {
    const allUrls = await Image.find({});
    return res.json(allUrls);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).send("Error fetching images");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

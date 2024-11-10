const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const cors = require("cors");
const ImageRouter = require("./router/image");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.urlencoded({ extended: false }));
app.use(cors());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use('/', ImageRouter);  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});










// app.get("/generate-image", async (req, res) => {
//   try {
//     const prompt = req.query.prompt || "default prompt";

//     console.log(`Generating image for prompt: "${prompt}"`);

//     // Fetch the generated image from Pollinations
//     const response = await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`, {
//       responseType: "arraybuffer",
//     });

//     const uploadStream = cloudinary.uploader.upload_stream(
//       { resource_type: "image" },
//       async (error, result) => {
//         if (error) {
//           console.error("Cloudinary upload failed:", error);
//           return res.status(500).send("Cloudinary upload failed");
//         }

//         try {
//           const newImage = await Image.create({ url: result.url, prompt: prompt });
//           console.log(`Image saved to MongoDB with URL: ${result.url}`);
          
//           res.json({ imageUrl: result.url });
//         } catch (dbError) {
//           console.error("Error saving image to MongoDB:", dbError);
//           res.status(500).send("Error saving image to MongoDB");
//         }
//       }
//     );

//     uploadStream.end(response.data);

//   } catch (error) {
//     console.error("Error generating or uploading image:", error);
//     res.status(500).send("Error generating or uploading image");
//   }
// });


// app.get("/images", async (req, res) => {
//   try {
//     const allUrls = await Image.find({});
//     return res.json(allUrls);
//   } catch (error) {
//     console.error("Error fetching images:", error);
//     res.status(500).send("Error fetching images");
//   }
// });

const axios = require("axios");
const cloudinary = require("cloudinary").v2;
const Image = require("../model/image");

async function GenerateImage(req, res) {
  try {
    const prompt = req.query.prompt || "default prompt";
    console.log(`Generating image for prompt: "${prompt}"`);

    // Fetch image data from Pollinations
    const response = await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`, {
      responseType: "arraybuffer",
    });

    if (response.status !== 200) {
      console.error("Pollinations API returned a non-200 response");
      return res.status(500).send("Failed to fetch image from Pollinations");
    }

    console.log("Image data fetched from Pollinations");

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload failed:", error);
          return res.status(500).send("Cloudinary upload failed");
        }

        try {
          const newImage = await Image.create({ url: result.url, prompt: prompt });
          console.log(`Image saved to MongoDB with URL: ${result.url}`);
          res.json({ imageUrl: result.url });
        } catch (dbError) {
          console.error("Error saving image to MongoDB:", dbError);
          res.status(500).send("Error saving image to MongoDB");
        }
      }
    );

    uploadStream.end(response.data);

  } catch (error) {
    console.error("Error generating or uploading image:", error);
    res.status(500).send("Error generating or uploading image");
  }
}

async function GetPosts(req, res) {
  try {
    // Fetch images in reverse order (newest first)
    const allUrls = await Image.find({}).sort({ _id: -1 });
    return res.json(allUrls);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).send("Error fetching images");
  }
}


module.exports = { GenerateImage, GetPosts };

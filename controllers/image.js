const axios = require("axios");
const cloudinary = require("cloudinary").v2;
const Image = require("../model/image");

async function GenerateImage(req, res) {
  try {
    const prompt = req.query.prompt || "default prompt";
    console.log(`Generating image for prompt: "${prompt}"`);

    const pollinationUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
    const response = await axios.get(pollinationUrl, { responseType: "arraybuffer" });

    if (response.status !== 200) {
      console.error("Pollinations API returned a non-200 response");
      return res.status(500).json({ message: "Failed to fetch image from Pollinations" });
    }
    console.log("Image data successfully fetched from Pollinations");

    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image", secure: true },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload failed:", error);
          return res.status(500).json({ message: "Cloudinary upload failed" });
        }

        try {
          const newImage = await Image.create({ url: result.secure_url, prompt });
          console.log(`Image saved to MongoDB with URL: ${result.secure_url}`);
          return res.json({ imageUrl: result.secure_url });
        } catch (dbError) {
          console.error("Error saving image to MongoDB:", dbError);
          return res.status(500).json({ message: "Error saving image to MongoDB" });
        }
      }
    );

    uploadStream.end(response.data);
  } catch (error) {
    console.error("Error generating or uploading image:", error);
    return res.status(500).json({ message: "Error generating or uploading image" });
  }
}

module.exports = GenerateImage;


async function GetPosts(req, res) {
  try {
    const allUrls = await Image.find({}).sort({ _id: -1 });
    return res.json(allUrls);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).send("Error fetching images");
  }
}


module.exports = { GenerateImage, GetPosts };

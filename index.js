const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const cors = require("cors");
const ImageRouter = require("./router/image");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://dreamify-sigma.vercel.app', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));

app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use('/', ImageRouter);

app.use((err, req, res, next) => {
  if (err instanceof cors.CorsError) {
    res.status(500).json({ message: "CORS Error" });
  } else {
    next(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

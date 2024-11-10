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

// CORS setup
const corsOptions = {
  origin: 'https://dreamify-sigma.vercel.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Apply CORS headers directly for extra security
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://dreamify-sigma.vercel.app");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Route handling
app.use('/', ImageRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

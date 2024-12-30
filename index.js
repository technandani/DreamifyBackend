const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const ImageRouter = require("./router/image");
const UserRouter = require("./router/user");
const PostRouter = require("./router/post");
// const { restrictToUser } = require("./middlewares/auth"); 

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"], // Add any methods you need
  credentials: true, // Allow cookies to be sent with requests
};
app.use(cors(corsOptions));

app.use(express.json()); 
app.use(cookieParser()); 
app.use(express.urlencoded({ extended: false })); 

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use("/image", ImageRouter);
app.use("/users", UserRouter); 
app.use("/posts", PostRouter); 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

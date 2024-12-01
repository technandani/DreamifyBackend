const jwt = require("jsonwebtoken");
const secret = "Nandani@123";

function setUser(user) {
  return jwt.sign({
    _id: user._id,
    email: user.email,
  }, secret, { expiresIn: '1h' });  
}

function getUser(token) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;  
  }
}


const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname); 
  },
});

const upload = multer({ storage: storage });

module.exports = {
    setUser,
    getUser,
    upload,
}
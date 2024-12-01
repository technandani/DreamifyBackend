const jwt = require('jsonwebtoken');

async function restrictToUser(req, res, next) {
    console.log("Headers received:", req.headers);
    console.log("Raw Cookie Header:", req.headers.cookie); 
    console.log("Parsed Cookies:", req.cookies); 
  
    // if (!req.cookies || !req.cookies.uid) {
    //   console.log("No UID cookie found or parsed.");
    //   return res.status(401).json({ error: "Unauthorized: Please log in." });
    // }
  
    // const userUid = req.cookies.uid;
    // const user = await getUser(userUid);
  
    // if (!user) {
    //   console.log("No user found for this UID:", userUid);
    //   return res.status(401).json({ error: "Unauthorized: Invalid UID." });
    // }

const auth = req.headers['authorization'];
if(!auth){
  return res.status(400).json({
    message: 'unauthorized, JWT token require'
  });

  try {
    const decoded = jwt.verify(auth, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      message: 'unauthorized, jwt token wrong or expired'
    });
  }
}
  }

  module.exports = {
    restrictToUser,
  };
  
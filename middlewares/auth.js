async function restrictToUser(req, res, next) {
    console.log("Headers received:", req.headers);
    console.log("Raw Cookie Header:", req.headers.cookie); 
    console.log("Parsed Cookies:", req.cookies); 
  
    if (!req.cookies || !req.cookies.uid) {
      console.log("No UID cookie found or parsed.");
      return res.status(401).json({ error: "Unauthorized: Please log in." });
    }
  
    const userUid = req.cookies.uid;
    const user = await getUser(userUid);
  
    if (!user) {
      console.log("No user found for this UID:", userUid);
      return res.status(401).json({ error: "Unauthorized: Invalid UID." });
    }
  
    req.user = user;
    next();
  }

  module.exports = {
    restrictToUser,
  };
  
const jwt = require("jsonwebtoken");

async function restrictToUser(req, res, next) {
  console.log("Headers received:", req.headers);
  console.log("Raw Cookie Header:", req.headers.cookie);
  console.log("Parsed Cookies:", req.cookies);
  const auth = req.headers["authorization"];
  if (!auth) {
    return res.status(400).json({
      message: "unauthorized, JWT token require",
    });

    try {
      const decoded = jwt.verify(auth, process.env.SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({
        message: "unauthorized, jwt token wrong or expired",
      });
    }
  }
}

module.exports = {
  restrictToUser,
};

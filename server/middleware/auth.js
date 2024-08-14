const jwt = require("jsonwebtoken");
let token;
const verifyToken = async (req, res, next) => {
  token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized User, please login.",
    });
  }
  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) {
      return res.status(403).json({
        message: "Token is not valid.",
      });
    } else {
      req.userId = payload.id;
      next();
    }
  });
};

const verifyAdmin = async (req, res, next) => {
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  try {
    if (decoded.role === "admin") {
      next();
    } else {
      return res.status(400).json({
        message: "Access denied, Admin only.",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { verifyToken, verifyAdmin };

const jwt = require("jsonwebtoken");
const verifyToken = async (req, res, next) => {
  const token = req.cookies.accessToken;
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

module.exports = { verifyToken };

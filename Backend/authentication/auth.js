const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/users.model");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

async function auth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log("Token not provided in the request.");
    return res.status(401).send({ msg: "Please Login" }); // Sending status code 401 for unauthorized access.
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.log("JWT verification failed:", err.message);
      return res.status(401).send({ msg: "Please Login" }); // Sending status code 401 for unauthorized access.
    }

    // If token contains userType and its value is "admin"
    if (decoded && decoded.userType === "admin") {
      req.userType = "admin";
      return next();
    }

    // If token contains userId
    if (decoded && decoded.userId) {
      const user = await UserModel.findById(decoded.userId);

      if (!user) {
        return res.status(401).send({ msg: "User not found. Please Login" }); // Sending status code 401 for unauthorized access.
      }

      req.userId = decoded.userId;
      req.userType = user.type; // userType from the database (buyer, seller, etc.)
      next();
    } else {
      console.log("Token is valid, but decoding failed.");
      res.status(401).send({ msg: "Please Login" }); // Sending status code 401 for unauthorized access.
    }
  });
}

module.exports = { auth };

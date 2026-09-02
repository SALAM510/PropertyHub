const jwt = require("jsonwebtoken");
const User = require("../models/user");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).send("No token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).send("User not found");
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(error);

    res.status(401).send("Unauthorized");
  }
};

module.exports = isAuthenticated;

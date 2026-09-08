const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send("Unauthorized");
  }

  if (req.user.role !== "admin") {
    return res.status(403).send("Admin access only");
  }

  next();
};

module.exports = adminOnly;

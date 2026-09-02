const adminOnly = (req, res, next) => {

  if (req.user.role !== "admin") {
    return res.status(403).send("Admin access only");
  }

  if (req.user.email !== process.env.ADMIN_EMAIL) {
    return res.status(403).send("Admin access only");
  }

  next();
};

module.exports = adminOnly;
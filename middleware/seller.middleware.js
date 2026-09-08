const sellerOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send("Unauthorized");
  }

  if (req.user.role !== "seller" && req.user.role !== "admin") {
    return res.status(403).send("Seller access only");
  }

  next();
};

module.exports = sellerOnly;

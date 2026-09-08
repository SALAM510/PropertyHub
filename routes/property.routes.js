const express = require("express");
const router = express.Router();
const { createProperty, getProperties, getBuyProperties, getRentProperties, searchProperties, getProperty, getMyProperties, updateProperty, deleteProperty, getPropertyById} = require("../controller/property.controller");
const isAuthenticated = require("../middleware/auth.middleware");
const sellerOnly = require("../middleware/seller.middleware");
const upload = require("../middleware/upload.middleware");

router.post("/", isAuthenticated, sellerOnly, upload.array("images", 6), createProperty);
router.get("/", getProperties);
router.get("/buy", getBuyProperties);
router.get("/rent", getRentProperties);
router.get("/search", searchProperties);
router.get("/my-properties", isAuthenticated, sellerOnly, getMyProperties);
router.get("/details/:id", getPropertyById);
router.get("/:id", getProperty);
router.put("/:id", isAuthenticated, sellerOnly, updateProperty);
router.delete("/:id", isAuthenticated, sellerOnly, deleteProperty);

module.exports = router;

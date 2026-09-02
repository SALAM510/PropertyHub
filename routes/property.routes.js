const express = require("express");
const router = express.Router();
const { createProperty, getProperties, getBuyProperties, getRentProperties, getProperty, getMyProperties, updateProperty, deleteProperty, getPropertyById} = require("../controller/property.controller");
const isAuthenticated = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.post("/", isAuthenticated, upload.array("images", 6), createProperty);
router.get("/", getProperties);
router.get("/buy", getBuyProperties);
router.get("/rent", getRentProperties);
router.get("/my-properties", isAuthenticated, getMyProperties);
router.get("/details/:id", getPropertyById);
router.get("/:id", getProperty);
router.put("/:id", isAuthenticated, updateProperty);
router.delete("/:id", isAuthenticated, deleteProperty);

module.exports = router;
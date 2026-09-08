const express = require("express");
const {Register, Login, getProfile, updateUser, verifyOtp} = require("../controller/auth.controller");
const isAuthenticated = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/profile", isAuthenticated, getProfile);
router.put("/user/:id", isAuthenticated, updateUser);
router.post("/verifyotp", verifyOtp);

module.exports = router;

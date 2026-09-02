const express = require("express");
const router = express.Router();
const {createInquiry, getMyInquiries, getPropertyInquiries, deleteInquiry} = require("../controller/inquiry.controller");
const isAuthenticated = require("../middleware/auth.middleware");

router.post("/", isAuthenticated, createInquiry);
router.get("/", isAuthenticated, getMyInquiries);
router.get("/property/:id", isAuthenticated, getPropertyInquiries);
router.delete("/:id", isAuthenticated, deleteInquiry);

module.exports = router;
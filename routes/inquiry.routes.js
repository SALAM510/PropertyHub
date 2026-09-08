const express = require("express");
const router = express.Router();
const {createInquiry, getMyInquiries, getSellerInquiries, getPropertyInquiries, deleteInquiry} = require("../controller/inquiry.controller");
const isAuthenticated = require("../middleware/auth.middleware");
const sellerOnly = require("../middleware/seller.middleware");

router.post("/", isAuthenticated, createInquiry);
router.get("/", isAuthenticated, getMyInquiries);
router.get("/seller", isAuthenticated, sellerOnly, getSellerInquiries);
router.get("/property/:id", isAuthenticated, sellerOnly, getPropertyInquiries);
router.delete("/:id", isAuthenticated, deleteInquiry);

module.exports = router;

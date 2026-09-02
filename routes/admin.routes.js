const express = require("express");
const router = express.Router();
const {getPendingProperties, approveProperty, rejectProperty, getUsers, changeUserStatus, deleteUser} = require("../controller/admin.controller");
const isAuthenticated = require("../middleware/auth.middleware");
const adminOnly = require("../middleware/admin.middleware");

router.get("/properties/pending", isAuthenticated, adminOnly, getPendingProperties);
router.put("/properties/:id/approve", isAuthenticated, adminOnly, approveProperty);
router.put("/properties/:id/reject", isAuthenticated, adminOnly, rejectProperty);
router.get("/users", isAuthenticated, adminOnly, getUsers);
router.put("/users/:id/status", isAuthenticated, adminOnly, changeUserStatus);
router.delete("/users/:id", isAuthenticated, adminOnly, deleteUser);

module.exports = router;

const express = require("express");
const router = express.Router();
const {addFavorite, getFavorite, removeFavorite} = require("../controller/favorite.controller");
const isAuthenticated = require("../middleware/auth.middleware");

router.post("/", isAuthenticated, addFavorite);
router.get("/", isAuthenticated, getFavorite);
router.delete("/:id", isAuthenticated, removeFavorite);

module.exports = router;

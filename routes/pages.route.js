const { HomePage, AboutPage, ContactPage, LoginPage, PostPropertiesPage, RegisterPage, ProfilePage, PropertiesPage, VerifyOtpPage, PropertiesDetailsPage, AdminPage, UpdatePropertyPage, MyPropertiesPage, FavoritesPage, MyInquiriesPage} = require("../controller/pages.controller");
const isAuthenticated = require("../middleware/auth.middleware");const adminOnly = require("../middleware/admin.middleware");
const express = require("express");
const route = express.Router();

route.get("/", HomePage);
route.get("/about", AboutPage);
route.get("/contact", ContactPage);
route.get("/login", LoginPage);
route.get("/post-properties", PostPropertiesPage);
route.get("/register", RegisterPage);
route.get("/profile", ProfilePage);
route.get("/properties", PropertiesPage);
route.get("/verifyotp", VerifyOtpPage);
route.get("/properties-details/:id", PropertiesDetailsPage);
route.get("/admin-dashboard", (req, res) => {
  res.render("pages/admin-dashboard");
});
route.get("/update-property/:id", UpdatePropertyPage);
route.get("/my-properties", MyPropertiesPage);
route.get("/my-inquiries", MyInquiriesPage);
route.get("/favorites", FavoritesPage);

module.exports = route;

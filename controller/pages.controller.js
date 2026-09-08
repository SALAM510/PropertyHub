const Property = require("../models/property");
const User = require("../models/user");
const isAuthenticated = require("../middleware/auth.middleware");

const HomePage = (req, res) => {
  res.render("pages/home");
};

const AboutPage = (req, res) => {
  res.render("pages/about");
};

const ContactPage = (req, res) => {
  res.render("pages/contact");
};

const LoginPage = (req, res) => {
  res.render("pages/login");
};

const PostPropertiesPage = (req, res) => {
  res.render("pages/post-properties");
};

const RegisterPage = (req, res) => {
  res.render("pages/register", {
    name: "",
    email: "",
    phone: "",
    role: "",
    error: "",
  });
};

const ProfilePage = (req, res) => {
  res.render("pages/profile");
};

const PropertiesPage = async (req, res) => {
  try {
    const properties = await Property.find({
      status: "approved",
    });

    res.render("pages/properties", {
      properties: properties,
      isSearch: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Unable to load properties");
  }
};

const VerifyOtpPage = (req, res) => {
  const { email } = req.query;

  res.render("pages/verify-otp", {
    email: email,
  });
};

const PropertiesDetailsPage = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).send("Property not found");
    }

    res.render("pages/property-details", {
      property: property,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send("Unable to load property");
  }
};

const AdminPage = (req, res) => {
  res.render("pages/admin");
};

const MyPropertiesPage = (req, res) => {
  res.render("pages/my-properties");
};

const MyInquiriesPage = (req, res) => {
  res.render("pages/my-inquiries");
};

const FavoritesPage = (req, res) => {
  res.render("pages/favorites");
};

const UpdatePropertyPage = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).send("Property not found");
    }

    res.render("pages/update-property", {
      property: property,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send("Unable to load update page");
  }
};

module.exports = {HomePage, AboutPage, ContactPage, LoginPage, PostPropertiesPage, RegisterPage, ProfilePage, PropertiesPage, VerifyOtpPage, PropertiesDetailsPage, AdminPage, MyPropertiesPage, MyInquiriesPage, FavoritesPage, UpdatePropertyPage};

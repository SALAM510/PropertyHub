const Property = require("../models/property");
const User = require("../models/user");
const cloudinary = require("../config/cloudinary");
const sendMail = require("../service/nodemailer");

const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      address,
      city,
      state,
      zipcode,
      whatsapp,
      listingType,
      propertyType,
      bedrooms,
      bathrooms,
      squarefootage,
    } = req.body;

    if (
      !title ||
      !description ||
      !price ||
      !address ||
      !city ||
      !state ||
      !zipcode ||
      !whatsapp ||
      !listingType ||
      !propertyType ||
      !bedrooms ||
      !bathrooms ||
      !squarefootage
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!req.files || req.files.length !== 6) {
      return res.status(400).json({
        message: "Please upload exactly 6 property images",
      });
    }

    req.files.reverse();

    const imageUrls = [];

    for (const file of req.files) {
      const base64 = file.buffer.toString("base64");
      const dataUri = `data:${file.mimetype};base64,${base64}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "propertyhub/properties",
      });

      imageUrls.push(result.secure_url);
    }

    const newProperty = new Property({
      title,
      description,
      price,
      address,
      city,
      state,
      zipcode,
      whatsapp,
      listingType,
      propertyType,
      bedrooms,
      bathrooms,
      squarefootage,
      images: imageUrls,
      status: "pending",
      postedBy: req.user._id,
    });

    await newProperty.save();

    await sendMail({
      to: req.user.email,
      subject: "Property Added Successfully",
      text: `Hello ${req.user.name}, your property "${title}" has been added successfully and is waiting for admin approval.`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #f5f7fb; padding: 40px 20px;">
          <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 35px;">
            <h2 style="color: #1e3a8a; text-align: center; margin-bottom: 25px;">
              Property Added Successfully
            </h2>
            <p style="color: #333; font-size: 15px;">
              Hello ${req.user.name},
            </p>
            <p style="color: #555; font-size: 15px; line-height: 1.6;">
              Your property
              <strong style="color: #1e3a8a;">${title}</strong>
              has been added successfully and is currently waiting
              for admin approval.
            </p>
            <p style="color: #555; font-size: 15px; line-height: 1.6;">
              You will be notified once your property has been reviewed
              and approved by the administrator.
            </p>
            <p style="color: #555; font-size: 15px; margin-top: 25px;">
              Thank you for using
              <strong style="color: #1e3a8a;">PropertyHub</strong>.
            </p>
          </div>
        </div>
      `,
    });

    return res.status(201).json({
      message: "Property posted successfully. Waiting for admin approval.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to post property",
    });
  }
};

const getProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      status: "approved",
    });

    return res.render("pages/properties", {
      properties,
      isSearch: false,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send("Failed to fetch properties");
  }
};

const getBuyProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      status: "approved",
      listingType: "For Sale",
    });

    return res.render("pages/properties", {
      properties,
      isSearch: false,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send("Failed to fetch properties");
  }
};

const getRentProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      status: "approved",
      listingType: "For Rent",
    });

    return res.render("pages/properties", {
      properties,
      isSearch: false,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send("Failed to fetch properties");
  }
};

const searchProperties = async (req, res) => {
  try {
    const { listingType, location, propertyType, minPrice, maxPrice } =
      req.query;

    const filter = {
      status: "approved",
    };

    if (listingType) {
      filter.listingType = listingType;
    }

    let properties = await Property.find(filter);

    if (location) {
      properties = properties.filter(function (property) {
        return (
          property.city.toLowerCase() === location.toLowerCase() ||
          property.state.toLowerCase() === location.toLowerCase()
        );
      });
    }

    if (propertyType) {
      properties = properties.filter(function (property) {
        return (
          property.propertyType.toLowerCase() === propertyType.toLowerCase()
        );
      });
    }

    if (minPrice) {
      properties = properties.filter(function (property) {
        return property.price >= Number(minPrice);
      });
    }

    if (maxPrice) {
      properties = properties.filter(function (property) {
        return property.price <= Number(maxPrice);
      });
    }

    return res.render("pages/properties", {
      properties: properties,
      isSearch: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send("Failed to search properties");
  }
};

const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      postedBy: req.user._id,
    });

    return res.status(200).json({
      message: "Properties fetched successfully",
      properties: properties,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to fetch properties",
    });
  }
};

const getProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).send("Property not found");
    }

    const owner = await User.findById(property.postedBy);

    return res.render("pages/property-details", {
      property: property,
      owner: owner,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).send("Failed to fetch property");
  }
};

const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      price,
      address,
      city,
      state,
      zipcode,
      whatsapp,
      listingType,
      propertyType,
      bedrooms,
      bathrooms,
      squarefootage,
    } = req.body;

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).send("Property not found");
    }

    if (property.postedBy.toString() === req.user._id.toString()) {
      property.title = title;
      property.description = description;
      property.price = price;
      property.address = address;
      property.city = city;
      property.state = state;
      property.zipcode = zipcode;
      property.whatsapp = whatsapp;
      property.listingType = listingType;
      property.propertyType = propertyType;
      property.bedrooms = bedrooms;
      property.bathrooms = bathrooms;
      property.squarefootage = squarefootage;

      await property.save();

      return res.status(200).json({
        message: "Property updated successfully",
        property: property,
      });
    } else {
      return res
        .status(403)
        .send("You are not allowed to update this property");
    }
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update property",
      error: error.message,
    });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).send("Property not found");
    }

    if (
      req.user.role !== "admin" &&
      property.postedBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .send("You are not allowed to delete this property");
    }

    await Property.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete property",
      error: error.message,
    });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    return res.status(200).json({
      property: property,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch property",
    });
  }
};

module.exports = {createProperty, getProperties, getBuyProperties, getRentProperties, searchProperties, getMyProperties, getProperty, updateProperty, deleteProperty, getPropertyById};

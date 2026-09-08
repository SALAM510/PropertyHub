const Inquiry = require("../models/inquiry");
const Property = require("../models/property");
const User = require("../models/user");

const createInquiry = async (req, res) => {
  try {
    const { propertyId, message } = req.body;

    if (req.user.role !== "buyer") {
      return res.status(403).json({
        message: "Only buyers can send inquiries",
      });
    }

    if (!propertyId || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    if (property.status !== "approved") {
      return res.status(400).json({
        message: "This property is not available",
      });
    }

    if (property.postedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot send an inquiry to your own property",
      });
    }

    const inquiry = new Inquiry({
      property: propertyId,
      buyer: req.user._id,
      seller: property.postedBy,
      message: message,
    });

    await inquiry.save();

    return res.status(201).json({
      message: "Inquiry sent successfully",
      inquiry: inquiry,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to send inquiry",
    });
  }
};

const getMyInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({
      buyer: req.user._id,
    }).sort({ createdAt: -1 });

    if (inquiries.length === 0) {
      return res.status(200).json({
        message: "No inquiries found",
        inquiries: [],
      });
    }

    const inquiryData = [];

    for (const inquiry of inquiries) {
      const property = await Property.findById(inquiry.property);
      const seller = await User.findById(inquiry.seller);

      inquiryData.push({
        _id: inquiry._id,
        property: property,
        sellerName: seller ? seller.name : "Unknown",
        sellerEmail: seller ? seller.email : "Unknown",
        sellerPhone: seller ? seller.phone : "Unknown",
        message: inquiry.message,
        status: inquiry.status,
        createdAt: inquiry.createdAt,
      });
    }

    return res.status(200).json({
      message: "Inquiries fetched successfully",
      inquiries: inquiryData,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to fetch inquiries",
    });
  }
};

const getSellerInquiries = async (req, res) => {
  try {
    if (req.user.role !== "seller" && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only sellers and admins can view inquiries",
      });
    }

    let inquiries;

    if (req.user.role === "admin") {
      inquiries = await Inquiry.find().sort({ createdAt: -1 });
    } else {
      inquiries = await Inquiry.find({
        seller: req.user._id,
      }).sort({ createdAt: -1 });
    }

    if (inquiries.length === 0) {
      return res.status(200).json({
        message: "No inquiries found",
        inquiries: [],
      });
    }

    const inquiryData = [];

    for (const inquiry of inquiries) {
      const property = await Property.findById(inquiry.property);
      const buyer = await User.findById(inquiry.buyer);

      inquiryData.push({
        _id: inquiry._id,
        property: property,
        buyerName: buyer ? buyer.name : "Unknown",
        buyerEmail: buyer ? buyer.email : "Unknown",
        buyerPhone: buyer ? buyer.phone : "Unknown",
        message: inquiry.message,
        status: inquiry.status,
        createdAt: inquiry.createdAt,
      });
    }

    return res.status(200).json({
      message: "Inquiries fetched successfully",
      inquiries: inquiryData,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to fetch inquiries",
    });
  }
};

const getPropertyInquiries = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "seller" && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only sellers and admins can view property inquiries",
      });
    }

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      property.postedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to view these inquiries",
      });
    }

    const inquiries = await Inquiry.find({
      property: id,
    }).sort({ createdAt: -1 });

    const inquiryData = [];

    for (const inquiry of inquiries) {
      const buyer = await User.findById(inquiry.buyer);

      inquiryData.push({
        _id: inquiry._id,
        property: inquiry.property,
        buyer: inquiry.buyer,
        seller: inquiry.seller,
        message: inquiry.message,
        status: inquiry.status,
        createdAt: inquiry.createdAt,
        buyerName: buyer ? buyer.name : "Unknown",
        buyerEmail: buyer ? buyer.email : "Unknown",
        buyerPhone: buyer ? buyer.phone : "Unknown",
      });
    }

    return res.status(200).json({
      message: "Property inquiries fetched successfully",
      inquiries: inquiryData,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to fetch property inquiries",
    });
  }
};

const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        message: "Inquiry not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      inquiry.buyer.toString() !== req.user._id.toString() &&
      inquiry.seller.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to delete this inquiry",
      });
    }

    await Inquiry.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to delete inquiry",
    });
  }
};

module.exports = {createInquiry, getMyInquiries, getSellerInquiries, getPropertyInquiries, deleteInquiry};

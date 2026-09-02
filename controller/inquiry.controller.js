const Inquiry = require("../models/inquiry");
const Property = require("../models/property");

const createInquiry = async (req, res) => {
  try {
    const { propertyId, email, whatsapp, message } = req.body;

    if (!propertyId || !email || !whatsapp || !message) {
      return res.status(400).json({
        message: "Email, WhatsApp number and message are required",
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
      user: req.user._id,
      email: email,
      whatsapp: whatsapp,
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
      user: req.user._id,
    }).sort({ createdAt: -1 });

    if (inquiries.length === 0) {
      return res.status(404).json({
        message: "No inquiry found",
      });
    }

    return res.status(200).json({
      message: "Inquiries fetched successfully",
      inquiries: inquiries,
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
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    if (property.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to view these inquiries",
      });
    }

    const inquiries = await Inquiry.find({
      property: propertyId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Property inquiries fetched successfully",
      inquiries: inquiries,
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

module.exports = {createInquiry, getMyInquiries, getPropertyInquiries, deleteInquiry};

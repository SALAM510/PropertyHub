const mongoose = require("mongoose");
const inquirySchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    whatsapp: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  },
);

const Inquiry = mongoose.model("Inquiry", inquirySchema);
module.exports = Inquiry;

  const mongoose = require("mongoose");
  const propertySchema = new mongoose.Schema(
    {
      images: {
        type: [String],
        required: true,
      },

      title: {
        type: String,
        required: true,
      },

      description: {
        type: String,
        required: true,
      },

      price: {
        type: Number,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      zipcode: {
        type: String,
        required: true,
      },

      whatsapp: {
        type: String,
        required: true,
      },

      listingType: {
        type: String,
        enum: ["buy", "rent"],
        required: true,
      },

      propertyType: {
        type: String,
        required: true,
      },

      bedrooms: {
        type: Number,
        required: true,
      },

      bathrooms: {
        type: Number,
        required: true,
      },

      squarefootage: {
        type: Number,
        required: true,
      },

      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
    },
    { timestamps: true },
  );

  const Property = mongoose.model("Property", propertySchema);
  module.exports = Property;
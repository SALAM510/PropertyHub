const User = require("../models/user");
const Property = require("../models/property");

const getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      status: "pending",
    });

    if (properties.length === 0) {
      return res.status(404).json({
        message: "No properties found",
      });
    }

    res.status(200).json({
      message: "Pending properties fetched successfully",
      properties,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch pending properties",
      error: error.message,
    });
  }
};

const approveProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      {
        status: "approved",
      },
      {
        new: true,
      },
    );

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    res.status(200).json({
      message: "Property approved successfully",
      property,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to approve property",
      error: error.message,
    });
  }
};

const rejectProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      {
        status: "rejected",
      },
      {
        new: true,
      },
    );

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    res.status(200).json({
      message: "Property rejected successfully",
      property,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to reject property",
      error: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    if (users.length === 0) {
      return res.status(404).json({
        message: "No users found",
      });
    }

    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

const changeUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isActive) {
      user.isActive = false;
    } else {
      user.isActive = true;
    }

    await user.save();

    let message;

    if (user.isActive) {
      message = "User activated successfully";
    } else {
      message = "User deactivated successfully";
    }

    res.status(200).json({
      message: message,
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user status",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {getPendingProperties, approveProperty, rejectProperty, getUsers, changeUserStatus, deleteUser};

const Favorite = require("../models/favorite");
const Property = require("../models/property");

const addFavorite = async (req, res) => {
    try {
        const { propertyId } = req.body;

        if (!propertyId) {
            return res.status(400).json({
                message: "Property Id is required"
            });
        }

        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({
                message: "Property not found"
            });
        }

        if (property.status !== "approved") {
            return res.status(400).json({
                message: "This property is not available"
            });
        }

        if (property.postedBy.toString() === req.user._id.toString()) {
            return res.status(400).json({
                message: "You cannot favorite your own property"
            });
        }

        const existingFavorite = await Favorite.findOne({
            user: req.user._id,
            property: propertyId
        });

        if (existingFavorite) {
            return res.status(400).json({
                message: "Property already added to favorites"
            });
        }

        const favorite = new Favorite({
            user: req.user._id,
            property: propertyId
        });

        await favorite.save();

        return res.status(201).json({
            message: "Property added to favorites",
            favorite
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to add property to favorite",
            error: error.message
        });
    }
};

const getFavorite = async (req, res) => {
  try {
    const favorites = await Favorite.find({
      user: req.user._id,
    });

    if (favorites.length === 0) {
      return res.status(200).json({
        message: "No favorites found",
        favorites: [],
      });
    }

    const favoriteData = [];

    for (const favorite of favorites) {
      const property = await Property.findById(favorite.property);

      if (property) {
        favoriteData.push({
          _id: favorite._id,
          property: property,
        });
      }
    }

    return res.status(200).json({
      message: "Favorites fetched successfully",
      favorites: favoriteData,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch favorites",
      error: error.message,
    });
  }
};

const removeFavorite = async (req, res) => {
    try {
        const { id } = req.params;

        const favorite = await Favorite.findById(id);

        if (!favorite) {
            return res.status(404).json({
                message: "Favorite not found"
            });
        }

        if (favorite.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You cannot remove this favorite"
            });
        }

        await Favorite.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Property removed from favorites"
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to remove favorite",
            error: error.message
        });
    }
};

module.exports = {addFavorite, getFavorite, removeFavorite};

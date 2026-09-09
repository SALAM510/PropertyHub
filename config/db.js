const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const MONGODB = process.env.MONGODB_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.error("DATABASE CONNECTION ERROR:", error);
    console.error(error);
  }
};

module.exports = connectDB;

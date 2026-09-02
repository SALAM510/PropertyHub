const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./config/db");
const morgan = require("morgan");
const adminRoute = require("./routes/admin.routes");
const authRoute = require("./routes/auth.routes");
const propertyRoute = require("./routes/property.routes");
const favoriteRoute = require("./routes/favorite.routes");
const inquiryRoute = require("./routes/inquiry.routes");
const pagesRoute = require("./routes/pages.route");

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.set("view engine", "ejs");

app.use(express.static("public"));

app.use("/", pagesRoute);
app.use("/admin", adminRoute);
app.use("/auth", authRoute);
app.use("/properties", propertyRoute);
app.use("/favorite", favoriteRoute);
app.use("/inquiry", inquiryRoute);

const PORT = process.env.PORT;

connectDB();
app.listen(PORT, () => {
  console.log(`server Running at ${PORT}`);
});

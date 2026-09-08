const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const sendMail = require("../service/nodemailer");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

async function Register(req, res) {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password || !role) {
      return res.status(403).render("pages/register", {
        name: name || "",
        email: email || "",
        phone: phone || "",
        role: role || "",
        error: "All fields are required",
      });
    }

    if (role !== "buyer" && role !== "seller") {
      return res.status(403).render("pages/register", {
        name: name || "",
        email: email || "",
        phone: phone || "",
        role: role || "",
        error: "Please select whether you are a buyer or seller",
      });
    }

    if (password.length < 6) {
      return res.status(403).render("pages/register", {
        name: name || "",
        email: email || "",
        phone: phone || "",
        role: role || "",
        error: "Password must be at least 6 characters",
      });
    }

    const isUser = await User.findOne({
      email: email,
    });

    if (isUser) {
      return res.status(403).render("pages/register", {
        error: "Email already exists",
        name: name || "",
        email: email || "",
        phone: phone || "",
        role: role || "",
      });
    }

    const isPhone = await User.findOne({
      phone: phone,
    });

    if (isPhone) {
      return res.status(403).render("pages/register", {
        error: "Phone number already exists",
        name: name || "",
        email: email || "",
        phone: phone || "",
        role: role || "",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000);

    const newUser = new User({
      name: name,
      email: email,
      phone: phone,
      password: hashedPassword,
      otp: otp,
      role: role,
    });

    await newUser.save();

    await sendMail({
      to: email,
      subject: "Welcome to PropertyHub",
      text: `Hello ${name}, welcome to PropertyHub. Your account has been created successfully.`,
      html: `
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 40px 20px; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 3px 10px rgba(0,0,0,0.08);">
            <div style="background-color: #1e3a8a; padding: 25px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">
                PropertyHub
              </h1>
              <p style="color: #dbeafe; margin: 8px 0 0;">
                Find a place you'll love
              </p>
            </div>
            <div style="padding: 35px;">
              <h2 style="color: #222; margin-top: 0;">
                Welcome, ${name}!
              </h2>
              <p style="color: #555;">
                Thank you for creating your PropertyHub account.
                We're happy to have you with us.
              </p>
              <p style="color: #555;">
                To complete your registration, please use the
                verification code below:
              </p>
              <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
                <p style="margin: 0 0 8px; color: #555;">
                  Your verification code
                </p>
                <h1 style="margin: 0; color: #1e3a8a; letter-spacing: 8px; font-size: 32px;">
                  ${otp}
                </h1>
              </div>
              <p style="color: #777; font-size: 14px; line-height: 1.5;">
                If you did not create this account, you can
                safely ignore this email.
              </p>
              <p style="color: #555; margin-top: 30px;">
                Welcome to PropertyHub.
              </p>
            </div>
            <div style="background-color: #f8fafc; padding: 20px; text-align: center;">
              <p style="color: #888; font-size: 12px; margin: 0;">
                &copy; 2026 PropertyHub. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    res.redirect(`/verifyotp?email=${encodeURIComponent(email)}`);
  } catch (error) {
    console.error(error);

    res.status(500).render("pages/register", {
      error: "Something went wrong. Please try again.",
      name: req.body.name || "",
      email: req.body.email || "",
      phone: req.body.phone || "",
      role: req.body.role || "",
    });
  }
}

async function Login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        message: "Email and password are required",
      });
    }

    const isUser = await User.findOne({
      email: email,
    });

    if (!isUser) {
      return res.status(404).json({
        message: "No account found with this email.",
      });
    }

    if (!isUser.verified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    if (isUser.isActive === false) {
      return res.status(403).json({
        message: "Your account has been deactivated",
      });
    }

    const comparePassword = await bcrypt.compare(password, isUser.password);

    if (!comparePassword) {
      return res.status(403).json({
        message: "Incorrect Password",
      });
    }

    const token = jwt.sign(
      {
        id: isUser.id,
        role: isUser.role,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      message: "Login Successfully",
      token: token,
      name: isUser.name,
      role: isUser.role,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

async function AdminLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        message: "Email and password are required",
      });
    }

    if (
      email !== process.env.ADMIN_LOGIN ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(403).json({
        message: "Incorrect email or password",
      });
    }

    const token = jwt.sign(
      {
        role: "admin",
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return res.status(200).json({
      message: "Admin login successful",
      token: token,
      role: "admin",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function getProfile(req, res) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      user: user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;

    if (!id) {
      return res.status(400).send("User ID is required");
    }

    const updateuser = await User.findByIdAndUpdate(
      id,
      {
        name: name,
        phone: phone,
      },
      {
        new: true,
      },
    );

    if (!updateuser) {
      return res.status(404).send("User Not Found");
    }

    res.status(200).json({
      message: "User updated successfully",
      updateuser: updateuser,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

async function verifyOtp(req, res) {
  try {
    const { otp, email } = req.body;

    if (!otp || !email) {
      return res.status(403).render("pages/verify-otp", {
        email: email || "",
        error: "Email and OTP are required",
      });
    }

    const findUser = await User.findOne({
      email: email,
    });

    if (!findUser) {
      return res.status(404).render("pages/verify-otp", {
        email: email,
        error: "User not found",
      });
    }

    if (Number(otp) !== findUser.otp) {
      return res.status(403).render("pages/verify-otp", {
        email: email,
        error: "Invalid OTP. Please enter the correct OTP.",
      });
    }

    findUser.verified = true;

    await findUser.save();

    res.redirect("/login");
  } catch (error) {
    console.error(error);

    res.status(500).render("pages/verify-otp", {
      email: req.body.email || "",
      error: "Something went wrong. Please try again.",
    });
  }
}

module.exports = {Register, Login, AdminLogin, getProfile, updateUser, verifyOtp};

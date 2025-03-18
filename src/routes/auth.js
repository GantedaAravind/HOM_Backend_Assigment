const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/user");

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET;
const TOKEN_EXPIRY = "1h"; // Token expiration time

// Utility function for error handling
const handleErrors = (res, message, status = 400) => {
  return res.status(status).json({ message });
};

// Register User
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Input validation using validator.js
    if (!username || !validator.isLength(username, { min: 3 })) {
      return handleErrors(res, "Username must be at least 3 characters long");
    }
    if (!email || !validator.isEmail(email)) {
      return handleErrors(res, "Invalid email format");
    }
    if (!password || !validator.isLength(password, { min: 6 })) {
      return handleErrors(res, "Password must be at least 6 characters long");
    }

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) return handleErrors(res, "Email already in use");

    // Secure password hashing
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation using validator.js
    if (!email || !validator.isEmail(email)) {
      return handleErrors(res, "Invalid email format");
    }
    if (!password || validator.isEmpty(password)) {
      return handleErrors(res, "Password is required");
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return handleErrors(res, "Invalid credentials", 401);

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return handleErrors(res, "Invalid credentials", 401);

    // Generate JWT Token
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: TOKEN_EXPIRY,
    });

    // Securely set token in HTTP-only cookie
    res.cookie("auth_token", token, {
      httpOnly: true, // Prevent client-side JS access
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Logout User
router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("auth_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;

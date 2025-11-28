// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ===========================
// REGISTER USER
// POST /api/users/register
// ===========================
router.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 1) Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2) Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3) Create user
    const user = new User({
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await user.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// ===========================
// LOGIN USER
// POST /api/users/login
// ===========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; // only email + password

    // 1) Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2) Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 3) Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 4) Remove password before sending
    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Simple test route
router.get("/", (req, res) => {
  res.json({ message: "User API working!" });
});

module.exports = router;

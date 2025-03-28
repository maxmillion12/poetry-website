const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { signUp, login } = require("../controllers/authController"); // Import both functions

const router = express.Router();

// ✅ User Registration Route
router.post("/register", async (req, res) => {
  try {
    console.log("Received Data:", req.body); // Debugging log

    const { name, email, password } = req.body; // Changed 'username' to 'name'

    // Validate input fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name, // Fixed field name
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error("Error in register route:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Use the signup function from authController
router.post("/signup", signUp);

// ✅ Login Route
router.post("/login", login);

// ✅ Export the router only once!
module.exports = router;

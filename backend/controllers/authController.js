const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { db } = require("../config/database"); // Import Firestore DB

// User Signup ✅
const signUp = async (req, res) => {
  try {
    console.log("Signup Request:", req.body);

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists in Firestore
    const userRef = db.collection("users").doc(email);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in Firestore
    await userRef.set({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    // Generate JWT Token
    const token = jwt.sign(
      { email: email },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "User registered successfully", token });

  } catch (error) {
    console.error("Error in signUp:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// User Login ✅
const login = async (req, res) => {
  try {
    console.log("Login Request:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Get user from Firebase Firestore
    const userRef = db.collection("users").doc(email);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(400).json({ message: "User not found" });
    }

    const userData = userDoc.data();

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { email: userData.email },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "User logged in successfully", token });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signUp, login };

require("dotenv").config(); // Load environment variables

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express(); // ✅ Ensure Express is initialized only once

// ✅ Middleware
app.use(cors());
app.use(express.json()); // ✅ Parse JSON
app.use(express.urlencoded({ extended: true })); // ✅ Support form data

// ✅ Debug Middleware (Logs all requests)
app.use((req, res, next) => {
  console.log(`📢 ${req.method} request to ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("📩 Request Body:", req.body);
  }
  next();
});

// ✅ Import Firebase Admin SDK (Backend Use)
const admin = require("firebase-admin");

// ✅ Initialize Firebase Admin (Check if already initialized)
if (!admin.apps.length) {
  const serviceAccount = require("./serviceAccountKey.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("🔥 Firebase Admin Initialized");
}

const db = admin.firestore();

// ✅ Serve Static Frontend Files
app.use(express.static(path.join(__dirname, "frontend")));

// ✅ API Route to Fetch Famous Poems JSON
app.get("/api/famous-poems", (req, res) => {
  const filePath = path.join(__dirname, "frontend/famous_poems.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("❌ Error reading famous_poems.json:", err);
      return res.status(500).json({ error: "Error loading poems" });
    }
    res.json(JSON.parse(data)); // ✅ Send JSON response
  });
});

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const poetryRoutes = require("./routes/poetryRoutes");
const userRoutes = require("./routes/userRoutes");

// ✅ Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/poetry", poetryRoutes);
app.use("/api/users", userRoutes);

console.log("✅ Routes loaded!");

// ✅ Poetry Submission Route (for Feathers of Poetry)
app.post("/api/submitPoem", async (req, res) => {
  try {
    const { title, author, content } = req.body;

    if (!title || !author || !content) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const newPoem = {
      title,
      author,
      content,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("poems").add(newPoem);
    res.status(201).json({ message: "Poem submitted successfully!" });
  } catch (error) {
    console.error("❌ Error submitting poem:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

// ✅ Route to Fetch All Poems
app.get("/api/poems", async (req, res) => {
  try {
    const poemsSnapshot = await db.collection("poems").orderBy("createdAt", "desc").get();
    const poems = poemsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(poems);
  } catch (error) {
    console.error("❌ Error fetching poems:", error);
    res.status(500).json({ error: "Error fetching poems" });
  }
});

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("Welcome to Feathers Of Poetry API! 🚀");
});

// ✅ Final `app.listen()` Call (Only One)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

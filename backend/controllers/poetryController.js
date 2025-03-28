const { db } = require("../config/database"); // Ensure correct Firestore import

// ✅ Get all poems
const getAllPoems = async (req, res) => {
  try {
    const poemsRef = db.collection("poems");
    let query = poemsRef;
    
    // Ensure ordering works only if timestamp exists
    const snapshot = await query.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No poems found" });
    }

    const poems = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort by timestamp (fallback in case some documents lack timestamps)
    poems.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));

    res.status(200).json(poems);
  } catch (error) {
    console.error("❌ Error fetching poems:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Create a new poem
const createPoem = async (req, res) => {
  try {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({ message: "Title, content, and author are required" });
    }

    const newPoem = {
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      timestamp: new Date(),
    };

    const poemRef = await db.collection("poems").add(newPoem);
    res.status(201).json({ id: poemRef.id, ...newPoem });
  } catch (error) {
    console.error("❌ Error creating poem:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get a single poem by ID
const getPoemById = async (req, res) => {
  try {
    const { id } = req.params;
    const poemRef = db.collection("poems").doc(id);
    const poem = await poemRef.get();

    if (!poem.exists) {
      return res.status(404).json({ message: "Poem not found" });
    }

    res.status(200).json({ id: poem.id, ...poem.data() });
  } catch (error) {
    console.error("❌ Error fetching poem:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Delete a poem by ID
const deletePoem = async (req, res) => {
  try {
    const { id } = req.params;
    const poemRef = db.collection("poems").doc(id);

    const poem = await poemRef.get();
    if (!poem.exists) {
      return res.status(404).json({ message: "Poem not found" });
    }

    await poemRef.delete();
    res.status(200).json({ message: "Poem deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting poem:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Update a poem by ID
const updatePoem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title && !content) {
      return res.status(400).json({ message: "At least one field (title or content) must be provided" });
    }

    const poemRef = db.collection("poems").doc(id);
    const poem = await poemRef.get();

    if (!poem.exists) {
      return res.status(404).json({ message: "Poem not found" });
    }

    const updatedPoem = {};
    if (title) updatedPoem.title = title.trim();
    if (content) updatedPoem.content = content.trim();
    updatedPoem.updatedAt = new Date();

    await poemRef.update(updatedPoem);
    res.status(200).json({ message: "Poem updated successfully", updatedPoem });
  } catch (error) {
    console.error("❌ Error updating poem:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Export controllers
module.exports = {
  getAllPoems,
  createPoem,
  getPoemById,
  deletePoem,
  updatePoem,
};

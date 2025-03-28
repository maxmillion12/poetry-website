const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const poetryController = require("../controllers/poetryController");

const { getAllPoems, createPoem, getPoemById, deletePoem, updatePoem } = poetryController;

router.get("/", getAllPoems); // Get all poems
router.post("/add", authMiddleware, createPoem); // Create a new poem (with authentication)
router.get("/:id", getPoemById); // Get a single poem by ID
router.delete("/:id", authMiddleware, deletePoem); // Delete a poem by ID (with authentication)
router.put("/:id", authMiddleware, updatePoem); // Update a poem by ID (with authentication)

// ✅ Export the router
module.exports = router;

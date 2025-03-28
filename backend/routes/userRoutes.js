const express = require("express");
const router = express.Router();
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const {
    getUserProfile,
    getAllUsers,
    updateUserProfile,
    updateUserBanner
} = require("../controllers/userController");

// ✅ Multer Setup for Profile & Banner Uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ✅ Get All Users
router.get("/all", authMiddleware, getAllUsers);

// ✅ Get User Profile
router.get("/profile", authMiddleware, getUserProfile);

// ✅ Update User Profile (Including Profile Picture & Social Links)
router.post("/update", authMiddleware, upload.single("profilePicture"), updateUserProfile);

// ✅ Update User Banner
router.post("/update-banner", authMiddleware, upload.single("bannerImage"), updateUserBanner);

// ✅ Get User Dashboard Data
router.get("/dashboard", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const userRef = db.collection("users").doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: "User not found." });
        }

        const userData = userDoc.data();

        // Fetch User's Poems
        const poemsRef = db.collection("poems").where("authorId", "==", userId);
        const poemsSnapshot = await poemsRef.get();
        const poems = poemsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Mock notifications (Replace with real logic later)
        const notifications = [
            { message: "You have a new comment!" },
            { message: "Your poem got 10 likes!" }
        ];

        res.json({
            username: userData.username,
            bio: userData.bio || "No bio available",
            profilePicture: userData.profilePicture || "default-profile.png",
            bannerImage: userData.bannerImage || "",
            poems,
            notifications
        });
    } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
        res.status(500).json({ error: "Failed to fetch dashboard data." });
    }
});

module.exports = router;

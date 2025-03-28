const { db } = require("../config/database"); // Firestore database
const bucket = require("../config/storage"); // Firebase Storage

// ✅ Get all users
const getAllUsers = async (req, res) => {
    try {
        const usersRef = db.collection("users");
        const snapshot = await usersRef.get();

        if (snapshot.empty) {
            return res.status(404).json({ message: "No users found" });
        }

        const users = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(users);
    } catch (error) {
        console.error("❌ Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users" });
    }
};

// ✅ Get a single user profile by ID
const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params; // User ID from request
        const userRef = db.collection("users").doc(id);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: "User not found" });
        }

        const userData = userDoc.data();

        // Fetch user's poems (assuming "poems" is a separate collection)
        const poemsRef = db.collection("poems").where("authorId", "==", id);
        const poemsSnapshot = await poemsRef.get();
        const poems = poemsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json({ ...userData, poems });
    } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Update User Profile (Profile Picture & Social Links)
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, bio, socialLinks } = req.body;
        let profilePictureUrl = null;

        // Handle Profile Picture Upload
        if (req.file) {
            const file = bucket.file(`profile_pics/${userId}`);
            await file.save(req.file.buffer, {
                metadata: { contentType: req.file.mimetype },
            });
            profilePictureUrl = `https://storage.googleapis.com/${bucket.name}/profile_pics/${userId}`;
        }

        const userRef = db.collection("users").doc(userId);
        const updateData = {
            ...(username && { username }),
            ...(bio && { bio }),
            ...(profilePictureUrl && { profilePicture: profilePictureUrl }),
            ...(socialLinks && {
                socialLinks: {
                    twitter: socialLinks?.twitter || "",
                    instagram: socialLinks?.instagram || "",
                    facebook: socialLinks?.facebook || "",
                }
            })
        };

        await userRef.update(updateData);

        res.json({ success: true, message: "Profile updated successfully!" });
    } catch (error) {
        console.error("❌ Error updating profile:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

// ✅ Update User Banner Image
const updateUserBanner = async (req, res) => {
    try {
        const userId = req.user.id;
        let bannerImageUrl = null;

        // Handle Banner Image Upload
        if (req.file) {
            const file = bucket.file(`banners/${userId}`);
            await file.save(req.file.buffer, {
                metadata: { contentType: req.file.mimetype },
            });
            bannerImageUrl = `https://storage.googleapis.com/${bucket.name}/banners/${userId}`;
        }

        if (!bannerImageUrl) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        const userRef = db.collection("users").doc(userId);
        await userRef.update({ bannerImage: bannerImageUrl });

        res.json({ success: true, message: "Banner updated successfully!" });
    } catch (error) {
        console.error("❌ Error updating banner:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

// ✅ Export Controllers
module.exports = { getAllUsers, getUserProfile, updateUserProfile, updateUserBanner };

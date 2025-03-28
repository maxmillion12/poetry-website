const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "default.jpg" }, // Default profile image
    bio: { type: String, trim: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }, // User roles
    savedPoems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Poetry" }], // Saved poems
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

module.exports = mongoose.model("User", UserSchema);

const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied, no token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use secure env variable
        req.user = decoded; // Attach user data to request
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;

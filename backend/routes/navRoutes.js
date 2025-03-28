const express = require("express");
const path = require("path");
const router = express.Router();

// Serve static HTML pages from the frontend folder
const frontendPath = path.join(__dirname, "../frontend");

router.get("/home", (req, res) => {
    res.sendFile(path.join(frontendPath, "home.html"));
});

router.get("/terms", (req, res) => {
    res.sendFile(path.join(frontendPath, "terms.html"));
});

router.get("/about", (req, res) => {
    res.sendFile(path.join(frontendPath, "about.html"));
});

router.get("/explore", (req, res) => {
    res.sendFile(path.join(frontendPath, "explore.html"));
});

router.get("/community", (req, res) => {
    res.sendFile(path.join(frontendPath, "community.html"));
});

router.get("/help", (req, res) => {
    res.sendFile(path.join(frontendPath, "help.html"));
});

module.exports = router;

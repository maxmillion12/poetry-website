const { initializeApp } = require("firebase/app");
const firebaseConfig = require("./firebaseConfig");

const firebaseApp = initializeApp(firebaseConfig);

console.log("✅ Firebase Client initialized!");

module.exports = firebaseApp;

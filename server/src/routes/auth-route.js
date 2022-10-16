const express = require("express");
const router = express.Router();
// importing user context
const User = require("../models/user");

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

// Register
router.post("/register", (req, res) => {
  try {
    // Get user input
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }
  } catch (error) {
    console.log("🧨 Error: ", error);
  }
});

// Login
router.post("/login", (req, res) => {
  // our login logic goes here
});

module.exports = router;

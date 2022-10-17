const express = require("express");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const router = express.Router();

// importing user context
const User = require("../models/user");
const { TOKEN_KEY } = require("../config/config");

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log("Time: ", Date.now());
  next();
});

// Register
router.post("/register", async (req, res) => {
  try {
    // Get user input
    const { name, email, password } = req.body;

    // Validate user input
    if (!(email && password && name)) {
      res.status(400).send({
        error: "All input is required",
      });
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });
    console.log("email", email, oldUser);

    if (oldUser) {
      return res
        .status(409)
        .json({ error: "User Already Exist. Please Login" });
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      name: name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    const tokenKey = TOKEN_KEY;
    // Create token
    const token = jwt.sign({ user_id: user._id, email }, tokenKey, {
      expiresIn: "2h",
    });
    // save user token
    user.token = token;
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        token: user.token,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("🧨 Error: ", error);
    res.status(500).send("Something went wrong");
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).json({
        error: "Invalid Credentials, please try again",
      });
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email: email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const tokenKey = TOKEN_KEY;
      // Create token
      const token = jwt.sign({ user_id: user._id, email }, tokenKey, {
        expiresIn: "2h",
      });

      // save user token
      user.token = token;

      // user
      res.status(200).send({
        message: "User logged in successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          token: user.token,
          createdAt: user.createdAt,
        },
      });
    } else {
      console.log("🧨 Login Failure: Invalid credentials");
      res.status(400).json({
        error: "Invalid Credentials, please try again",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;

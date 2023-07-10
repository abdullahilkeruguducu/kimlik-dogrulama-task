const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const role = req.body.role;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "This username is already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashedPassword, role: role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user._id }, "secretkey");

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/private", authenticateToken, (req, res) => {
  res.json({ message: "Private endpointine hoş geldiniz!" });
});

router.get("/admin", authenticateToken, (req, res) => {
  if (req.body.role === "admin") {
    res.json({ message: "Admin endpointine hoş geldiniz!" });
  } else {
    res.status(403).json({ error: "Bu endpointe erişim izniniz yok." });
  }
});

router.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: "This is an authorized endpoint." });
});

module.exports = router;

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET = process.env.SECRET || "secret_key";

// Allow CORS from Netlify (replace with your actual Netlify URL)
app.use(cors({ origin: 'https://your-netlify-site.netlify.app' })); // Update this
app.use(bodyParser.json());
app.use(express.static("public"));

// Load users and marks from file
let users = fs.existsSync("users.json") ? JSON.parse(fs.readFileSync("users.json")) : [];
let marks = fs.existsSync("marks.json") ? JSON.parse(fs.readFileSync("marks.json")) : [];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
};

// Signup
app.post("/api/signup", (req, res) => {
  const { admNumber, name, password } = req.body;
  if (users.find(u => u.admNumber === admNumber)) {
    return res.status(400).json({ error: "ADM number already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);
  users.push({ admNumber, name, password: hashedPassword, photo: "" });
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
  res.json({ message: "User registered successfully" });
});

// Login
app.post("/api/login", (req, res) => {
  const { admNumber, password } = req.body;
  const user = users.find(u => u.admNumber === admNumber);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ admNumber: user.admNumber }, SECRET, { expiresIn: "1h" });
  res.json({ message: "Login successful", token });
});

// Get student details + marks
app.get("/api/user/:admNumber", authenticateToken, (req, res) => {
  const admNumber = req.params.admNumber;
  if (req.user.admNumber !== admNumber) {
    return res.status(403).json({ error: "Unauthorized access" });
  }
  const user = users.find(u => u.admNumber === admNumber);
  const userMarks = marks.find(m => m.admNumber === admNumber);

  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({
    name: user.name,
    admNumber: user.admNumber,
    photo: user.photo || "",
    module1: userMarks?.module1 || null,
    module2: userMarks?.module2 || null,
    module3: userMarks?.module3 || null
  });
});

// Admin saving or updating marks
app.post("/api/admin/save-marks", (req, res) => {
  const { admNumber, marks: markObj } = req.body;

  if (!admNumber || !markObj) {
    return res.status(400).json({ error: "ADM number and marks are required" });
  }

  const index = marks.findIndex(m => m.admNumber === admNumber);
  if (index !== -1) {
    marks[index] = { admNumber, ...markObj }; // Update
  } else {
    marks.push({ admNumber, ...markObj }); // New entry
  }

  fs.writeFileSync("marks.json", JSON.stringify(marks, null, 2));
  res.json({ message: "Marks saved successfully" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
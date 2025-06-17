const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET = process.env.SECRET || "secret_key";

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Load users and marks
let users = fs.existsSync("users.json") ? JSON.parse(fs.readFileSync("users.json")) : [];
let marks = fs.existsSync("marks.json") ? JSON.parse(fs.readFileSync("marks.json")) : [];

// Signup
app.post("/api/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: "User already exists" });
  }
  const hashedPassword = bcrypt.hashSync(password, 8);
  users.push({ name, email, password: hashedPassword, photo: "" });
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
  res.json({ message: "User registered successfully" });
});

// Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ email: user.email }, SECRET, { expiresIn: "1h" });
  res.json({ message: "Login successful", token });
});

// Fetch user & results
app.get("/api/user/:email", (req, res) => {
  const email = req.params.email;
  const user = users.find(u => u.email === email);
  const userMarks = marks.find(m => m.email === email);

  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({
    name: user.name,
    email: user.email,
    photo: user.photo || "",
    module1: userMarks?.module1 || null,
    module2: userMarks?.module2 || null,
    module3: userMarks?.module3 || null
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

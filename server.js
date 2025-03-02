const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // Allow requests from your React app
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/finance-tracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Define Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Income', 'Expense'], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

// Models
const User = mongoose.model("User", userSchema);
const Transaction = mongoose.model("Transaction", transactionSchema);

// JWT Secret
const JWT_SECRET = "your-secret-key"; // Replace with environment variable in production

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// ======================== 🛠 AUTH ROUTES ========================

// User Signup
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    console.log("Signup request received:", { username, email }); // Add logging

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    console.log("User saved successfully:", newUser._id);

    // Generate token
    const token = jwt.sign(
      { userId: newUser._id.toString(), username: newUser.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ message: "User created", userId: newUser._id.toString(), username, token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// Add a register endpoint that points to the same handler
app.post("/register", async (req, res) => {
  try {
    const { username, email, password, gender } = req.body;
    
    console.log("Register request received:", { username, email, gender });

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      username, 
      email, 
      password: hashedPassword,
      // Add gender if your schema supports it
    });

    await newUser.save();
    console.log("User registered successfully:", newUser._id);

    // Generate token
    const token = jwt.sign(
      { userId: newUser._id.toString(), username: newUser.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ message: "User created", userId: newUser._id.toString(), username, token });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration", error: error.message });
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: "Login successful", userId: user._id, username: user.username, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// ======================== 📊 TRANSACTION ROUTES ========================

// Fetch User Transactions
app.get("/home", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const transactions = await Transaction.find({ userId }).sort({ date: -1 }).lean();

    // Calculate totals
    let income = 0, expense = 0;
    transactions.forEach(tx => tx.type === "Income" ? (income += tx.amount) : (expense += tx.amount));

    res.json({ transactions, income, expense });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Server error while fetching transactions" });
  }
});

// Add a Transaction
app.post("/home", authenticateToken, async (req, res) => {
  try {
    const { type, amount, date } = req.body;
    const userId = req.user.userId;

    const newTransaction = new Transaction({ userId, type, amount: parseFloat(amount), date: new Date(date) });
    await newTransaction.save();

    res.status(201).json({ message: "Transaction added", transaction: newTransaction });
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).json({ message: "Server error while adding transaction" });
  }
});

// Delete Transaction
app.delete("/home/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const result = await Transaction.findOneAndDelete({ _id: id, userId });
    if (!result) return res.status(404).json({ message: "Transaction not found" });

    res.json({ message: "Transaction deleted" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Server error while deleting transaction" });
  }
});

// ======================== 🏠 USER PROFILE ========================

// Get User Profile
app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
});

// ======================== 🚀 START SERVER ========================
app.listen(PORT, () => console.log(`🔥 Server running on http://localhost:${PORT}`));

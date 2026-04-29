// server.js — SIM-Verified Anti-Fraud API
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PORT } = require("./config/constants");

// Route imports
const verifyRoutes = require("./routes/verifyRoutes");
const apiKeyRoutes = require("./routes/apiKeyRoutes");
const statsRoutes = require("./routes/statsRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    service: "SIM-Verified Anti-Fraud API", 
    version: "1.0.0",
    docs: "/docs (coming soon)"
  });
});

app.use("/verify-user", verifyRoutes);
app.use("/api-keys", apiKeyRoutes);
app.use("/stats", statsRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Professional Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`\n🛡  SimVerify Anti-Fraud API Running`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`\nReady to solve SIM-swap & OTP fraud.`);
});

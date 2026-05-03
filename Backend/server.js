const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// --- DIAGNOSTIC CHECK ---
console.log("--- Starting Server Diagnostics ---");
if (!process.env.MONGO_URI) {
    console.error("❌ FATAL ERROR: MONGO_URI is missing or empty!");
    console.error("👉 Fix 1: Ensure your file is named EXACTLY '.env' (no .txt at the end).");
    console.error("👉 Fix 2: Ensure the .env file is inside the 'Backend' folder, right next to server.js.");
    process.exit(1); // Stop the server from crashing weirdly
} else if (!process.env.MONGO_URI.startsWith("mongodb")) {
    console.error("❌ FATAL ERROR: Your MONGO_URI does not start with 'mongodb+srv://'");
    console.error("Current value is:", process.env.MONGO_URI);
    process.exit(1);
} else {
    console.log("✅ MONGO_URI successfully loaded from .env file!");
}
// ------------------------

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected Successfully!"))
  .catch(err => console.log("❌ Database connection error:", err));

// Import Routes
const templateRoutes = require('./routes/templates');
app.use('/api/templates', templateRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
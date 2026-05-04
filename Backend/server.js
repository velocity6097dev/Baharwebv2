const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables (Local only, Vercel ignores this)

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// --- DIAGNOSTIC CHECK ---
console.log("--- Starting Server Diagnostics ---");
if (!process.env.MONGO_URI) {
    console.error("❌ FATAL ERROR: MONGO_URI is missing or empty!");
    console.error("👉 Fix (Local): Ensure your '.env' file is inside the 'Backend' folder, right next to server.js.");
    console.error("👉 Fix (Vercel): Ensure you have added MONGO_URI to your Project Settings > Environment Variables.");
    process.exit(1); // Stop the server from crashing weirdly
} else if (!process.env.MONGO_URI.startsWith("mongodb")) {
    console.error("❌ FATAL ERROR: Your MONGO_URI does not start with 'mongodb+srv://'");
    console.error("Current value is:", process.env.MONGO_URI);
    process.exit(1);
} else {
    console.log("✅ MONGO_URI successfully loaded!");
}
// ------------------------

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected Successfully!"))
  .catch(err => console.log("❌ Database connection error:", err));

// Import Routes
const templateRoutes = require('./routes/templates');
app.use('/api/templates', templateRoutes);

// --- VERCEL EXPORT & LOCAL LISTEN ---
// Export the app for Vercel's Serverless Functions
module.exports = app;

// Only listen on a port if running locally. 
// Vercel sets NODE_ENV to 'production' by default.
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Local server running on port ${PORT}`));
}

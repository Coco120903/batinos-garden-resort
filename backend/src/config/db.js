const mongoose = require("mongoose");

async function connectDB(mongoUri) {
  if (!mongoUri) throw new Error("MONGODB_URI is required");

  mongoose.set("strictQuery", true);
  // Disable buffering - fail immediately if not connected
  mongoose.set("bufferCommands", false);
  
  // Connection options for better reliability
  const options = {
    serverSelectionTimeoutMS: 60000, // 60 seconds
    socketTimeoutMS: 90000, // 90 seconds
    connectTimeoutMS: 60000, // 60 seconds
    retryWrites: true,
    w: 'majority',
    maxPoolSize: 10,
    minPoolSize: 1,
  };

  try {
    await mongoose.connect(mongoUri, options);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }
}

module.exports = { connectDB };


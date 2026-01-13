const mongoose = require("mongoose");

async function connectDB(mongoUri) {
  if (!mongoUri) throw new Error("MONGODB_URI is required");

  mongoose.set("strictQuery", true);
  
  // Connection options for better reliability
  const options = {
    serverSelectionTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 45000, // 45 seconds
    connectTimeoutMS: 30000, // 30 seconds
    retryWrites: true,
    w: 'majority',
  };

  await mongoose.connect(mongoUri, options);
}

module.exports = { connectDB };


const { loadEnv } = require("./config/env");
const { connectDB } = require("./config/db");
const { createApp } = require("./app");

async function start() {
  loadEnv();

  const port = process.env.PORT || 5001;
  const mongoUri = process.env.MONGODB_URI;

  // Try to connect to MongoDB, but don't crash if it fails
  if (mongoUri) {
    try {
      await connectDB(mongoUri);
      console.log("MongoDB connected");
    } catch (err) {
      console.error("MongoDB connection failed:", err.message);
      console.warn("Starting API without database connection. Some features may not work.");
    }
  } else {
    console.warn("MONGODB_URI not set — starting API without DB connection (dev only)");
  }

  const app = createApp();
  app.listen(port, '0.0.0.0', () => {
    console.log(`API listening on port ${port}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});


const { loadEnv } = require("./config/env");
const { connectDB } = require("./config/db");
const { createApp } = require("./app");

async function start() {
  loadEnv();

  const port = process.env.PORT || 5001;
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    await connectDB(mongoUri);
    console.log("MongoDB connected");
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


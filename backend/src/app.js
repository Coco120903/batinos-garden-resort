const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const siteRoutes = require("./routes/siteRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminSiteRoutes = require("./routes/adminSiteRoutes");
const adminMediaRoutes = require("./routes/adminMediaRoutes");
const adminReviewRoutes = require("./routes/adminReviewRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const adminChatRoutes = require("./routes/adminChatRoutes");
const { notFound } = require("./middlewares/notFound");
const { errorHandler } = require("./middlewares/errorHandler");
const { maintenanceGate } = require("./middlewares/maintenance");

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.use(morgan("dev"));

  app.get("/", (req, res) => res.send("Batino's API is running"));

  // Global maintenance gate (keeps login/site/health available)
  app.use(maintenanceGate);

  app.use("/api", healthRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/services", serviceRoutes);
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api/site", siteRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/chat", chatRoutes);

  // Admin content management
  app.use("/api/admin/site", adminSiteRoutes);
  app.use("/api/admin/media", adminMediaRoutes);
  app.use("/api/admin/reviews", adminReviewRoutes);
  app.use("/api/admin/chat", adminChatRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };


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

  // Configure CORS to allow Vercel and localhost
  const allowedOrigins = [
    'https://batinos-garden-resort.vercel.app',
    'https://batinos-garden-resort-kw992932p.vercel.app',
    /^https:\/\/.*\.vercel\.app$/, // Allow all Vercel preview deployments
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin matches allowed patterns
      const isAllowed = allowedOrigins.some(allowed => {
        if (typeof allowed === 'string') {
          return origin === allowed;
        }
        if (allowed instanceof RegExp) {
          return allowed.test(origin);
        }
        return false;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        // In development, allow all origins
        if (process.env.NODE_ENV !== 'production') {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    },
    credentials: true,
  }));

  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.use(morgan("dev"));

  app.get("/", (req, res) => res.send("Batino's API is running"));
  app.get("/api/version", (req, res) => {
    res.json({
      ok: true,
      service: process.env.RAILWAY_SERVICE_NAME || "batinos-backend",
      environment: process.env.RAILWAY_ENVIRONMENT_NAME || process.env.NODE_ENV || "unknown",
      publicDomain: process.env.RAILWAY_PUBLIC_DOMAIN,
      commit:
        process.env.RAILWAY_GIT_COMMIT_SHA ||
        process.env.RAILWAY_GIT_COMMIT ||
        process.env.GITHUB_SHA ||
        process.env.VERCEL_GIT_COMMIT_SHA ||
        "unknown",
      now: new Date().toISOString(),
    });
  });

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


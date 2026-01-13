const SiteSettings = require("../models/SiteSettings");
const { verifyAccessToken } = require("../utils/jwt");

/**
 * Blocks public operations when system is down, but ALWAYS allows:
 * - /api/auth/login
 * - /api/auth/register
 * - /api/auth/verify-email
 * - /api/auth/forgot-password
 * - /api/auth/reset-password
 * - /api/site
 * - /api/health
 * - /api/chat
 * Admin users can access ALL routes when authenticated (not just /api/admin/*)
 */
async function maintenanceGate(req, res, next) {
  try {
    const path = req.path || "";

    // Always allow auth + site settings + health + password reset
    // These endpoints must work even during maintenance for login/admin access
    if (
      path.startsWith("/api/auth/login") ||
      path.startsWith("/api/auth/register") ||
      path.startsWith("/api/auth/verify-email") ||
      path.startsWith("/api/auth/forgot-password") ||
      path.startsWith("/api/auth/reset-password") ||
      path.startsWith("/api/auth/me") ||
      path.startsWith("/api/site") ||
      path.startsWith("/api/health") ||
      path.startsWith("/api/chat")
    ) {
      return next();
    }

    // Admin routes remain accessible (they include auth+role checks)
    if (path.startsWith("/api/admin")) {
      return next();
    }

    // Check if user is authenticated admin - admins bypass maintenance
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.substring(7);
        const decoded = verifyAccessToken(token);
        if (decoded && decoded.role === "admin") {
          // Admin user - allow access to all routes
          return next();
        }
      } catch (e) {
        // Invalid token - continue with maintenance check
      }
    }

    const doc = await SiteSettings.findOne({ key: "default" }).select("system");
    const isOpen = doc?.system?.isBookingOpen ?? true;
    if (isOpen) return next();

    return res.status(503).json({
      message: doc?.system?.maintenanceMessage || "System is temporarily unavailable. Please try again later.",
      code: "MAINTENANCE_MODE"
    });
  } catch (e) {
    // Fail open to avoid accidental downtime due to DB hiccups
    return next();
  }
}

module.exports = { maintenanceGate };


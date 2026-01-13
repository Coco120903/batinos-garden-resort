const User = require("../models/User");
const { verifyAccessToken } = require("../utils/jwt");

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");
    if (type !== "Bearer" || !token) {
      res.status(401);
      throw new Error("Missing or invalid Authorization header");
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId).select("_id name email role isEmailVerified");
    if (!user) {
      res.status(401);
      throw new Error("Invalid token (user not found)");
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

function requireRole(...roles) {
  return function (req, res, next) {
    if (!req.user) {
      res.status(401);
      return next(new Error("Unauthorized"));
    }
    if (!roles.includes(req.user.role)) {
      res.status(403);
      return next(new Error("Forbidden"));
    }
    next();
  };
}

function requireVerifiedEmail(req, res, next) {
  if (!req.user) {
    res.status(401);
    return next(new Error("Unauthorized"));
  }
  if (!req.user.isEmailVerified) {
    res.status(403);
    return next(new Error("Email not verified"));
  }
  next();
}

module.exports = { requireAuth, requireRole, requireVerifiedEmail };


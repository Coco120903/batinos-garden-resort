const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "batinos-backend",
    db: {
      readyState: mongoose.connection?.readyState ?? 0, // 0=disconnected,1=connected,2=connecting,3=disconnecting
      connected: mongoose.connection?.readyState === 1
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;


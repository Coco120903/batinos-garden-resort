const express = require("express");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "batinos-backend",
    timestamp: new Date().toISOString()
  });
});

module.exports = router;


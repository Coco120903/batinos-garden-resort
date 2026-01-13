const crypto = require("crypto");

function generateVerificationToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function getExpiryDate(minutesFromNow = 30) {
  return new Date(Date.now() + minutesFromNow * 60 * 1000);
}

module.exports = { generateVerificationToken, hashToken, getExpiryDate };


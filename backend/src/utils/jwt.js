const jwt = require("jsonwebtoken");

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function signAccessToken(payload) {
  const secret = requireEnv("JWT_SECRET");
  const expiresIn = process.env.JWT_EXPIRES_IN || "1d";
  return jwt.sign(payload, secret, { expiresIn });
}

function verifyAccessToken(token) {
  const secret = requireEnv("JWT_SECRET");
  return jwt.verify(token, secret);
}

module.exports = { signAccessToken, verifyAccessToken };


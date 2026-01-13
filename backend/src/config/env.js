const path = require("path");
const dotenv = require("dotenv");

function loadEnv() {
  // Loads backend/.env if present (not committed)
  dotenv.config({ path: path.join(process.cwd(), ".env") });
}

module.exports = { loadEnv };


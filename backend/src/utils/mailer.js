const nodemailer = require("nodemailer");

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function createTransport() {
  const host = requireEnv("SMTP_HOST");
  const port = Number(requireEnv("SMTP_PORT"));
  const secure = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
  const user = requireEnv("SMTP_USER");
  const pass = requireEnv("SMTP_PASS");

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });
}

async function sendEmail({ to, subject, html }) {
  try {
    const from = requireEnv("EMAIL_FROM");
    const transporter = createTransport();
    await transporter.sendMail({ from, to, subject, html });
  } catch (error) {
    // Log error but don't throw - allow registration to succeed even if email fails
    console.error("Email sending failed:", error.message);
    // In development, we might want to throw, but in production we should be more graceful
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`Email service error: ${error.message}. Please check your SMTP credentials in .env file. Make sure you're using a Gmail App Password (not your regular password). See: https://support.google.com/accounts/answer/185833`);
    }
    // In production, silently fail to avoid blocking user registration
    // You might want to log this to a monitoring service
  }
}

module.exports = { sendEmail };


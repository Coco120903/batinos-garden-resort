/**
 * Seed script to create an admin user
 * Usage: node src/seed/createAdmin.js [email] [password] [name]
 * Or set environment variables: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { connectDB } = require("../config/db");
const { connectDB } = require("../config/db");

async function createAdmin() {
  try {
    // Get credentials from command line args or environment variables
    const email = process.argv[2] || process.env.ADMIN_EMAIL || "admin@batinos.com";
    const password = process.argv[3] || process.env.ADMIN_PASSWORD || "admin123";
    const name = process.argv[4] || process.env.ADMIN_NAME || "Admin User";

    // Connect to database
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("❌ Error: MONGODB_URI is not set in .env file");
      process.exit(1);
    }

    console.log("🔌 Connecting to MongoDB...");
    await connectDB(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingAdmin) {
      if (existingAdmin.role === "admin") {
        console.log(`⚠️  Admin user with email "${email}" already exists!`);
        console.log(`   Name: ${existingAdmin.name}`);
        console.log(`   Role: ${existingAdmin.role}`);
        console.log(`   Email Verified: ${existingAdmin.isEmailVerified}`);
        console.log("\n💡 To create a new admin, use a different email address.");
        await mongoose.connection.close();
        process.exit(0);
      } else {
        // User exists but is not admin - update to admin
        console.log(`⚠️  User with email "${email}" exists but is not an admin.`);
        console.log("   Updating to admin role...");
        
        const passwordHash = await bcrypt.hash(password, 10);
        existingAdmin.role = "admin";
        existingAdmin.isEmailVerified = true;
        existingAdmin.passwordHash = passwordHash;
        existingAdmin.name = name;
        await existingAdmin.save();
        
        console.log("✅ User updated to admin successfully!");
        console.log(`   Email: ${existingAdmin.email}`);
        console.log(`   Name: ${existingAdmin.name}`);
        console.log(`   Role: ${existingAdmin.role}`);
        await mongoose.connection.close();
        process.exit(0);
      }
    }

    // Validate password strength
    if (password.length < 6) {
      console.error("❌ Error: Password must be at least 6 characters long");
      await mongoose.connection.close();
      process.exit(1);
    }

    // Hash password
    console.log("🔐 Hashing password...");
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin user
    console.log("👤 Creating admin user...");
    const admin = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: "admin",
      isEmailVerified: true, // Admin doesn't need email verification
      phone: "",
      emailVerification: {
        tokenHash: "",
        expiresAt: undefined,
      },
    });

    console.log("\n✅ Admin user created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email:    " + admin.email);
    console.log("👤 Name:     " + admin.name);
    console.log("🔑 Password: " + password);
    console.log("👑 Role:     " + admin.role);
    console.log("✅ Verified: " + admin.isEmailVerified);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n💡 You can now login at: http://localhost:3001/login");
    console.log("⚠️  IMPORTANT: Change the default password after first login!");

    // Close connection
    await mongoose.connection.close();
    console.log("\n✅ Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error creating admin user:");
    console.error(error.message);
    
    if (error.code === 11000) {
      console.error("\n💡 This email is already registered. Use a different email or update the existing user.");
    }
    
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

// Run the script
createAdmin();

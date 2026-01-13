# MongoDB Atlas Setup Tutorial (Step-by-Step)
## For Batino's Garden Farm Resort Scheduling System

This guide walks you through creating a **free MongoDB database in the cloud** (MongoDB Atlas) for your MERN project.

---

## Step 1: Create MongoDB Atlas Account

1. Go to **https://www.mongodb.com/cloud/atlas/register**
2. Click **"Try Free"** or **"Sign Up"**
3. Fill in:
   - **Email** (use a real email you can access)
   - **Password** (save this!)
   - **First Name** and **Last Name**
4. Click **"Create your Atlas account"**
5. Check your email and **verify your account** (click the link MongoDB sends)

---

## Step 2: Create an Organization (Required)

**Yes, you need to create an organization first!** This is MongoDB's way of grouping projects.

1. After email verification, you'll be asked: **"Create an organization"**
2. **Organization Name**: Enter something like:
   - `My Projects` or `Batino Resort Development` (anything works)
3. **Cloud Provider**: Choose **"AWS"** (default is fine)
4. **Region**: Choose **"N. Virginia (us-east-1)"** or closest to Philippines
5. Click **"Next"**
6. **Project Name**: Enter `Batino Resort Scheduling` (or any name)
7. Click **"Create Organization"** or **"Finish"**

**What this does**: Organizations help you manage multiple projects/teams. For a solo project, it's just a container—you can ignore it after setup.

---

## Step 3: Create a Free Cluster

1. You'll see: **"Deploy a cloud database"**
2. Choose **"M0 FREE"** (Free Shared tier)
   - This gives you 512MB storage (enough for development)
3. **Cloud Provider**: Keep **"AWS"** (default)
4. **Region**: Choose closest to you:
   - **Singapore (ap-southeast-1)** ← Best for Philippines
   - Or **N. Virginia (us-east-1)** if Singapore isn't available
5. **Cluster Name**: Keep default `Cluster0` or rename to `batino-cluster`
6. Click **"Create Deployment"** (takes 3-5 minutes)

**What this does**: A "cluster" is your database server. The free tier is perfect for learning and portfolio projects.

---

## Step 4: Create Database User (Security)

While the cluster is deploying, you'll see: **"Create Database User"**

1. **Authentication Method**: Choose **"Password"**
2. **Username**: Enter something like:
   - `batino_admin` or `resort_user` (remember this!)
3. **Password**: Click **"Autogenerate Secure Password"** OR create your own
   - **IMPORTANT**: Click **"Copy"** or **"Download"** to save the password!
   - You'll need this for your connection string
4. Click **"Create Database User"**

**Security Note**: This user can only access databases you give it permission to. Never share this password publicly.

---

## Step 5: Configure Network Access (Allow Your IP)

1. You'll see: **"Where would you like to connect from?"**
2. Click **"Add My Current IP Address"** (MongoDB detects your IP automatically)
3. Click **"Finish and Close"**

**What this does**: MongoDB blocks all connections by default for security. This step allows YOUR computer to connect.

**For Development**: If you're testing from different locations, you can add `0.0.0.0/0` (allows any IP) but **ONLY for development**. Remove it before deploying to production.

---

## Step 6: Get Your Connection String (The Important Part!)

1. After setup, you'll see: **"Get started in seconds"**
2. Click **"Connect"** button (or go to **"Database"** → **"Connect"**)
3. Choose: **"Connect your application"** (drivers icon)
4. **Driver**: Select **"Node.js"** and **Version "5.5 or later"**
5. You'll see a connection string like:

```
mongodb+srv://batino_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

6. **Copy this entire string**
7. **Replace `<password>`** with the database user password you saved in Step 4
8. **Add your database name** before the `?`:

```
mongodb+srv://batino_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/batinos_scheduling?retryWrites=true&w=majority
```

**Example** (with fake password):
```
mongodb+srv://batino_admin:MySecurePass123@cluster0.abc123.mongodb.net/batinos_scheduling?retryWrites=true&w=majority
```

**Important**: 
- Replace `YOUR_PASSWORD` with your actual password
- Replace `batinos_scheduling` with whatever database name you want (this will be created automatically)
- Keep the rest of the string exactly as shown

---

## Step 7: Add Connection String to Your Project

1. In your project, go to `backend/` folder
2. Create a file named `.env` (no extension, just `.env`)
3. Copy the contents from `backend/env.sample` and fill in:

```env
# Server
PORT=5001
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://batino_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/batinos_scheduling?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_make_this_long_and_random_123456789

# Email (Gmail SMTP) - We'll set this up later
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_gmail_app_password
EMAIL_FROM=noreply@batinosresort.com
FRONTEND_URL=http://localhost:3000
```

4. **Replace**:
   - `MONGODB_URI` with your connection string from Step 6
   - `JWT_SECRET` with a long random string (you can generate one at https://randomkeygen.com/)

**Security**: Never commit `.env` to Git! It's already in `.gitignore`.

---

## Step 8: Test Your Connection

1. Make sure your backend is running:
   ```powershell
   npm run dev
   ```

2. You should see in the terminal:
   ```
   MongoDB connected: batinos_scheduling
   ```

3. If you see an error, check:
   - Did you replace `<password>` in the connection string?
   - Is your IP address allowed in Network Access?
   - Did you copy the entire connection string correctly?

---

## Step 9: Seed Your Database (Create Initial Data)

Once connected, populate your database with the resort package deals:

```powershell
cd backend
npm run seed:resort
```

You should see:
```
✅ Seeded resort service successfully!
```

---

## Step 10: Verify Data in MongoDB Atlas

1. Go back to MongoDB Atlas dashboard
2. Click **"Browse Collections"** (or **"Database"** → **"Browse Collections"**)
3. You should see:
   - Database: `batinos_scheduling`
   - Collections: `services`, `users`, `bookings` (after you create data)
4. Click on `services` to see your resort packages

---

## Common Issues & Solutions

### ❌ "Authentication failed"
- **Fix**: Check that you replaced `<password>` in the connection string with your actual database user password

### ❌ "IP not whitelisted"
- **Fix**: Go to **Network Access** → **Add IP Address** → Add your current IP

### ❌ "Connection timeout"
- **Fix**: Check your internet connection. MongoDB Atlas requires internet access.

### ❌ "Database name not found"
- **Fix**: This is normal! MongoDB creates the database automatically when you first write data to it. Run the seed script.

---

## What Happens Next?

After seeding, your database will have:
- ✅ `services` collection (with Day/Night/22-hour packages + extras)
- ✅ `users` collection (empty, ready for registrations)
- ✅ `bookings` collection (empty, ready for bookings)

Your backend API can now:
- ✅ List services: `GET /api/services`
- ✅ Register users: `POST /api/auth/register`
- ✅ Create bookings: `POST /api/bookings` (after login)

---

## Quick Reference: MongoDB Atlas Dashboard Locations

- **Connection String**: Database → Connect → Drivers
- **Database User**: Database Access (left sidebar)
- **Network Access**: Network Access (left sidebar)
- **View Data**: Database → Browse Collections
- **Cluster Settings**: Database → ... (three dots) → Edit Configuration

---

## Security Best Practices (For Later)

1. **Never commit `.env` to Git** ✅ (already in `.gitignore`)
2. **Use environment variables in production** (not hardcoded strings)
3. **Rotate passwords periodically**
4. **Limit IP access** (remove `0.0.0.0/0` before production)
5. **Use MongoDB Atlas built-in monitoring** (free tier includes basic monitoring)

---

**You're all set!** Your MongoDB database is ready for your MERN booking system. 🎉

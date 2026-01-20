# Fix MongoDB Authentication Error

## Current Status
- MongoDB User: `batino_admin` exists
- Railway MONGODB_URI: Set correctly
- Error: "bad auth : authentication failed"

## Solution: Verify and Reset Password

### Step 1: Reset Password in MongoDB Atlas
1. Go to MongoDB Atlas → Database Access
2. Click **Edit** (pencil icon) next to `batino_admin`
3. Click **"Edit Password"**
4. Set a NEW password (e.g., `Batino2024!` or `admin123456`)
5. **Save the password** - write it down!
6. Click **"Update"**

### Step 2: Update Railway Immediately
1. Go to Railway → Variables
2. Edit `MONGODB_URI`
3. Replace the password with the NEW password you just set
4. Format:
   ```
   mongodb+srv://batino_admin:NEW_PASSWORD_HERE@cluster0.4hpzvuv.mongodb.net/batinos-resort?retryWrites=true&w=majority
   ```
5. Click **"Update"**
6. Railway will auto-redeploy

### Step 3: Check Logs
1. Wait 1-2 minutes
2. Go to Railway → Deployments → Latest
3. View logs
4. Should see: **"MongoDB connected successfully"** ✅

## Why This Happens
Sometimes MongoDB Atlas passwords don't sync properly, or there's a mismatch. Resetting both ensures they match exactly.

## After Connection Works
1. Create admin user via Railway console:
   ```bash
   cd backend
   npm run seed:admin
   ```
2. Or login with default:
   - Email: `admin@batinos.com`
   - Password: `admin123`

Good luck! 🚀

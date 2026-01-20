# Fix: MongoDB Authentication Failed (Localhost)

## Problem
Your localhost can't connect to MongoDB because the password doesn't match.

## Quick Fix: Copy Connection String from Railway

### Option 1: Copy from Railway (Easiest)

1. **Go to Railway Dashboard:**
   - Open: https://railway.app
   - Go to your project → `batinos-garden-resort` service
   - Click **"Variables"** tab

2. **Copy the MONGODB_URI:**
   - Find `MONGODB_URI` variable
   - Click the **eye icon** (👁️) to reveal the value
   - **Copy the entire connection string**

3. **Update Local .env File:**
   - Open `backend/.env` in your code editor
   - Replace the `MONGODB_URI` line with the one from Railway
   - Save the file

4. **Restart Backend:**
   - Stop your dev server (Ctrl+C)
   - Run `npm run dev` again
   - Should see: `✅ MongoDB connected successfully`

### Option 2: Verify Password in MongoDB Atlas

1. **Go to MongoDB Atlas:**
   - Open: https://cloud.mongodb.com
   - Go to **Database Access**

2. **Check User Password:**
   - Find user: `batino_admin`
   - Click **Edit** (pencil icon)
   - If password is different from `admin123`, you have two options:

   **Option A:** Reset password to `admin123`
   - Click **"Edit Password"**
   - Set password to: `admin123`
   - Click **"Update"**
   - Update both Railway and local `.env` with this password

   **Option B:** Use current password
   - Copy the current password (if you know it)
   - Update both Railway and local `.env` with this password

3. **Update Connection String:**
   - Format: `mongodb+srv://batino_admin:PASSWORD_HERE@cluster0.4hpzvuv.mongodb.net/batinos-resort?retryWrites=true&w=majority`
   - Replace `PASSWORD_HERE` with the actual password

### Option 3: Test Connection String

Test if your connection string works:

```powershell
# In PowerShell (from project root)
cd backend
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI, {serverSelectionTimeoutMS: 10000}).then(() => { console.log('✅ Connected!'); process.exit(0); }).catch(err => { console.error('❌ Failed:', err.message); process.exit(1); });"
```

## After Fix

Once connected, you should see:
```
✅ MongoDB connected successfully
MongoDB connected
API listening on port 5001
```

Your localhost and production will now share the same database! 🎉

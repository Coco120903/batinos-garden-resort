# Deployment Guide: Vercel + Railway + GitHub

This guide will walk you through deploying your Batino's Garden Farm Resort scheduling application to production.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Step 1: Set Up GitHub Repository](#step-1-set-up-github-repository)
3. [Step 2: Deploy Backend to Railway](#step-2-deploy-backend-to-railway)
4. [Step 3: Deploy Frontend to Vercel](#step-3-deploy-frontend-to-vercel)
5. [Step 4: Configure Environment Variables](#step-4-configure-environment-variables)
6. [Step 5: Set Up MongoDB Atlas](#step-5-set-up-mongodb-atlas)
7. [Step 6: Connect Everything](#step-6-connect-everything)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, make sure you have:
- ✅ A GitHub account
- ✅ A Vercel account (free tier available)
- ✅ A Railway account (free tier available)
- ✅ A MongoDB Atlas account (free tier available)
- ✅ Node.js installed locally (for testing)

---

## Step 1: Set Up GitHub Repository

### 1.1 Create a New Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository name: `batinos-garden-resort` (or your preferred name)
4. Description: "Batino's Garden Farm Resort Scheduling System"
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license (we already have files)
7. Click **"Create repository"**

### 1.2 Push Your Code to GitHub

Open your terminal in the project root directory and run:

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Batino's Garden Farm Resort scheduling system"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/batinos-garden-resort.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note:** If you get authentication errors, you may need to:
- Use a Personal Access Token instead of password
- Or set up SSH keys

### 1.3 Create .gitignore (if not exists)

Make sure your `.gitignore` includes:

```
# Dependencies
node_modules/
package-lock.json

# Environment variables
.env
backend/.env
frontend/.env

# Build outputs
dist/
build/
.next/

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

---

## Step 2: Deploy Backend to Railway

### 2.1 Create Railway Account

1. Go to [Railway](https://railway.app)
2. Sign up with GitHub (recommended) or email
3. Verify your email if needed

### 2.2 Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Authorize Railway to access your GitHub repositories
4. Select your repository: `batinos-garden-resort`
5. Railway will detect it's a Node.js project

### 2.3 Configure Backend Service

1. Railway will create a service automatically
2. Click on the service to configure it
3. Go to **Settings** tab
4. Set the **Root Directory** to: `backend`
5. Set the **Start Command** to: `npm start`
6. Set the **Build Command** to: `npm install` (or leave empty)

### 2.4 Set Up MongoDB (Railway MongoDB Plugin)

**Option A: Use Railway's MongoDB Plugin (Easier)**

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add MongoDB"**
3. Railway will create a MongoDB instance
4. Click on the MongoDB service
5. Go to **"Variables"** tab
6. Copy the `MONGO_URL` value (you'll need this)

**Option B: Use MongoDB Atlas (Recommended for production)**

See Step 5 below.

### 2.5 Configure Environment Variables

1. In your backend service, go to **"Variables"** tab
2. Click **"+ New Variable"**
3. Add the following variables:

```
NODE_ENV=production
PORT=5001
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<generate-a-random-secret-key>
JWT_EXPIRES_IN=7d
```

**Generate JWT_SECRET:**
```bash
# In terminal, run:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**For Email (Gmail SMTP):**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Important:** 
- Replace `<your-mongodb-connection-string>` with your actual MongoDB URI
- For Gmail, you need to create an App Password (see Gmail setup below)

### 2.6 Deploy

1. Railway will automatically deploy when you push to GitHub
2. Or click **"Deploy"** manually
3. Wait for deployment to complete
4. Once deployed, Railway will provide a URL like: `https://your-app-name.up.railway.app`
5. Copy this URL - you'll need it for the frontend

### 2.7 Get Your Backend URL

1. In Railway, go to your backend service
2. Click **"Settings"** → **"Generate Domain"**
3. Copy the domain (e.g., `https://backend-production.up.railway.app`)

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Account

1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub (recommended)
3. Authorize Vercel to access your repositories

### 3.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository: `batinos-garden-resort`
3. Vercel will auto-detect it's a Vite/React project

### 3.3 Configure Frontend

1. **Framework Preset:** Vite
2. **Root Directory:** `frontend`
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. **Install Command:** `npm install`

### 3.4 Set Environment Variables

Click **"Environment Variables"** and add:

```
VITE_API_URL=https://your-backend-url.up.railway.app/api
```

**Important:** Replace `https://your-backend-url.up.railway.app` with your actual Railway backend URL (from Step 2.7)

### 3.5 Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your frontend
3. Once complete, you'll get a URL like: `https://batinos-garden-resort.vercel.app`
4. Your site is now live! 🎉

### 3.6 Update API Client (if needed)

Check your `frontend/src/api/client.js` - make sure it uses the environment variable:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
```

---

## Step 4: Configure Environment Variables

### 4.1 Backend Environment Variables (Railway)

In Railway backend service → Variables:

```
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/batinos-resort?retryWrites=true&w=majority
JWT_SECRET=your-generated-secret-key-here
JWT_EXPIRES_IN=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
```

### 4.2 Frontend Environment Variables (Vercel)

In Vercel project → Settings → Environment Variables:

```
VITE_API_URL=https://your-backend.up.railway.app/api
```

### 4.3 Gmail App Password Setup

To send emails, you need a Gmail App Password:

1. Go to [Google Account Settings](https://myaccount.google.com)
2. Click **Security** → **2-Step Verification** (enable if not already)
3. Scroll down to **App passwords**
4. Select **Mail** and **Other (Custom name)**
5. Enter "Batino's Resort App"
6. Click **Generate**
7. Copy the 16-character password
8. Use this as your `SMTP_PASS` in Railway

---

## Step 5: Set Up MongoDB Atlas

### 5.1 Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free
3. Create a new cluster (Free tier: M0)
4. Choose a cloud provider and region (closest to your users)
5. Click **"Create Cluster"** (takes 3-5 minutes)

### 5.2 Configure Database Access

1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `batinos-admin` (or your choice)
5. Password: Generate a strong password (save it!)
6. Database User Privileges: **"Atlas admin"** (or **"Read and write to any database"**)
7. Click **"Add User"**

### 5.3 Configure Network Access

1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. For production, click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - **Note:** For better security, you can add Railway's IP ranges later
4. Click **"Confirm"**

### 5.4 Get Connection String

1. Go to **Database** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your database user credentials
6. Add database name: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/batinos-resort?retryWrites=true&w=majority`
7. Use this as your `MONGODB_URI` in Railway

---

## Step 6: Connect Everything

### 6.1 Update CORS in Backend

Make sure your backend allows requests from your Vercel domain:

In `backend/src/app.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173', // Local dev
    'https://your-frontend.vercel.app' // Production
  ],
  credentials: true
}));
```

Or for all origins (less secure but easier):

```javascript
app.use(cors());
```

### 6.2 Test Your Deployment

1. **Test Backend:**
   - Visit: `https://your-backend.up.railway.app`
   - Should see: "Batino's API is running"

2. **Test Frontend:**
   - Visit: `https://your-frontend.vercel.app`
   - Should load your homepage

3. **Test API Connection:**
   - Open browser console on your frontend
   - Check for any CORS or API errors
   - Try logging in/registering

### 6.3 Create Admin Account

1. SSH into Railway or use Railway's console
2. Or create admin locally and it will sync to production
3. Run: `cd backend && npm run seed:admin`

---

## Troubleshooting

### Backend Issues

**Problem: Backend not starting**
- Check Railway logs: Service → **"Deployments"** → Click latest deployment → **"View Logs"**
- Verify all environment variables are set
- Check `package.json` has correct start script: `"start": "node src/server.js"`

**Problem: MongoDB connection failed**
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas Network Access allows Railway IPs
- Ensure database user has correct permissions

**Problem: Port issues**
- Railway automatically assigns a port via `PORT` environment variable
- Don't hardcode port numbers

### Frontend Issues

**Problem: API calls failing**
- Check `VITE_API_URL` in Vercel environment variables
- Verify backend URL is correct (no trailing slash)
- Check browser console for CORS errors
- Ensure backend CORS allows Vercel domain

**Problem: Build fails**
- Check Vercel build logs
- Verify all dependencies are in `package.json`
- Check for TypeScript/ESLint errors

### Email Issues

**Problem: Emails not sending**
- Verify Gmail App Password is correct
- Check SMTP variables in Railway
- Test email sending in backend logs

### General Issues

**Problem: Changes not deploying**
- Push changes to GitHub main branch
- Railway and Vercel auto-deploy on push
- Check deployment logs for errors

**Problem: Environment variables not updating**
- Redeploy after changing environment variables
- Clear browser cache
- Check variable names match exactly (case-sensitive)

---

## Quick Reference

### Railway Backend URL
```
https://your-backend-name.up.railway.app
```

### Vercel Frontend URL
```
https://your-project-name.vercel.app
```

### MongoDB Atlas Connection
```
mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
```

---

## Next Steps

1. ✅ Set up custom domain (optional)
2. ✅ Enable HTTPS (automatic on Vercel/Railway)
3. ✅ Set up monitoring/analytics
4. ✅ Configure backups for MongoDB
5. ✅ Set up staging environment
6. ✅ Add error tracking (Sentry, etc.)

---

## Support

If you encounter issues:
1. Check Railway logs
2. Check Vercel build logs
3. Check MongoDB Atlas connection
4. Review environment variables
5. Check browser console for frontend errors

Good luck with your deployment! 🚀

# Deploy Backend to Render (Free Alternative)

Since Railway trial expired, here's how to deploy to Render's free tier.

## Step 1: Create Render Account

1. Go to [Render](https://render.com)
2. Sign up with GitHub (free)
3. Verify your email

## Step 2: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `batinos-garden-resort`
3. Configure:
   - **Name:** `batinos-garden-resort-backend`
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** **Free** (or Starter if you want)

## Step 3: Environment Variables

Click **"Environment"** and add:

```
NODE_ENV=production
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-generated-secret-key
JWT_EXPIRES_IN=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
```

## Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will build and deploy automatically
3. Wait for deployment (5-10 minutes first time)
4. You'll get a URL like: `https://batinos-garden-resort-backend.onrender.com`

## Step 5: Update Frontend

When deploying frontend to Vercel, use:
```
VITE_API_URL=https://batinos-garden-resort-backend.onrender.com/api
```

## Render Free Tier Limits

- ✅ Free forever
- ⚠️ Spins down after 15 minutes of inactivity (takes ~30 seconds to wake up)
- ⚠️ 750 hours/month free (enough for always-on if you upgrade to Starter)
- ✅ Automatic SSL
- ✅ Custom domains

## Render Starter Plan ($7/month)

If you want always-on:
- No spin-down
- Better performance
- More resources

---

## Alternative: Fly.io (Also Free)

### Step 1: Install Fly CLI

```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex
```

### Step 2: Login

```bash
fly auth login
```

### Step 3: Create App

```bash
cd backend
fly launch
```

Follow the prompts, then deploy:
```bash
fly deploy
```

---

## Quick Comparison

| Platform | Free Tier | Always On | Best For |
|----------|-----------|-----------|----------|
| **Render** | ✅ Yes | ⚠️ Spins down | Easy setup |
| **Fly.io** | ✅ Yes | ✅ Yes | Always-on free |
| **Railway** | ❌ Trial only | ✅ Yes | Paid plans |

**Recommendation:** Use **Render** for easiest setup, or **Fly.io** if you need always-on for free.

Good luck! 🚀

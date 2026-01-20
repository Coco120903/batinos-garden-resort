# Railway Deployment Troubleshooting

## Quick Fix Steps

### 1. Check Railway Service Settings

In Railway dashboard:
1. Click on your service (batinos-garden-resort)
2. Go to **Settings** tab
3. Verify these settings:

**Root Directory:** `backend`
**Start Command:** `npm start`
**Build Command:** (leave empty or `npm install`)

### 2. Check Deployment Logs

1. In Railway, click on your service
2. Go to **Deployments** tab
3. Click on the failed deployment
4. Click **"View Logs"**
5. Look for error messages

Common errors you might see:
- `MONGODB_URI not set` → Need to add environment variable
- `Cannot find module` → Dependencies not installed
- `Port already in use` → Port configuration issue
- `EADDRINUSE` → Port conflict

### 3. Required Environment Variables

Go to **Variables** tab and add these (if not already set):

```
NODE_ENV=production
PORT=5001
MONGODB_URI=your-mongodb-connection-string-here
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRES_IN=7d
```

**Important:** Even if MONGODB_URI is not set yet, Railway needs at least:
- `NODE_ENV=production`
- `PORT=5001` (or let Railway auto-assign)

### 4. Fix Common Issues

#### Issue: "Cannot find module"
**Solution:**
- Make sure Root Directory is set to `backend`
- Railway should run `npm install` in the backend folder

#### Issue: "MONGODB_URI not set"
**Solution:**
- Add `MONGODB_URI` to environment variables
- For now, you can use a placeholder: `mongodb://localhost:27017/test`
- Or set up MongoDB Atlas first (see Step 5 in DEPLOYMENT_GUIDE.md)

#### Issue: "Port already in use"
**Solution:**
- Remove hardcoded port in code
- Use `process.env.PORT` (already done in server.js)
- Railway will auto-assign a port

#### Issue: Build fails
**Solution:**
- Check that `package.json` exists in `backend/` folder
- Verify `start` script exists: `"start": "node src/server.js"`

### 5. Redeploy

After fixing settings:
1. Go to **Deployments** tab
2. Click **"Redeploy"** or **"Deploy"**
3. Or push a new commit to trigger auto-deploy

### 6. Verify Deployment

Once deployed successfully:
1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"** (if not already done)
3. Visit the URL (e.g., `https://your-app.up.railway.app`)
4. Should see: "Batino's API is running"

---

## Step-by-Step Railway Setup

### Step 1: Service Configuration

1. **Service Name:** batinos-garden-resort (or your choice)
2. **Root Directory:** `backend`
3. **Build Command:** (leave empty - Railway auto-detects)
4. **Start Command:** `npm start`

### Step 2: Environment Variables (Minimum Required)

Add these in **Variables** tab:

```
NODE_ENV=production
```

**Note:** You can add other variables later, but `NODE_ENV` is essential.

### Step 3: Generate Domain

1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Copy the domain URL

### Step 4: Test Deployment

Visit your Railway domain:
- Should see: "Batino's API is running"
- If you see this, deployment is successful! ✅

---

## Still Having Issues?

### Check Logs Carefully

The deployment logs will show the exact error. Common patterns:

**Error Pattern:** `Error: Cannot find module 'express'`
- **Fix:** Root directory not set to `backend`

**Error Pattern:** `MONGODB_URI not set`
- **Fix:** Add `MONGODB_URI` environment variable (can be placeholder for now)

**Error Pattern:** `EADDRINUSE` or port errors
- **Fix:** Use `process.env.PORT` (already done)

**Error Pattern:** Build timeout
- **Fix:** Check internet connection, try redeploying

### Get Help

1. Copy the full error message from logs
2. Check Railway documentation: https://docs.railway.app
3. Check Railway Discord community

---

## Quick Checklist

- [ ] Root Directory set to `backend`
- [ ] Start Command: `npm start`
- [ ] `NODE_ENV=production` in variables
- [ ] `package.json` exists in `backend/` folder
- [ ] `src/server.js` exists
- [ ] Domain generated
- [ ] Deployment logs checked

Good luck! 🚀

# Railway Deployment - Next Steps

## ✅ Deployment Successful!

Your backend is now running on Railway. Here's what to do next:

## Step 1: Generate Public Domain

Your service is currently "Unexposed" - you need to generate a public URL:

1. In Railway, click on your service: **batinos-garden-resort**
2. Go to **Settings** tab
3. Scroll down to **Networking** section
4. Click **"Generate Domain"** button
5. Railway will create a URL like: `https://batinos-garden-resort-production.up.railway.app`
6. **Copy this URL** - you'll need it for the frontend!

## Step 2: Test Your Backend

1. Visit your Railway domain URL in a browser
2. You should see: **"Batino's API is running"**
3. Test API endpoint: `https://your-domain.up.railway.app/api/site`
   - Should return JSON data

## Step 3: Add Environment Variables

Go to **Variables** tab and add:

### Required Variables:
```
NODE_ENV=production
```

### Database (Add when ready):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/batinos-resort?retryWrites=true&w=majority
```

### Authentication:
```
JWT_SECRET=your-generated-secret-key-here
JWT_EXPIRES_IN=7d
```

### Email (Gmail SMTP):
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
```

**To generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 4: Deploy Frontend to Vercel

Now that your backend is live, deploy the frontend:

1. Go to [Vercel](https://vercel.com)
2. Sign up/login with GitHub
3. Click **"Add New Project"**
4. Import your repository: `batinos-garden-resort`
5. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Add Environment Variable:
   ```
   VITE_API_URL=https://your-railway-domain.up.railway.app/api
   ```
   ⚠️ **Important:** Replace with your actual Railway domain!
7. Click **"Deploy"**

## Step 5: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Add to Railway Variables as `MONGODB_URI`

## Your URLs

### Backend (Railway):
```
https://your-service-name.up.railway.app
```

### Frontend (Vercel - after deployment):
```
https://your-project-name.vercel.app
```

## Testing Checklist

- [ ] Backend domain generated
- [ ] Backend responds: "Batino's API is running"
- [ ] API endpoint works: `/api/site`
- [ ] Environment variables added
- [ ] Frontend deployed to Vercel
- [ ] Frontend can connect to backend
- [ ] Login/Registration works
- [ ] Database connected (after MongoDB setup)

## Troubleshooting

### Backend not accessible?
- Make sure domain is generated (not "Unexposed")
- Check service is running (1 Replica active)

### API returns errors?
- Check environment variables are set
- Check deployment logs for errors
- Verify MongoDB connection (if configured)

### Frontend can't connect?
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Verify backend domain is accessible

Congratulations! Your backend is live! 🎉

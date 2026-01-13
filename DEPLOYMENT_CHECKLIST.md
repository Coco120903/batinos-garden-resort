# Deployment Checklist

Use this checklist to ensure everything is set up correctly before and after deployment.

## Pre-Deployment Checklist

### GitHub Setup
- [ ] Created GitHub repository
- [ ] Pushed all code to GitHub
- [ ] Verified `.gitignore` excludes sensitive files
- [ ] Created `README.md` with project description

### Backend Preparation
- [ ] Backend `package.json` has `start` script: `"start": "node src/server.js"`
- [ ] All environment variables documented
- [ ] Database connection string ready
- [ ] JWT secret generated
- [ ] Email SMTP credentials ready (Gmail App Password)

### Frontend Preparation
- [ ] Frontend `package.json` has `build` script: `"build": "vite build"`
- [ ] API client uses environment variable for API URL
- [ ] All hardcoded URLs replaced with environment variables
- [ ] Build tested locally: `npm run build`

### Security
- [ ] No secrets committed to Git
- [ ] `.env` files in `.gitignore`
- [ ] Strong JWT secret generated
- [ ] MongoDB user has appropriate permissions
- [ ] CORS configured correctly

---

## Railway (Backend) Checklist

### Initial Setup
- [ ] Created Railway account
- [ ] Connected GitHub repository
- [ ] Created new project from GitHub repo
- [ ] Set root directory to `backend`
- [ ] Set start command to `npm start`

### Environment Variables
- [ ] `NODE_ENV=production`
- [ ] `PORT=5001` (or let Railway auto-assign)
- [ ] `MONGODB_URI=<your-mongodb-connection-string>`
- [ ] `JWT_SECRET=<generated-secret-key>`
- [ ] `JWT_EXPIRES_IN=7d`
- [ ] `SMTP_HOST=smtp.gmail.com`
- [ ] `SMTP_PORT=587`
- [ ] `SMTP_USER=<your-email@gmail.com>`
- [ ] `SMTP_PASS=<gmail-app-password>`

### Deployment
- [ ] Backend deployed successfully
- [ ] Backend URL copied (e.g., `https://xxx.up.railway.app`)
- [ ] Tested backend health endpoint: `https://your-backend.up.railway.app`
- [ ] Verified backend responds with "Batino's API is running"

---

## Vercel (Frontend) Checklist

### Initial Setup
- [ ] Created Vercel account
- [ ] Connected GitHub repository
- [ ] Imported project from GitHub
- [ ] Set framework preset to "Vite"
- [ ] Set root directory to `frontend`
- [ ] Set build command to `npm run build`
- [ ] Set output directory to `dist`

### Environment Variables
- [ ] `VITE_API_URL=https://your-backend.up.railway.app/api`
  - ⚠️ **Important:** Replace with your actual Railway backend URL
  - ⚠️ **Important:** Include `/api` at the end
  - ⚠️ **Important:** Use `https://` not `http://`

### Deployment
- [ ] Frontend deployed successfully
- [ ] Frontend URL copied (e.g., `https://xxx.vercel.app`)
- [ ] Tested frontend loads correctly
- [ ] Verified no console errors

---

## MongoDB Atlas Checklist

### Database Setup
- [ ] Created MongoDB Atlas account
- [ ] Created free cluster (M0)
- [ ] Created database user
- [ ] Saved database user credentials securely
- [ ] Configured network access (allowed all IPs or specific IPs)
- [ ] Got connection string
- [ ] Tested connection string locally

### Connection String Format
```
mongodb+srv://username:password@cluster.mongodb.net/batinos-resort?retryWrites=true&w=majority
```
- [ ] Replaced `<username>` with actual username
- [ ] Replaced `<password>` with actual password
- [ ] Added database name (`batinos-resort`)
- [ ] Verified connection string works

---

## Post-Deployment Testing

### Backend Tests
- [ ] Health check: `GET https://your-backend.up.railway.app`
- [ ] API endpoint: `GET https://your-backend.up.railway.app/api/site`
- [ ] CORS working (no CORS errors in browser console)

### Frontend Tests
- [ ] Homepage loads
- [ ] No console errors
- [ ] API calls working (check Network tab)
- [ ] Login page accessible
- [ ] Registration works
- [ ] Email verification works (if configured)
- [ ] Admin login works
- [ ] Images load correctly

### Integration Tests
- [ ] User can register
- [ ] User can login
- [ ] User can view services
- [ ] User can create booking
- [ ] Admin can login
- [ ] Admin can view dashboard
- [ ] Admin can manage bookings
- [ ] Admin can manage media

### Email Tests
- [ ] Registration email sent
- [ ] Email verification link works
- [ ] Password reset email sent
- [ ] Password reset link works

---

## Troubleshooting Common Issues

### Backend Issues

**Issue: Backend not starting**
- [ ] Check Railway logs
- [ ] Verify all environment variables set
- [ ] Check `package.json` start script
- [ ] Verify Node.js version compatibility

**Issue: MongoDB connection failed**
- [ ] Verify `MONGODB_URI` is correct
- [ ] Check MongoDB Atlas Network Access
- [ ] Verify database user credentials
- [ ] Check connection string format

**Issue: CORS errors**
- [ ] Update CORS in `backend/src/app.js`
- [ ] Add Vercel domain to allowed origins
- [ ] Verify CORS middleware is enabled

### Frontend Issues

**Issue: API calls failing**
- [ ] Verify `VITE_API_URL` in Vercel
- [ ] Check backend URL is correct
- [ ] Verify no trailing slash in API URL
- [ ] Check browser console for errors
- [ ] Verify CORS is configured

**Issue: Build fails**
- [ ] Check Vercel build logs
- [ ] Verify all dependencies in `package.json`
- [ ] Check for TypeScript/ESLint errors
- [ ] Verify Node.js version

**Issue: Environment variables not working**
- [ ] Redeploy after changing variables
- [ ] Verify variable names start with `VITE_`
- [ ] Clear browser cache
- [ ] Check variable names are exact (case-sensitive)

---

## Security Checklist

- [ ] All secrets in environment variables (not in code)
- [ ] `.env` files in `.gitignore`
- [ ] Strong JWT secret (32+ characters)
- [ ] MongoDB user has minimal required permissions
- [ ] CORS configured to specific domains (not `*`)
- [ ] HTTPS enabled (automatic on Vercel/Railway)
- [ ] No sensitive data in client-side code

---

## Performance Checklist

- [ ] Frontend build optimized
- [ ] Images optimized/compressed
- [ ] Database indexes created (if needed)
- [ ] API responses cached where appropriate
- [ ] Error handling implemented
- [ ] Loading states implemented

---

## Monitoring Setup (Optional)

- [ ] Set up error tracking (Sentry, etc.)
- [ ] Set up analytics (Google Analytics, etc.)
- [ ] Set up uptime monitoring
- [ ] Configure email alerts for errors
- [ ] Set up database backups

---

## Final Steps

- [ ] Test complete user flow
- [ ] Test complete admin flow
- [ ] Document any custom configurations
- [ ] Share deployment URLs with team
- [ ] Set up custom domain (optional)
- [ ] Configure SSL (automatic on Vercel/Railway)

---

## Quick Reference

### Backend URL
```
https://your-backend-name.up.railway.app
```

### Frontend URL
```
https://your-project-name.vercel.app
```

### MongoDB Connection
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### Environment Variables Needed

**Railway (Backend):**
- `MONGODB_URI`
- `JWT_SECRET`
- `SMTP_USER`
- `SMTP_PASS`

**Vercel (Frontend):**
- `VITE_API_URL`

---

## Support Resources

- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Vite Documentation](https://vitejs.dev)

Good luck with your deployment! 🚀

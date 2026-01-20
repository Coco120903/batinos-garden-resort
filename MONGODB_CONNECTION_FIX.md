# Fix MongoDB Connection Timeout

## Current Issue
MongoDB connection is timing out: `Operation users.findOne() buffering timed out after 10000ms`

## Step 1: Verify Connection String Format

In Railway → Variables, your `MONGODB_URI` should be EXACTLY:

```
mongodb+srv://batino_admin:admin123@cluster0.4hpzvuv.mongodb.net/batinos-resort?retryWrites=true&w=majority
```

**Check:**
- ✅ Username: `batino_admin`
- ✅ Password: `admin123` (no special characters that need encoding)
- ✅ Cluster: `cluster0.4hpzvuv.mongodb.net`
- ✅ Database: `batinos-resort`
- ✅ Parameters: `?retryWrites=true&w=majority`

## Step 2: Verify MongoDB Atlas Network Access

1. Go to MongoDB Atlas → **Network Access**
2. Verify you have:
   - `0.0.0.0/0` (Allow Access from Anywhere) - **Active**
3. If not active, wait a few more minutes for propagation

## Step 3: Test Connection Locally (Optional)

You can test if the connection string works from your local machine:

```bash
# In your local terminal
cd backend
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => { console.log('Connected!'); process.exit(0); }).catch(err => { console.error('Failed:', err.message); process.exit(1); });"
```

## Step 4: Check Railway Logs

1. Go to Railway → Deployments → Latest deployment
2. View logs
3. Look for:
   - "MongoDB connected" ✅ (success)
   - "MongoDB connection failed" ❌ (still failing)

## Step 5: Alternative - URL Encode Password

If password has special characters, try URL encoding. For `admin123`, it's the same, but if you change it later:

- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`
- etc.

## Step 6: Verify MongoDB Cluster Status

1. Go to MongoDB Atlas → Clusters
2. Check if Cluster0 shows "Active" (green)
3. If paused, click "Resume" or "Resume Cluster"

## Common Issues

### Issue: Connection times out
**Solutions:**
- Wait 5-10 minutes for network access to propagate
- Verify `0.0.0.0/0` is active in Network Access
- Check cluster is not paused

### Issue: Authentication failed
**Solutions:**
- Verify username/password are correct
- Check database user exists in Database Access
- Try resetting the database user password

### Issue: DNS resolution failed
**Solutions:**
- Verify cluster name in connection string matches Atlas
- Check cluster is active (not paused)

## Quick Test

Try this in Railway console (if available):
```bash
node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb+srv://batino_admin:admin123@cluster0.4hpzvuv.mongodb.net/batinos-resort?retryWrites=true&w=majority', {serverSelectionTimeoutMS: 5000}).then(() => console.log('OK')).catch(e => console.log('FAIL:', e.message));"
```

## If Still Not Working

1. **Wait longer** - Network access can take 10-15 minutes to fully propagate
2. **Create new database user** - Sometimes recreating the user helps
3. **Check MongoDB Atlas status** - Make sure cluster is running
4. **Try without database name first** - Test basic connection:
   ```
   mongodb+srv://batino_admin:admin123@cluster0.4hpzvuv.mongodb.net/?retryWrites=true&w=majority
   ```

Good luck! 🚀

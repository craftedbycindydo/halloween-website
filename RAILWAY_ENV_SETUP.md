# 🚂 Railway Environment Variables Setup

This guide shows you **exactly** what to add in Railway's UI for deployment.

## 📋 Railway Configuration Steps

### 1. Create Railway Project
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `halloween-contest` repository

### 2. Add MySQL Database
1. In your Railway project, click "+ New"
2. Select "Database" → "MySQL"
3. Railway creates the database and provides `MYSQL_URL` automatically

### 3. Configure Web Service Environment Variables

Click on your **web service** → **Variables** → Add these:

#### Required Variables (Add in Railway UI):

```env
# Database Connection (Railway auto-provides MYSQL_URL)
DATABASE_URL=${MYSQL_URL}

# Server Configuration
NODE_ENV=production
PORT=${PORT}

# Admin Access (CHANGE THIS!)
ADMIN_PASSWORD=YourSecurePassword123!

# Frontend URL (Railway auto-provides RAILWAY_PUBLIC_DOMAIN)
FRONTEND_URL=https://${RAILWAY_PUBLIC_DOMAIN}
REACT_APP_API_URL=https://${RAILWAY_PUBLIC_DOMAIN}/api
```

### Variable Explanation:

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `${MYSQL_URL}` | References MySQL service URL |
| `NODE_ENV` | `production` | Sets production mode |
| `PORT` | `${PORT}` | Railway assigns this automatically |
| `ADMIN_PASSWORD` | Your choice | Password for admin panel |
| `FRONTEND_URL` | `https://${RAILWAY_PUBLIC_DOMAIN}` | Your app's public URL |
| `REACT_APP_API_URL` | `https://${RAILWAY_PUBLIC_DOMAIN}/api` | API endpoint for React |

---

## 🎯 Copy-Paste Template for Railway

**In Railway UI, add these one by one:**

### Variable 1: DATABASE_URL
```
Name: DATABASE_URL
Value: ${MYSQL_URL}
```

### Variable 2: NODE_ENV
```
Name: NODE_ENV
Value: production
```

### Variable 3: ADMIN_PASSWORD
```
Name: ADMIN_PASSWORD
Value: SpookyAdmin2024!
```
⚠️ **Change this to your own secure password!**

### Variable 4: FRONTEND_URL
```
Name: FRONTEND_URL
Value: https://${RAILWAY_PUBLIC_DOMAIN}
```

### Variable 5: REACT_APP_API_URL
```
Name: REACT_APP_API_URL
Value: https://${RAILWAY_PUBLIC_DOMAIN}/api
```

---

## 📸 Railway UI Screenshot Guide

### Step-by-Step:

1. **Open Variables Tab**
   - Click on your service (web)
   - Click "Variables" tab
   - Click "New Variable"

2. **Add Each Variable**
   - Type variable name (e.g., `DATABASE_URL`)
   - Type variable value (e.g., `${MYSQL_URL}`)
   - Click "Add"
   - Repeat for all variables

3. **Deploy**
   - Variables are automatically applied
   - Railway redeploys your app

---

## 🔗 How DATABASE_URL Works

Railway's MySQL service provides:
```env
MYSQL_URL=mysql://root:password@containers-us-west-123.railway.app:1234/railway
```

Your backend automatically parses this as:
- Host: `containers-us-west-123.railway.app`
- User: `root`
- Password: `password`
- Database: `railway`
- Port: `1234`

**You don't need to set these individually!** Just use `${MYSQL_URL}`.

---

## 🚀 Deploy Checklist

Before deploying, make sure:

- [ ] GitHub repository is pushed
- [ ] Railway project created
- [ ] MySQL database added to project
- [ ] All 5 environment variables added
- [ ] `ADMIN_PASSWORD` is changed from default
- [ ] Code is committed and pushed

---

## 🎮 First Deploy - Initialize Database

### Option 1: Custom Start Command (Recommended)

**First deploy only:**

1. Go to your service in Railway
2. Click "Settings"
3. Scroll to "Deploy"
4. Under "Custom Start Command", enter:
   ```bash
   cd server && node config/setup.js && node server.js
   ```
5. Click "Save"
6. Click "Deploy" (or it deploys automatically)
7. Wait for deployment to complete
8. **Important:** Remove the custom start command after first successful deploy
9. Redeploy (it will use default start command from package.json)

### Option 2: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run setup
railway run cd server && node config/setup.js

# Done! Deploy normally
git push
```

---

## ✅ Verify Deployment

After deployment, test these URLs:

### Health Check
```
https://your-app-name.up.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "🎃 Halloween Contest API is running!"
}
```

### Get Contestants
```
https://your-app-name.up.railway.app/api/contestants
```

Expected: Empty array `[]` (no contestants yet)

### Frontend
```
https://your-app-name.up.railway.app
```

Expected: Halloween website loads 🎃

---

## 🐛 Troubleshooting

### "Database connection failed"
- Check `DATABASE_URL` is set to `${MYSQL_URL}`
- Verify MySQL service is running in Railway
- Check service logs for connection errors

### "Cannot find module" errors
- Ensure `package.json` is committed
- Check `node_modules` is in `.gitignore`
- Railway automatically runs `npm install`

### CORS errors in browser
- Check `FRONTEND_URL` matches your Railway domain
- Verify both services are running
- Check browser console for exact error

### Admin password not working
- Check `ADMIN_PASSWORD` environment variable
- Verify no extra spaces in the value
- Try redeploying after setting

### Database tables not created
- Run the custom start command (Option 1 above)
- Or use Railway CLI to run setup script
- Check logs for setup errors

---

## 🔐 Security Checklist for Production

- [ ] Changed `ADMIN_PASSWORD` from default
- [ ] `NODE_ENV` set to `production`
- [ ] Database credentials not in code (using `DATABASE_URL`)
- [ ] HTTPS enabled (automatic with Railway)
- [ ] CORS configured with `FRONTEND_URL`

---

## 📊 Railway Free Tier Limits

Your app uses:
- **1 Web Service**: ~100-200 execution hours/month
- **1 MySQL Database**: ~100-150 execution hours/month
- **Total**: ~200-350 hours/month

**Free tier**: 500 hours/month + $5 credit 💚

**You're well within limits!**

---

## 🎉 You're Ready!

Once all variables are set:
1. Push your code to GitHub
2. Railway automatically builds and deploys
3. Database initializes on first run
4. Your Halloween contest is live! 🎃👻

**Need help?** Check the logs in Railway dashboard or open an issue.

---

**Pro Tip:** After first successful deploy, star your project in Railway to keep it active!


# 🚀 Railway.app Deployment Guide

## Prerequisites
- GitHub account
- Railway account (free tier available)

## Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit - Halloween Contest App"
```

### 1.2 Push to GitHub
```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/halloween-contest.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up Railway

### 2.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Authorize Railway to access your repositories

### 2.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `halloween-contest` repository

### 2.3 Add MySQL Database
1. In your project, click "New"
2. Select "Database" → "Add MySQL"
3. Railway will create a MySQL instance
4. Note: Database credentials are automatically available as environment variables

## Step 3: Configure Environment Variables

### 3.1 Add Variables to Railway
In your Railway project settings, add these environment variables:

**Required Variables:**
```
NODE_ENV=production
ADMIN_PASSWORD=SpookyAdmin2024!
FRONTEND_URL=https://your-app-name.up.railway.app
```

**Database Variables (Auto-configured by Railway MySQL):**
Railway automatically provides these when you add MySQL:
- `DATABASE_URL`
- `MYSQL_URL`
- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `MYSQLDATABASE`

### 3.2 Update server/config/database.js for Railway
Railway provides `DATABASE_URL`, so the connection will work automatically!

If needed, manually set:
```
DB_HOST=${{MYSQLHOST}}
DB_USER=${{MYSQLUSER}}
DB_PASSWORD=${{MYSQLPASSWORD}}
DB_NAME=${{MYSQLDATABASE}}
DB_PORT=${{MYSQLPORT}}
```

## Step 4: Deploy

### 4.1 Automatic Deployment
Railway will automatically:
1. Detect Node.js app
2. Run `npm install`
3. Run `npm run build` (builds React)
4. Install server dependencies
5. Start server with `node server/server.js`

### 4.2 Watch Deployment
- View logs in Railway dashboard
- Check for any errors
- Wait for "Deployment successful" message

## Step 5: Initialize Database

### 5.1 Run Database Setup
In Railway dashboard:
1. Go to your service
2. Click on "Settings" → "Service"
3. Under "Custom Start Command", temporarily set:
   ```
   cd server && node config/setup.js && node server.js
   ```
4. Redeploy
5. After tables are created, remove setup command

**Or** use Railway CLI:
```bash
railway run cd server && node config/setup.js
```

## Step 6: Access Your App

Your app will be available at:
```
https://your-project-name.up.railway.app
```

## Railway Free Tier Limits

✅ **What's Included:**
- 500 execution hours/month
- $5 credit/month
- 1 GB RAM per service
- MySQL database included
- Custom domains
- Automatic HTTPS

## Troubleshooting

### Database Connection Failed
1. Check environment variables are set
2. Verify MySQL service is running
3. Check logs: `railway logs`

### Build Failed
1. Check `package.json` scripts
2. Verify all dependencies are listed
3. Check Node.js version compatibility

### Port Issues
Railway automatically assigns `PORT` environment variable.
Server code already uses: `process.env.PORT || 8000`

### CORS Errors
Update `FRONTEND_URL` environment variable to match your Railway domain:
```
FRONTEND_URL=https://your-app.up.railway.app
```

## Updating Your App

### Push Changes
```bash
git add .
git commit -m "Your changes"
git push
```

Railway automatically redeploys on every push to main branch!

## Environment-Specific URLs

### Development
- Frontend: http://localhost:3000
- Backend: http://localhost:8000/api

### Production (Railway)
- Frontend + Backend: https://your-app.up.railway.app
- API: https://your-app.up.railway.app/api

## Custom Domain (Optional)

1. In Railway project settings
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `FRONTEND_URL` environment variable

## Monitoring

### View Logs
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# View logs
railway logs
```

### Check Health
Visit: `https://your-app.up.railway.app/health`

Expected response:
```json
{
  "status": "ok",
  "message": "🎃 Halloween Contest API is running!"
}
```

## Cost Management

**Tips to stay within free tier:**
1. Use sleep mode for inactive apps
2. Monitor usage in Railway dashboard
3. One app uses ~100-200 hrs/month
4. Database adds ~100 hrs/month
5. Total: ~300 hrs/month (well within 500 limit!)

## Security for Production

Before going live:
1. ✅ Change `ADMIN_PASSWORD` 
2. ✅ Set `NODE_ENV=production`
3. ✅ Use strong database password
4. ✅ Enable Railway's automatic HTTPS
5. ✅ Review CORS settings
6. ✅ Monitor logs regularly

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- GitHub Issues: Your repository

Happy deploying! 🎃👻🚀


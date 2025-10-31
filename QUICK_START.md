# 🎃 Quick Start Guide

## Local Development

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Set Up Environment Variables

**Backend (.env in /server/):**
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=halloween_contest
DB_PORT=3306
PORT=8000
NODE_ENV=development
ADMIN_PASSWORD=SpookyAdmin2024!
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env in root):**
```bash
# In project root
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

### 3. Set Up Database

**Option A: Using MySQL CLI**
```bash
mysql -u root -p
CREATE DATABASE halloween_contest;
exit;
```

**Option B: Using Node.js Script**
```bash
npm run server:setup
```

### 4. Start Development

**Terminal 1 - Backend:**
```bash
npm run server
# Server runs on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
npm start
# React app opens at http://localhost:3000
```

**Or run both together:**
```bash
npm run dev
# Requires: npm install -g concurrently
```

### 5. Access the App

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api
- **Health Check:** http://localhost:8000/health

### 6. Admin Access

- **Admin Password:** `SpookyAdmin2024!`
- Click "Admin" in navbar
- Upload contestants
- View results

---

## Railway Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/halloween-contest.git
git push -u origin main
```

### 2. Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository

### 3. Add MySQL Database

1. In Railway project, click "New"
2. Select "Database" → "Add MySQL"
3. Database created automatically!

### 4. Configure Environment Variables

In Railway UI, add these variables to your **web service**:

**Required:**
```
NODE_ENV=production
ADMIN_PASSWORD=YourSecurePasswordHere
FRONTEND_URL=https://${RAILWAY_PUBLIC_DOMAIN}
DATABASE_URL=${MYSQL_URL}
```

**Railway Auto-Provides:**
- `MYSQL_URL` (from MySQL service)
- `PORT` (automatically assigned)

### 5. Deploy!

Railway automatically:
- Builds React frontend
- Installs backend dependencies
- Runs database setup
- Starts server

### 6. Initialize Database (First Time Only)

**Option A: Temporary Start Command**

In Railway service settings:
1. Settings → Deploy → Custom Start Command:
   ```
   cd server && node config/setup.js && node server.js
   ```
2. Redeploy
3. After successful deploy, remove custom command
4. Redeploy again

**Option B: Railway CLI**
```bash
npm install -g @railway/cli
railway login
railway run cd server && node config/setup.js
```

### 7. Access Your Live App

Your app will be at:
```
https://your-project-name.up.railway.app
```

---

## Environment Variables Summary

### Local Development

**Backend (server/.env):**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=halloween_contest
DB_PORT=3306
PORT=8000
NODE_ENV=development
ADMIN_PASSWORD=SpookyAdmin2024!
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:8000/api
```

### Railway Production

**Backend (Railway UI):**
```env
DATABASE_URL=${MYSQL_URL}
NODE_ENV=production
ADMIN_PASSWORD=YourSecurePassword123!
FRONTEND_URL=https://${RAILWAY_PUBLIC_DOMAIN}
PORT=${PORT}
```

**Frontend (Railway UI):**
```env
REACT_APP_API_URL=https://${RAILWAY_PUBLIC_DOMAIN}/api
```

---

## Troubleshooting

### Database Connection Failed
```bash
# Check MySQL is running
mysql -u root -p

# Verify credentials in .env
cat server/.env

# Test connection
mysql -h localhost -u root -p halloween_contest
```

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### CORS Errors
- Check `FRONTEND_URL` in `server/.env`
- Should match React app URL
- Local: `http://localhost:3000`
- Production: Your Railway domain

### React Can't Reach API
- Check `REACT_APP_API_URL` in `.env`
- Restart React after changing `.env`
- Check backend is running: http://localhost:8000/health

---

## Useful Commands

```bash
# Development
npm run dev              # Run frontend + backend together
npm start               # Frontend only
npm run server          # Backend only
npm run server:setup    # Initialize database

# Production Build
npm run build           # Build React for production
npm run deploy          # Build + install production deps

# Database
npm run server:setup    # Create database & tables

# Testing
curl http://localhost:8000/health  # Test backend
curl http://localhost:8000/api/contestants  # Test API
```

---

## Project Structure

```
halloween-website/
├── src/                    # React frontend
│   ├── components/        # UI components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   └── types.ts          # TypeScript types
├── server/                # Node.js backend
│   ├── config/           # Database config
│   ├── routes/           # API routes
│   └── server.js         # Express server
├── public/               # Static assets
├── .env                  # Frontend env (local)
├── server/.env           # Backend env (local)
└── package.json          # Dependencies

```

---

## Support

- **Railway Docs:** https://docs.railway.app
- **Issues:** Create GitHub issue
- **Admin Password:** Default is `SpookyAdmin2024!`

Happy Halloween! 🎃👻


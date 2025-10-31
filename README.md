# 🎃 Halloween Costume Contest Website 👻

A full-stack Halloween costume contest application built with React, Node.js, Express, and MySQL. Features spooky animations, contestant management, and secure voting system.

![Halloween Contest](https://img.shields.io/badge/Halloween-2024-orange?style=for-the-badge&logo=ghost)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-8-blue?style=for-the-badge&logo=mysql)

## ✨ Features

### 🎭 Display Page
- **Spooky Animations**: Contestant cards float freely with physics-based animations
- **Halloween Theme**: Dark purple/black theme with floating SVG decorations
- **Responsive Design**: Works on all devices

### 🗳️ Voting System
- **One Vote Per Device**: Device fingerprinting prevents duplicate votes
- **One Change Allowed**: Voters can change their vote once
- **Secure & Persistent**: Votes stored in MySQL database

### 🔐 Admin Panel
- **Password Protected**: Secure admin access
- **Contestant Management**: Add, edit, delete contestants
- **Image Upload**: Upload contestant photos (base64 storage)
- **Live Results**: Real-time leaderboard with vote counts

### 🎨 Visual Effects
- Floating Halloween SVGs (pumpkins, bats, skulls, etc.)
- Free-flowing physics-based animations using React Spring
- Glass-morphism UI elements
- Responsive navigation

## 🚀 Tech Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Shadcn UI components
- React Spring for animations

**Backend:**
- Node.js & Express
- MySQL database
- RESTful API
- CORS enabled

**Deployment:**
- Railway.app (recommended)
- Single full-stack deployment
- Managed MySQL database

## 📦 Installation

### Prerequisites
- Node.js 14+ 
- MySQL 8+ (for local development)
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd halloween-website

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..

# Set up environment variables
cp server/.env.example server/.env
# Edit server/.env with your database credentials

# Set up database (local only)
npm run server:setup

# Run development servers
npm run dev
```

Visit http://localhost:3000 🎃

## 🌐 Deployment to Railway

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git push
```

### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add MySQL database service
4. Configure environment variables:

**Required Environment Variables:**
```env
DATABASE_URL=${MYSQL_URL}
NODE_ENV=production
ADMIN_PASSWORD=YourSecurePassword
FRONTEND_URL=https://${RAILWAY_PUBLIC_DOMAIN}
```

### Step 3: Initialize Database
First deploy, run database setup:
```bash
railway run cd server && node config/setup.js
```

**Done!** Your app is live at `https://your-app.railway.app` 🎉

## 🔧 Environment Variables

### Backend (server/.env)

**For Railway (use DATABASE_URL):**
```env
DATABASE_URL=mysql://user:password@host:port/database
NODE_ENV=production
ADMIN_PASSWORD=YourSecurePassword
FRONTEND_URL=https://your-app.railway.app
PORT=8000
```

**For Local Development:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=halloween_contest
DB_PORT=3306
NODE_ENV=development
ADMIN_PASSWORD=SpookyAdmin2024!
FRONTEND_URL=http://localhost:3000
PORT=8000
```

### Frontend (.env in root)
```env
REACT_APP_API_URL=http://localhost:8000/api
```

## 📚 API Endpoints

### Contestants
- `GET /api/contestants` - Get all contestants
- `POST /api/contestants` - Add contestant (admin)
- `DELETE /api/contestants` - Delete contestant (admin)

### Votes
- `GET /api/votes?checkStatus=1` - Check vote status
- `GET /api/votes?adminPassword=xxx` - Get all votes (admin)
- `POST /api/votes` - Submit/change vote

### Health Check
- `GET /health` - Server health status

## 🎮 Usage

### Admin Access
1. Click **Admin** in navbar
2. Enter password: `SpookyAdmin2024!` (change in production!)
3. Add contestants with images
4. View live results

### Voting
1. Click **Vote** in navbar
2. Enter your name
3. Select a contestant
4. Submit vote (can change once!)

### Display
- Click **Display** to see all contestants floating spookily!

## 📁 Project Structure

```
halloween-website/
├── src/                      # React frontend
│   ├── components/          # UI components
│   │   ├── Navbar.tsx
│   │   ├── ContestantCard.tsx
│   │   └── FloatingDecorations.tsx
│   ├── pages/               # Page components
│   │   ├── DisplayPage.tsx
│   │   ├── VotePage.tsx
│   │   └── AdminPage.tsx
│   ├── services/            # API services
│   │   └── api.ts
│   └── types.ts             # TypeScript types
├── server/                  # Node.js backend
│   ├── config/             # Configuration
│   │   ├── database.js
│   │   └── setup.js
│   ├── routes/             # API routes
│   │   ├── contestants.js
│   │   └── votes.js
│   └── server.js           # Express server
├── public/                 # Static assets
│   └── svgs/              # Halloween SVGs
├── railway.json           # Railway config
├── nixpacks.toml         # Nixpacks config
└── package.json          # Dependencies
```

## 🔒 Security Features

- ✅ Password-protected admin panel
- ✅ Device fingerprinting for vote tracking
- ✅ SQL injection prevention (prepared statements)
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ One vote per device enforcement

## 🐛 Troubleshooting

### Database Connection Failed (Local)
```bash
# Check MySQL is running
mysql -u root -p

# Create database
mysql -u root -p
CREATE DATABASE halloween_contest;
exit;

# Run setup script
npm run server:setup
```

### CORS Errors
- Verify `FRONTEND_URL` in backend matches frontend URL
- Check both servers are running

### Port Already in Use
```bash
# Kill process on port
lsof -ti:8000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

## 📖 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Quick setup guide
- **[RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)** - Detailed deployment guide

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

MIT License - feel free to use this for your Halloween party! 🎃

## 🙏 Credits

- Halloween SVGs from [SVG Repo](https://www.svgrepo.com)
- Built with React, Node.js, Express, and MySQL
- UI components from Shadcn UI
- Animations powered by React Spring

## 🎉 Happy Halloween! 👻

Made with 💀 and ☕️

---

**Default Admin Password:** `SpookyAdmin2024!`  
⚠️ **IMPORTANT:** Change this in production!

**Questions?** Open an issue on GitHub.

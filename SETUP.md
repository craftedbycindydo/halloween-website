# 🎃 Halloween Costume Contest - Complete Setup Guide

## Overview

A full-stack Halloween contest application with:
- **Frontend**: React + Tailwind CSS + Shadcn UI
- **Backend**: PHP + MySQL
- **Features**: 
  - Animated contestant cards floating freely
  - Device-based voting (one vote per device, can change once)
  - Admin panel for managing contestants and viewing results
  - Spooky floating SVG decorations

## Prerequisites

- **Node.js** 14+ and npm
- **PHP** 7.4+
- **MySQL** 5.7+

## Step 1: Backend Setup

### 1.1 Install MySQL
Make sure MySQL is installed and running on your system.

### 1.2 Create Database
```bash
cd backend
php setup.php
```

This will:
- Create database `halloween_contest`
- Create tables: `contestants`, `votes`
- Set up proper indexes and constraints

### 1.3 Start PHP Server
```bash
cd backend
php -S localhost:8000
```

Backend will be available at: `http://localhost:8000`

## Step 2: Frontend Setup

### 2.1 Install Dependencies
```bash
npm install
```

### 2.2 Start React App
```bash
npm start
```

React app will run on: `http://localhost:3000`

## Step 3: Usage

### For Users

1. **Display Page** (`/`) - View all contestants with animated cards
2. **Vote Page** - Cast your vote:
   - Enter your name
   - Select a contestant
   - Submit vote
   - Can change vote **once** (then locked forever)

### For Admin

1. Navigate to **Admin** page
2. Login with password: `SpookyAdmin2024!`
3. **Add Contestants**:
   - Enter name and costume description
   - Upload image (max 5MB, stored as base64)
   - Images are saved in database
4. **Delete Contestants**: Click trash icon
5. **View Results**: Enter password to see leaderboard

## API Endpoints

### Contestants
- `GET /contestants.php` - Get all contestants
- `POST /contestants.php` - Add contestant (admin)
- `DELETE /contestants.php` - Delete contestant (admin)

### Votes  
- `GET /votes.php` - Get vote counts (public)
- `GET /votes.php?adminPassword=...` - Get all votes (admin)
- `GET /votes.php?checkStatus=1` - Check user's vote status
- `POST /votes.php` - Submit/change vote

## Voting System

### How It Works

1. **Device Fingerprinting**: Creates unique ID from:
   - User Agent
   - Screen resolution
   - Browser language
   - Platform
   - Timezone
   - Canvas fingerprint

2. **Storage**: Device ID stored in:
   - localStorage (frontend)
   - MySQL database (backend)

3. **Rules**:
   - ✅ One vote per device
   - ✅ Can change vote **once**
   - ✅ After changing, vote is **permanently locked**
   - ✅ Works across page refreshes

### Limitations

⚠️ **Will NOT work across**:
- Different browsers (Chrome vs Firefox)
- Incognito/private mode
- Cleared localStorage/cookies
- Different devices

💡 **For stricter control**, implement user authentication.

## Configuration

### Change Admin Password

Edit `backend/config.php`:
```php
define('ADMIN_PASSWORD', 'YourNewPassword');
```

Also update `src/pages/AdminPage.tsx`:
```typescript
const ADMIN_PASSWORD = 'YourNewPassword';
```

### Change Backend URL

If using a different backend port, edit `src/services/api.ts`:
```typescript
const API_BASE = 'http://localhost:YOUR_PORT';
```

### Database Credentials

Edit `backend/config.php`:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'your_password');
define('DB_NAME', 'halloween_contest');
```

## Troubleshooting

### "Failed to fetch contestants"
- ✅ Check backend server is running: `http://localhost:8000/contestants.php`
- ✅ Check MySQL is running
- ✅ Check CORS headers in `backend/config.php`

### "Database connection failed"
- ✅ Verify MySQL credentials in `backend/config.php`
- ✅ Run `php backend/setup.php` again
- ✅ Check MySQL service is running

### "Unauthorized" when adding/deleting
- ✅ Verify admin password matches in both:
  - `backend/config.php`
  - `src/pages/AdminPage.tsx`

### Vote not persisting
- ✅ Check device ID is being sent in headers
- ✅ Check browser console for errors
- ✅ Verify `votes` table exists in database

## Development

### Project Structure
```
halloween-website/
├── backend/
│   ├── config.php           # Database config & utilities
│   ├── setup.php            # Database setup script
│   ├── contestants.php      # Contestants API
│   ├── votes.php            # Votes API
│   └── README.md            # Backend docs
├── src/
│   ├── components/          # React components
│   ├── pages/               # Page components
│   ├── services/            # API service
│   └── types.ts             # TypeScript types
└── public/
    └── svgs/                # Halloween SVGs
```

### Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI, React Spring
- **Backend**: PHP 7.4+, MySQL 5.7+, PDO
- **Storage**: MySQL database + localStorage (device ID only)

## Security Notes

⚠️ **This is for development/local use**

For production:
1. Use HTTPS
2. Implement JWT authentication
3. Hash admin password
4. Use environment variables for secrets
5. Add rate limiting
6. Sanitize all inputs (PDO prepared statements already used)
7. Add CSRF protection
8. Use proper session management

## Features

### Animations
- ✅ 18 floating SVG decorations (pumpkins, skulls, bats, spiders, etc.)
- ✅ Smooth circular/elliptical motion using React Spring
- ✅ Cards float freely across viewport
- ✅ Proper collision avoidance

### Design
- ✅ Dark spooky theme (black + purple gradient)
- ✅ Bright Halloween colors (orange, purple)
- ✅ Transparent navbar with glass effect
- ✅ Responsive design for all screen sizes

### Voting
- ✅ Device-based tracking (localStorage + MySQL)
- ✅ One vote per device
- ✅ Can change vote once
- ✅ Permanent lock after change
- ✅ Real-time vote updates

### Admin
- ✅ Password-protected access
- ✅ Add/delete contestants
- ✅ Upload images (base64 storage)
- ✅ View detailed results
- ✅ Leaderboard display

## License

MIT

## Support

For issues, check:
1. Both servers are running (React on :3000, PHP on :8000)
2. Database is set up correctly
3. CORS is configured properly
4. Admin password matches in both places

Happy Halloween! 🎃👻


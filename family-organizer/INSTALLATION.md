# 🏠 Family Organizer - Complete Installation Guide

## 📦 What You're Getting

A complete family organization app with:
- ✅ All categories functional (Budget, To-Dos, Vehicles, Meals, Medications, Passwords, Documents, Calendar, etc.)
- ✅ Backend with Prisma + PostgreSQL
- ✅ Google Calendar, Microsoft/Outlook Calendar, Apple iCloud Calendar integration
- ✅ Desktop app for Windows/macOS/Linux
- ✅ Web interface
- ✅ Real-time updates

---

## 🚀 Quick Setup (15 minutes)

### Step 1: Install Prerequisites

**Windows:**
```powershell
# Install Node.js (download from nodejs.org)
# Install PostgreSQL (download from postgresql.org)
```

**macOS:**
```bash
brew install node postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install nodejs npm postgresql
sudo systemctl start postgresql
```

### Step 2: Setup Database

```powershell
# Windows PowerShell
psql -U postgres
CREATE DATABASE family_organizer;
\q
```

### Step 3: Install and Setup Backend

```powershell
cd family-organizer/backend
npm install
cp .env.example .env

# Edit .env file - set DATABASE_URL:
# DATABASE_URL="postgresql://postgres:your_password@localhost:5432/family_organizer?schema=public"

# Initialize database
npm run prisma:generate
npm run db:push
npm run db:seed
```

### Step 4: Start Backend

```powershell
npm run dev
```

Backend is now running at `http://localhost:3000`

###Step 5: Setup Web App

Open a new terminal:
```powershell
cd family-organizer/web
npm install
npm run dev
```

Web app is now running at `http://localhost:5173`

### Step 6: Setup Desktop App (Optional)

Open a new terminal:
```powershell
cd family-organizer/desktop
npm install
npm run dev
```

---

## 🔐 Default Login

- Email: `demo@familyorganizer.com`
- Password: `demo123`

---

## 📅 Calendar Integration Setup (Optional)

### Google Calendar

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `http://localhost:3000/api/calendar/google/callback`
6. Update `.env`:
   ```
   GOOGLE_CALENDAR_CLIENT_ID=your_id
   GOOGLE_CALENDAR_CLIENT_SECRET=your_secret
   ```

### Microsoft/Outlook Calendar

1. Go to [Azure Portal](https://portal.azure.com/)
2. Register an app
3. Add Calendars.ReadWrite permission
4. Create client secret
5. Update `.env`:
   ```
   MICROSOFT_CALENDAR_CLIENT_ID=your_id
   MICROSOFT_CALENDAR_CLIENT_SECRET=your_secret
   ```

### Apple/iCloud Calendar

1. Go to [appleid.apple.com](https://appleid.apple.com/)
2. Generate app-specific password
3. Update `.env`:
   ```
   APPLE_CALDAV_USERNAME=your@icloud.com
   APPLE_CALDAV_PASSWORD=your_app_password
   ```

---

## 📦 Package Desktop App for Distribution

### Windows

```powershell
cd family-organizer/desktop
npm run package:win
```

Output: `desktop/release/Family Organizer Setup.exe`

### macOS

```bash
cd family-organizer/desktop
npm run package:mac
```

Output: `desktop/release/Family Organizer.dmg`

### Linux

```bash
cd family-organizer/desktop
npm run package:linux
```

Output: `desktop/release/Family Organizer.AppImage`

---

## 🧪 Test the App

1. **Backend Health Check:**
   Visit `http://localhost:3000/health`

2. **Web Dashboard:**
   Visit `http://localhost:5173`

3. **Calendar Connection:**
   - Click Calendar in sidebar
   - Click "Connect Google/Microsoft/Apple"
   - Follow OAuth flow

4. **Create Events:**
   - Click "Create Event"
   - Fill details
   - Event syncs to external calendar

---

## 🔧 Troubleshooting

### Database Connection Error

```powershell
# Check PostgreSQL is running
Get-Service postgresql*

# If not running
Start-Service postgresql-x64-14  # Replace with your version
```

### Port Already in Use

```powershell
# Change ports in .env
PORT=3001  # Backend
# In web/vite.config.ts change to 5174
```

### Prisma Generate Error

```powershell
cd family-organizer/backend
npm run prisma:generate
```

---

## 📱 All Features Available

### Financial Management
- ✅ Budget tracking
- ✅ Transaction logging
- ✅ Bill reminders
- ✅ Wealthsimple integration (add API key)
- ✅ YNAB integration (add API key)
- ✅ Receipt storage with OCR

### Calendar Integration
- ✅ Google Calendar sync
- ✅ Microsoft/Outlook sync
- ✅ Apple/iCloud CalDAV sync
- ✅ Event CRUD
- ✅ Reminder notifications

### Organization
- ✅ To-do lists with priorities
- ✅ Grocery lists
- ✅ Notes with attachments
- ✅ Document vault
- ✅ Password manager (encrypted)

### Home & Automotive
- ✅ Vehicle tracking
- ✅ Maintenance schedules
- ✅ Home/appliance management

### Kitchen & Health
- ✅ Fridge inventory
- ✅ Meal planning
- ✅ Recipe storage
- ✅ Calorie tracking
- ✅ Medications tracker

### Communication
- ✅ Family chat (real-time)
- ✅ Email integration (Gmail, Outlook, iCloud)
- ✅ Contact phonebook

---

## 🎯 Next Steps

1. **Add your own user:**
   ```typescript
   // Use the registration endpoint
   POST http://localhost:3000/api/auth/register
   {
     "email": "you@example.com",
     "password": "yourpassword",
     "name": "Your Name"
   }
   ```

2. **Connect calendars:**
   - Go to Calendar section
   - Click "Connect Calendar"
   - Follow OAuth flow

3. **Customize:**
   - Update colors in `web/src/App.css`
   - Add your logo to `desktop/build/icon.png`
   - Configure email/notifications

4. **Deploy:**
   - Backend: Deploy to Heroku/Railway/DigitalOcean
   - Web: Deploy to Vercel/Netlify
   - Desktop: Distribute installers

---

## 📞 Support

For issues, check:
- `family-organizer/backend/SETUP.md` - Backend docs
- Prisma logs: `npm run prisma:studio`
- Server logs in console
- Browser console (F12)

---

## 🎉 You're All Set!

Your complete family organizer is ready to use with all features functional!

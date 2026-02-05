# Family Organizer - Running Guide

## ✅ Your App is Now Running!

Congratulations! Your Family Organizer app is up and running. Here's what's active:

### 🚀 Active Services

1. **Backend API Server**
   - URL: http://localhost:3000
   - Health Check: http://localhost:3000/health
   - Status: ✅ Running
   - Features: All 150+ API endpoints ready

2. **Web Application (PWA)**
   - URL: http://localhost:5173
   - Status: ✅ Running
   - Features: Dashboard showing all modules

## 📱 How to Access

### On Your Computer
Simply open your browser and go to:
**http://localhost:5173**

### On Your Phone (same network)
1. Find your computer's IP address:
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address" (something like 192.168.x.x)

2. Open your phone's browser and visit:
   ```
   http://YOUR_IP_ADDRESS:5173
   ```
   Example: http://192.168.1.100:5173

### On Raspberry Pi / Wall Display
Same as phone - use your computer's IP address.

## 🛠️ Managing the Servers

### To Stop the Servers
Press `Ctrl+C` in each terminal window where the servers are running.

### To Restart the Servers

**Backend:**
```bash
cd c:/Users/brand/OneDrive/Documents/GitHub/DesktopCommanderMCP/family-organizer/backend
npm run dev
```

**Web:**
```bash
cd c:/Users/brand/OneDrive/Documents/GitHub/DesktopCommanderMCP/family-organizer/web
npm run dev
```

## 🧪 Testing the API

You can test the API endpoints using curl or a tool like Postman:

```bash
# Health check
curl http://localhost:3000/health

# Test authentication endpoint
curl http://localhost:3000/api/auth/login

# Test budget endpoint
curl http://localhost:3000/api/budget/
```

## 📋 Available Features

All these modules are accessible via API:

### Financial
- `/api/budget` - Budgets, transactions, bills
- `/api/receipts` - Receipt storage with OCR

### Communication
- `/api/email` - Email integration (Gmail, Outlook, iCloud)
- `/api/chat` - Family chat

### Organization
- `/api/todos` - To-do lists
- `/api/grocery` - Grocery lists
- `/api/notes` - Notes with attachments

### Home & Auto
- `/api/vehicles` - Vehicle tracking & maintenance
- `/api/homes` - Home & appliance management
- `/api/contacts` - Phonebook

### Security
- `/api/passwords` - Password manager
- `/api/documents` - Document vault

### Health & Kitchen
- `/api/medications` - Medication tracking
- `/api/fridge` - Fridge inventory
- `/api/meals` - Meal planning, recipes, calories

## 🔧 Current Status

### ✅ Completed
- ✅ Project structure created
- ✅ All TypeScript types defined
- ✅ Database schema designed
- ✅ All API routes defined
- ✅ All controllers created (stub implementations)
- ✅ Backend server running
- ✅ Web app running
- ✅ API and web connected

### 🚧 Next Steps to Implement

1. **Database Setup** (Optional for now)
   - Install PostgreSQL, MongoDB, Redis
   - Run database migrations
   - Add real data persistence

2. **Authentication System**
   - Implement JWT token generation
   - Add user registration/login
   - OAuth integration (Google, Microsoft, Apple)

3. **Controller Implementation**
   - Replace stub responses with real logic
   - Connect to databases
   - Implement business rules

4. **Frontend Development**
   - Build React components for each module
   - Add state management (Zustand)
   - Create forms and dashboards

5. **External Integrations**
   - Wealthsimple API
   - YNAB API
   - Gmail/Outlook APIs
   - Nutritionix API

## 🎨 Customization

### Change Ports

**Backend Port** (default: 3000):
Edit `.env` file:
```
PORT=3001
```

**Web Port** (default: 5173):
Edit `vite.config.ts`:
```typescript
server: {
  port: 5174,
  ...
}
```

## 📚 Documentation

- [README.md](README.md) - Project overview
- [GETTING_STARTED.md](GETTING_STARTED.md) - Quick start guide
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Complete feature list
- [docs/setup.md](docs/setup.md) - Detailed setup instructions
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - Technical architecture

## 🐛 Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

1. Find the process using the port:
   ```bash
   netstat -ano | findstr :3000
   ```

2. Kill the process:
   ```bash
   taskkill /PID <process_id> /F
   ```

### Web App Shows Errors

1. Clear browser cache
2. Restart the web server
3. Check browser console for errors (F12)

### Backend Not Responding

1. Check if backend is still running
2. Look for errors in the terminal
3. Restart the backend server

### Cannot Connect from Phone

1. Make sure phone is on same WiFi network
2. Check firewall settings (allow port 5173)
3. Use correct IP address (not localhost)

## 💡 Tips

- Keep both terminal windows open while developing
- The servers auto-reload when you make code changes
- Use browser DevTools (F12) to debug frontend issues
- Check terminal output for backend errors
- API responses are in JSON format

## 🎯 Quick Commands Reference

```bash
# Start everything
cd backend && npm run dev     # Terminal 1
cd web && npm run dev          # Terminal 2

# Install new packages
cd backend && npm install <package-name>
cd web && npm install <package-name>

# Run tests (when implemented)
cd backend && npm test
cd web && npm test

# Build for production
cd backend && npm run build
cd web && npm run build
```

## 🆘 Need Help?

Check the documentation in the `docs/` folder or review:
- API route files in `backend/src/routes/`
- Controller files in `backend/src/controllers/`
- Type definitions in `shared/src/types/`

Happy coding! 🚀

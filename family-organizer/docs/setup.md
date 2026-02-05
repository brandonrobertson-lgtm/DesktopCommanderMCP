# Family Organizer - Setup Guide

This guide will walk you through setting up the Family Organizer application for development.

## Prerequisites

### Required Software

1. **Node.js** 18+ and npm 9+
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version` and `npm --version`

2. **PostgreSQL** 14+
   - Download from [postgresql.org](https://www.postgresql.org/download/)
   - Verify installation: `psql --version`

3. **MongoDB** 6+
   - Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Verify installation: `mongod --version`

4. **Redis** 7+
   - Download from [redis.io](https://redis.io/download)
   - Windows: Use [Memurai](https://www.memurai.com/) or WSL
   - Verify installation: `redis-cli --version`

### Mobile Development

#### For Android Development:
- **Android Studio** with Android SDK
- **Java Development Kit (JDK)** 11+
- Configure ANDROID_HOME environment variable

#### For iOS Development (macOS only):
- **Xcode** 14+
- **CocoaPods**: `sudo gem install cocoapods`
- Apple Developer Account (for device testing)

### Desktop Development

No additional requirements beyond Node.js.

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd family-organizer
```

### 2. Install Dependencies

```bash
npm run install:all
```

This will install dependencies for all modules (mobile, desktop, web, backend, shared).

### 3. Database Setup

#### PostgreSQL Setup

```bash
# Create database
createdb family_organizer

# Or using psql
psql -U postgres
CREATE DATABASE family_organizer;
\q

# Run schema
psql -U postgres -d family_organizer -f backend/src/database/schema.sql
```

#### MongoDB Setup

MongoDB will create collections automatically on first use. No manual setup needed.

#### Redis Setup

Start Redis server:
```bash
redis-server
```

### 4. Environment Configuration

Copy the example environment file and configure it:

```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in your configuration values:

**Required Configuration:**
- Database credentials (PostgreSQL, MongoDB, Redis)
- JWT secrets (generate strong random strings)
- AWS S3 credentials (for file storage)
- Firebase credentials (for authentication)

**Optional API Keys:**
- Wealthsimple API credentials
- YNAB API key
- Email provider credentials (Gmail, Microsoft, iCloud)
- Nutritionix API credentials
- OAuth provider credentials (Google, Microsoft, Apple)

### 5. API Keys Setup

#### Google OAuth & Gmail API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable APIs:
   - Google+ API
   - Gmail API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback`
   - Your production URLs
6. Copy Client ID and Client Secret to `.env`

#### Microsoft OAuth & Graph API

1. Go to [Azure Portal](https://portal.azure.com/)
2. Register a new application
3. Configure API permissions:
   - Microsoft Graph: User.Read, Mail.Read
4. Create a client secret
5. Copy Application ID, Tenant ID, and Client Secret to `.env`

#### Wealthsimple API

1. Contact Wealthsimple for API access
2. Follow their developer documentation
3. Add credentials to `.env`

#### YNAB API

1. Go to [YNAB Developer Settings](https://app.youneedabudget.com/settings/developer)
2. Create a new personal access token
3. Add to `.env` as `YNAB_API_KEY`

#### Nutritionix API

1. Sign up at [Nutritionix API](https://www.nutritionix.com/business/api)
2. Get your App ID and API Key
3. Add to `.env`

#### AWS S3 Setup

1. Create an AWS account
2. Create an S3 bucket
3. Create an IAM user with S3 permissions
4. Generate access keys
5. Add credentials to `.env`

#### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication
4. Generate a service account key (JSON)
5. Extract credentials and add to `.env`

### 6. Generate Encryption Keys

Generate secure encryption keys for passwords and sensitive data:

```bash
# Generate 32-character encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Add these to your `.env` file.

## Running the Application

### Backend API

```bash
cd backend
npm run dev
```

Server will start on `http://localhost:3000`

### Web Application (PWA)

```bash
cd web
npm run dev
```

Application will be available at `http://localhost:5173`

### Mobile Application

```bash
cd mobile
npm start
```

This will start the Expo development server. You can then:
- Press `a` for Android emulator
- Press `i` for iOS simulator (macOS only)
- Scan QR code with Expo Go app on your phone

### Desktop Application

```bash
cd desktop
npm run dev
```

This will start the Electron app with hot-reload.

## Building for Production

### Backend

```bash
cd backend
npm run build
npm start
```

### Web (PWA)

```bash
cd web
npm run build
npm run preview
```

### Mobile

#### Android APK

```bash
cd mobile
npm run build:android
```

#### iOS IPA

```bash
cd mobile
npm run build:ios
```

### Desktop

#### Windows

```bash
cd desktop
npm run package:win
```

#### macOS

```bash
cd desktop
npm run package:mac
```

#### Linux

```bash
cd desktop
npm run package:linux
```

## Testing

Run tests for all modules:

```bash
npm test
```

Or run tests for individual modules:

```bash
cd backend && npm test
cd mobile && npm test
cd desktop && npm test
cd web && npm test
```

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running: `pg_isready`
- Check MongoDB status: `sudo systemctl status mongod` (Linux) or Activity Monitor (macOS)
- Check Redis status: `redis-cli ping` (should return "PONG")

### Port Conflicts

If default ports are in use, you can change them in `.env`:
- Backend: `PORT=3000`
- Web: Update `vite.config.ts`
- Mobile: Expo CLI will find available ports automatically

### Mobile App Issues

- Clear Expo cache: `expo start -c`
- Clear Metro bundler cache: `react-native start --reset-cache`
- Rebuild native modules: `cd android && ./gradlew clean`

### Desktop App Issues

- Clear Electron cache: `npm run clean`
- Rebuild electron modules: `npm rebuild`

## Development Tips

### Hot Reload

All platforms support hot reload during development:
- Backend: Using nodemon
- Web: Using Vite HMR
- Mobile: Using Expo Fast Refresh
- Desktop: Using electron-reload

### Debugging

#### Backend
- Use VS Code debugger with provided launch configuration
- Or use Chrome DevTools: `node --inspect src/server.ts`

#### Mobile
- Use React Native Debugger
- Or Chrome DevTools via Expo

#### Desktop
- Use Chrome DevTools (Ctrl+Shift+I or Cmd+Option+I)

### Database Migrations

```bash
cd backend
npm run migrate        # Run migrations
npm run migrate:rollback  # Rollback migrations
npm run seed          # Seed database with sample data
```

## Next Steps

1. Configure all required API keys
2. Set up development database with sample data
3. Review security settings before deployment
4. Configure CI/CD pipeline
5. Set up monitoring and logging

For more information, see:
- [API Documentation](./api.md)
- [Architecture Overview](./architecture.md)
- [Deployment Guide](./deployment.md)
- [Contributing Guidelines](./contributing.md)

## Support

For issues and questions:
- Check the [FAQ](./faq.md)
- Open an issue on GitHub
- Contact the development team

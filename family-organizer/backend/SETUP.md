# Family Organizer - Backend Setup

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## Quick Start

1. **Install dependencies:**
   ```bash
   cd family-organizer/backend
   npm install
   ```

2. **Setup environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and API keys
   ```

3. **Initialize database:**
   ```bash
   # Make sure PostgreSQL is running
   npm run prisma:generate
   npm run db:push
   npm run db:seed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

The backend will be available at `http://localhost:3000`

## Calendar Integration Setup

### Google Calendar

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Add to `.env`:
   ```
   GOOGLE_CALENDAR_CLIENT_ID=your_client_id
   GOOGLE_CALENDAR_CLIENT_SECRET=your_secret
   GOOGLE_CALENDAR_REDIRECT_URI=http://localhost:3000/api/calendar/google/callback
   ```

### Microsoft/Outlook Calendar

1. Go to [Azure Portal](https://portal.azure.com/)
2. Register an application
3. Add Calendar.ReadWrite permission
4. Create client secret
5. Add to `.env`:
   ```
   MICROSOFT_CALENDAR_CLIENT_ID=your_client_id
   MICROSOFT_CALENDAR_CLIENT_SECRET=your_secret
   MICROSOFT_CALENDAR_REDIRECT_URI=http://localhost:3000/api/calendar/microsoft/callback
   ```

### Apple/iCloud Calendar

1. Go to [appleid.apple.com](https://appleid.apple.com/)
2. Generate app-specific password
3. Add to `.env`:
   ```
   APPLE_CALDAV_USERNAME=your@icloud.com
   APPLE_CALDAV_PASSWORD=your_app_specific_password
   ```

## Database Schema

Run migrations:
```bash
npm run migrate
```

View database in Prisma Studio:
```bash
npm run prisma:studio
```

## API Documentation

Base URL: `http://localhost:3000/api`

### Calendar Endpoints

- `GET /calendar/google/auth` - Get Google OAuth URL
- `GET /calendar/google/callback` - OAuth callback
- `GET /calendar/microsoft/auth` - Get Microsoft OAuth URL
- `GET /calendar/microsoft/callback` - OAuth callback
- `POST /calendar/apple/connect` - Connect Apple Calendar
- `GET /calendar/accounts` - List calendar accounts
- `GET /calendar/events` - List events
- `POST /calendar/events` - Create event
- `PUT /calendar/events/:id` - Update event
- `DELETE /calendar/events/:id` - Delete event
- `POST /calendar/sync-all` - Sync all calendars

### Budget Endpoints

- `GET /budget` - List budgets
- `POST /budget` - Create budget
- `GET /budget/transactions` - List transactions
- `POST /budget/transactions` - Create transaction
- `GET /budget/bills` - List bills
- `POST /budget/bills` - Create bill

(See other route files for complete API documentation)

## Demo Credentials

- Email: `demo@familyorganizer.com`
- Password: `demo123`

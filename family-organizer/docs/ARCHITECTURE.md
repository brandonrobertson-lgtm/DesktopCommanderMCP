# Family Organizer - Architecture Documentation

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT APPLICATIONS                       │
├─────────────────┬─────────────────┬─────────────────┬───────────┤
│  Mobile App     │  Desktop App    │   Web App       │ Wall      │
│  (iOS/Android)  │  (Win/Mac/Lin)  │   (Browser)     │ Display   │
│                 │                 │                 │ (RPi)     │
│  React Native   │  Electron       │   React + PWA   │ PWA       │
│  + Expo         │  + React        │   + Vite        │           │
└────────┬────────┴────────┬────────┴────────┬────────┴─────┬─────┘
         │                 │                 │              │
         └─────────────────┴─────────────────┴──────────────┘
                                  │
                     HTTPS/WSS (Secure Connection)
                                  │
         ┌────────────────────────┴────────────────────────┐
         │                                                  │
┌────────▼─────────────────────────────────────────────────▼────┐
│                     API GATEWAY / LOAD BALANCER                │
│                         (CloudFlare / Nginx)                   │
└────────┬──────────────────────────────────────────────────────┘
         │
┌────────▼──────────────────────────────────────────────────────┐
│                      BACKEND SERVER (Node.js)                  │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              Express.js REST API Server                  │ │
│  │  - Authentication (JWT + OAuth)                          │ │
│  │  - Authorization & Role-based Access                     │ │
│  │  - Rate Limiting & Security                              │ │
│  │  - Request Validation (Zod)                              │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              Socket.io WebSocket Server                  │ │
│  │  - Real-time family chat                                 │ │
│  │  - Live notifications                                    │ │
│  │  - Collaborative editing                                 │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                   Business Logic Layer                   │ │
│  │                                                          │ │
│  │  Controllers:                                            │ │
│  │  ├── AuthController      ├── VehicleController          │ │
│  │  ├── BudgetController    ├── HomeController             │ │
│  │  ├── EmailController     ├── ContactController          │ │
│  │  ├── TodoController      ├── PasswordController         │ │
│  │  ├── GroceryController   ├── DocumentController         │ │
│  │  ├── ReceiptController   ├── ChatController             │ │
│  │  ├── MedicationController├── FridgeController            │ │
│  │  ├── MealController      └── NoteController             │ │
│  │                                                          │ │
│  │  Services:                                               │ │
│  │  ├── WealthsimpleService ├── EncryptionService          │ │
│  │  ├── YNABService         ├── OCRService                 │ │
│  │  ├── GmailService        ├── NotificationService        │ │
│  │  ├── MicrosoftService    ├── FileStorageService         │ │
│  │  ├── NutritionixService  └── CronJobService             │ │
│  └──────────────────────────────────────────────────────────┘ │
└────┬──────────────┬──────────────┬───────────────┬────────────┘
     │              │              │               │
     │              │              │               │
┌────▼────┐  ┌─────▼──────┐  ┌───▼────┐  ┌───────▼────────┐
│PostgreSQL│  │  MongoDB   │  │ Redis  │  │  AWS S3        │
│         │  │            │  │        │  │  File Storage  │
│Relational│  │ Documents  │  │ Cache  │  │  - Images      │
│  Data    │  │ & Files    │  │Session │  │  - Documents   │
│         │  │            │  │Queue   │  │  - Receipts    │
└─────────┘  └────────────┘  └────────┘  └────────────────┘

         External API Integrations
         ┌────────────────────────────┐
         │  ├── Wealthsimple API      │
         │  ├── YNAB API              │
         │  ├── Gmail API             │
         │  ├── Microsoft Graph API   │
         │  ├── iCloud API            │
         │  ├── Nutritionix API       │
         │  ├── OpenFoodFacts API     │
         │  ├── Firebase Auth         │
         │  └── Google/MS/Apple OAuth │
         └────────────────────────────┘
```

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Language**: TypeScript 5.x
- **Authentication**: JWT + Passport.js (OAuth 2.0)
- **Real-time**: Socket.io 4.x
- **Validation**: Zod
- **ORM**: Knex.js (query builder)
- **File Upload**: Multer
- **Image Processing**: Sharp
- **OCR**: Tesseract.js
- **Task Scheduling**: node-cron
- **Logging**: Winston

### Databases
- **PostgreSQL 14+**: Primary relational database
  - User data, budgets, transactions
  - Vehicles, homes, appliances
  - Medications, contacts
  - Structured data with relationships

- **MongoDB 6+**: Document storage
  - Emails (cached)
  - Chat messages (archive)
  - Large JSON documents

- **Redis 7+**: Caching & session storage
  - Session management
  - Real-time message queues
  - API rate limiting
  - Temporary data caching

### Storage
- **AWS S3**: Object storage
  - User avatars
  - Receipt images
  - Document files
  - Meal photos
  - Fridge item photos

### Mobile (iOS & Android)
- **Framework**: React Native 0.73
- **Build Tool**: Expo 50
- **Navigation**: React Navigation 6.x
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **UI Components**: React Native Paper
- **Charts**: React Native Chart Kit
- **Icons**: Expo Vector Icons
- **Camera**: Expo Camera
- **Storage**: AsyncStorage + SecureStore

### Desktop (Windows, macOS, Linux)
- **Framework**: Electron 28
- **Renderer**: React 18
- **Bundler**: Vite 5
- **State Management**: Zustand
- **Auto-update**: electron-updater
- **Local Storage**: electron-store

### Web (PWA)
- **Framework**: React 18
- **Bundler**: Vite 5
- **Router**: React Router 6
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **PWA**: vite-plugin-pwa
- **Animations**: Framer Motion

## Data Flow

### Authentication Flow

```
1. User Login Request
   ↓
2. Client → POST /api/auth/login (email, password)
   ↓
3. Server validates credentials
   ↓
4. Generate JWT access token (7 days)
   ↓
5. Generate refresh token (30 days)
   ↓
6. Return tokens + user data
   ↓
7. Client stores tokens securely
   ↓
8. Client includes token in headers for all requests:
   Authorization: Bearer <access_token>
```

### OAuth Flow (Google/Microsoft/Apple)

```
1. User clicks "Sign in with Google"
   ↓
2. Client → GET /api/auth/google
   ↓
3. Server redirects to Google OAuth consent screen
   ↓
4. User grants permission
   ↓
5. Google redirects back with auth code
   ↓
6. Server exchanges code for access token
   ↓
7. Server fetches user profile from Google
   ↓
8. Server creates/updates user in database
   ↓
9. Server generates JWT tokens
   ↓
10. Client stores tokens and redirects to app
```

### Budget Transaction Flow

```
1. User creates transaction
   ↓
2. Client → POST /api/budget/transactions
   ↓
3. Server validates data (Zod schema)
   ↓
4. Server checks user authorization
   ↓
5. Insert transaction into database
   ↓
6. Update budget spent amount
   ↓
7. Check if bill payment
   ↓
8. Send notification to family members
   ↓
9. Return transaction data
   ↓
10. Client updates UI
```

### Real-time Chat Flow

```
1. User sends message
   ↓
2. Client → Socket.io emit('send_message')
   ↓
3. Server receives message
   ↓
4. Server validates and stores in database
   ↓
5. Server emits to all family members
   ↓
6. Clients receive 'new_message' event
   ↓
7. UI updates in real-time
   ↓
8. Send push notification to offline users
```

### File Upload Flow (Receipt)

```
1. User takes/selects photo
   ↓
2. Client → POST /api/receipts (multipart/form-data)
   ↓
3. Multer middleware processes file
   ↓
4. Sharp resizes/optimizes image
   ↓
5. Upload to AWS S3
   ↓
6. Run Tesseract OCR to extract text
   ↓
7. Parse receipt data (vendor, amount, items)
   ↓
8. Save receipt + OCR data to database
   ↓
9. Return receipt URL and parsed data
   ↓
10. Client displays receipt with extracted info
```

## Security Architecture

### Authentication & Authorization

1. **JWT Tokens**
   - Access tokens (7 days)
   - Refresh tokens (30 days)
   - Signed with HS256 algorithm
   - Stored in SecureStore (mobile) / httpOnly cookies (web)

2. **OAuth 2.0**
   - Google OAuth 2.0
   - Microsoft OAuth 2.0
   - Apple Sign In
   - Secure token exchange

3. **Password Security**
   - Bcrypt hashing (10 rounds)
   - Password strength validation
   - Rate limiting on login attempts

4. **Role-Based Access Control (RBAC)**
   - Admin: Full access
   - Parent: Most features
   - Child: Limited access
   - Guest: Read-only

### Data Encryption

1. **In Transit**
   - HTTPS/TLS 1.3 for all API calls
   - WSS (WebSocket Secure) for real-time

2. **At Rest**
   - Password manager: AES-256-GCM encryption
   - Documents: Optional encryption
   - Database: Encrypted at rest (AWS RDS)
   - S3: Server-side encryption

3. **Sensitive Data**
   - Passwords: Zero-knowledge encryption
   - Credit cards: Never stored (use Stripe/tokenization)
   - SSN/Tax IDs: AES-256 encryption

### Security Measures

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Zod schemas on all inputs
- **SQL Injection**: Parameterized queries only
- **XSS Protection**: Content Security Policy headers
- **CSRF Protection**: CSRF tokens on state-changing requests
- **Helmet.js**: Security headers
- **CORS**: Whitelist allowed origins

## Database Schema Design

### Key Tables

#### Users & Families
- `users` - User accounts
- `families` - Family groups
- `oauth_providers` - OAuth linked accounts

#### Financial
- `budgets` - Budget categories
- `transactions` - Income/expenses
- `bills` - Recurring bills
- `receipts` - Receipt storage with OCR

#### Organization
- `todo_lists` + `todo_items`
- `grocery_lists` + `grocery_items`
- `contacts` - Phonebook
- `notes` + `note_folders`

#### Automotive
- `vehicles` - Family vehicles
- `vehicle_maintenance` - Service records
- `maintenance_schedules` - Recurring maintenance

#### Home
- `homes` - Properties
- `appliances` - Appliances per home
- `appliance_maintenance` - Service records

#### Storage
- `password_entries` + `password_folders` - Encrypted passwords
- `documents` + `document_folders` - File storage

#### Communication
- `chat_messages` - Family chat
- `email_accounts` - Connected email accounts

#### Health & Food
- `medications` + `medication_logs`
- `fridge_items` - Inventory
- `recipes` - Recipe collection
- `meal_plans` - Meal calendar
- `calorie_logs` - Food tracking
- `food_database` - Nutrition data

#### System
- `notifications` - User notifications

### Indexing Strategy

- Primary keys: UUID (better distribution than serial)
- Foreign keys: Indexed for JOIN performance
- Frequently queried columns: `family_id`, `user_id`, `date`
- Text search: Consider PostgreSQL full-text search for notes/documents

## API Design Principles

### RESTful Conventions

- `GET /api/resource` - List resources
- `GET /api/resource/:id` - Get single resource
- `POST /api/resource` - Create resource
- `PATCH /api/resource/:id` - Update resource
- `DELETE /api/resource/:id` - Delete resource

### Response Format

```json
{
  "success": true,
  "data": { },
  "message": "Operation successful"
}
```

Error format:
```json
{
  "success": false,
  "error": "Validation error",
  "message": "Invalid input data",
  "details": { }
}
```

### Pagination

```json
{
  "items": [],
  "total": 100,
  "page": 1,
  "pageSize": 20,
  "hasMore": true
}
```

## Scalability Considerations

### Horizontal Scaling

- **Stateless API**: No session state on servers
- **Load Balancer**: Nginx or CloudFlare
- **Redis Sessions**: Shared session storage
- **Database**: Read replicas for scaling reads

### Caching Strategy

1. **Redis Cache**
   - User sessions
   - Frequently accessed data
   - Real-time counters

2. **Client-side Cache**
   - AsyncStorage (mobile)
   - LocalStorage (web)
   - IndexedDB for large datasets

3. **CDN**
   - Static assets
   - Images via CloudFlare

### Performance Optimization

- **Database Queries**: Use indexes, avoid N+1 queries
- **Lazy Loading**: Pagination on large lists
- **Image Optimization**: Sharp for resizing/compression
- **Bundle Splitting**: Code splitting on web/desktop
- **Compression**: Gzip/Brotli on API responses

## Deployment Architecture

### Backend Deployment

**Option 1: AWS**
- EC2 instances (or ECS containers)
- RDS for PostgreSQL
- DocumentDB for MongoDB
- ElastiCache for Redis
- S3 for file storage
- CloudFront CDN
- Route 53 DNS

**Option 2: Heroku**
- Heroku Dynos
- Heroku PostgreSQL
- Heroku Redis
- MongoDB Atlas
- AWS S3

**Option 3: Docker + VPS**
- Docker Compose
- Self-hosted PostgreSQL
- Self-hosted MongoDB
- Self-hosted Redis

### Mobile Deployment

- **iOS**: TestFlight → App Store
- **Android**: Internal testing → Play Store
- **Over-the-air updates**: Expo Updates

### Desktop Deployment

- **Windows**: NSIS installer → Website/GitHub Releases
- **macOS**: DMG → Website/Mac App Store
- **Linux**: AppImage/deb/rpm → Website

### Web Deployment

- **Hosting**: Vercel, Netlify, or CloudFlare Pages
- **PWA**: Automatic service worker via vite-plugin-pwa
- **SSL**: Automatic via hosting provider

## Monitoring & Observability

### Logging

- **Winston**: Structured logging
- **Log Levels**: error, warn, info, debug
- **Log Aggregation**: CloudWatch, Datadog, or LogDNA

### Metrics

- API response times
- Database query performance
- Error rates
- User activity

### Alerts

- Server down
- Database connection failures
- High error rates
- Disk space warnings

## Disaster Recovery

### Backup Strategy

- **Database**: Daily automated backups (7-day retention)
- **S3 Files**: Versioning enabled
- **Config**: Store in Git (secrets in environment)

### Recovery Plan

1. Restore database from backup
2. Restore S3 files
3. Redeploy application
4. Verify data integrity
5. Resume normal operations

## Future Enhancements

### Phase 2 Features
- Voice commands (Alexa/Google Home)
- AI meal suggestions
- Smart shopping list (from recipes)
- Receipt auto-categorization (ML)
- Predictive maintenance alerts

### Phase 3 Features
- Family calendar integration
- Chore assignment & tracking
- Allowance management
- Pet tracking
- Plant care reminders

### Technical Improvements
- GraphQL API option
- Microservices architecture
- Kubernetes deployment
- Machine learning integrations
- Blockchain for secure document verification

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

MIT License - See [LICENSE](../LICENSE) for details.

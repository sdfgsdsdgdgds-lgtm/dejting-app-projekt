# Dating & Matching Application

A full-featured dating and matching platform with real-time chat, profile browsing, and comprehensive admin tools.

## Features

### User Features
- **User Registration & Authentication** - Secure login with Replit Auth
- **Profile Management** - Create and customize your profile with photos, bio, age, location, and interests
- **Smart Matching** - Browse other users and express interest with likes
- **Automatic Matching** - When two users like each other, they automatically match
- **Real-time Chat** - Instant messaging with matches using WebSocket connections
- **Match Management** - View all your matches in one place

### Admin Features
- **Dashboard** - Overview of platform statistics and activity
- **User Management** - View and monitor all registered users
- **Likes Overview** - Track user engagement and preferences
- **Match Analytics** - Monitor successful matches
- **Message Monitoring** - Review chat activity across the platform
- **Activity Logs** - Complete audit trail of all user actions

## Technology Stack

### Frontend
- **React** with TypeScript for type-safe UI components
- **Wouter** for client-side routing
- **TailwindCSS** for modern, responsive styling
- **Shadcn UI** for beautiful, accessible components
- **React Query** for efficient data fetching and caching
- **WebSocket** for real-time chat functionality

### Backend
- **Express.js** for RESTful API endpoints
- **PostgreSQL** with Drizzle ORM for reliable data persistence
- **Replit Auth** for secure authentication
- **WebSocket Server** for real-time messaging
- **Session Management** with connect-pg-simple

### Database Schema
- `users` - User accounts with authentication details
- `profiles` - User profiles with personal information
- `likes` - User preferences and interactions
- `matches` - Successful mutual likes
- `messages` - Chat history between matched users
- `activity_logs` - Comprehensive audit trail

## Local Development

### Prerequisites
- Node.js 16+
- PostgreSQL database

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_random_secret_key
   ```

3. Push database schema:
   ```bash
   npm run db:push
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Access the application at `http://localhost:5000`

### Create Admin User
After registering a user, run this SQL to grant admin access:
```sql
UPDATE users SET "isAdmin" = true WHERE email = 'your-email@example.com';
```

## Deployment

This application is optimized for deployment on Render.com with PostgreSQL.

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete deployment instructions including:
- Setting up PostgreSQL database
- Configuring environment variables
- Deploying the web service
- Post-deployment setup
- Troubleshooting tips

## API Endpoints

### Authentication
- `GET /api/auth/user` - Get current user

### Profiles
- `PATCH /api/profile` - Update profile
- `GET /api/profiles` - Browse profiles

### Likes & Matches
- `POST /api/likes` - Like a user
- `GET /api/matches` - Get user matches
- `GET /api/matches/:id` - Get match details
- `GET /api/matches/:id/messages` - Get match messages

### Messages
- `POST /api/messages` - Send a message
- `WS /ws` - WebSocket connection for real-time chat

### Admin (Requires Admin Role)
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - All users
- `GET /api/admin/likes` - All likes
- `GET /api/admin/matches` - All matches
- `GET /api/admin/messages` - All messages
- `GET /api/admin/activity` - Activity logs

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and configurations
│   │   └── pages/         # Page components
│   └── index.html
├── server/                # Backend Express application
│   ├── db.ts             # Database connection
│   ├── replitAuth.ts     # Authentication setup
│   ├── storage.ts        # Database operations
│   └── routes.ts         # API endpoints
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema and types
└── DEPLOYMENT.md         # Deployment guide
```

## Security Features

- Secure authentication with Replit Auth
- Session-based authorization
- Role-based access control for admin features
- CSRF protection
- Secure WebSocket connections
- Activity logging for audit trails

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT

## Support

For deployment issues, see [DEPLOYMENT.md](./DEPLOYMENT.md).
For feature requests or bugs, please open an issue in the repository.

---

Built with ❤️ using modern web technologies

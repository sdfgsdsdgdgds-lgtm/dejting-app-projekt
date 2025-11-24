# Dating & Matching Application

## Overview

This is a full-featured dating and matching platform built with React and Express. The application allows users to create profiles, browse other users, express interest through likes, and chat with matches in real-time. It includes comprehensive admin tools for monitoring platform activity and managing users.

The platform follows modern dating app patterns inspired by industry leaders like Tinder and Bumble, with a photo-first approach, card-based interactions, and real-time messaging capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Routing**
- React with TypeScript for type-safe component development
- Wouter for lightweight client-side routing
- Vite as the build tool and development server

**State Management**
- React Query (TanStack Query) for server state management, caching, and data fetching
- React hooks for local component state
- No global state management library - server state handled by React Query

**UI Framework**
- TailwindCSS for utility-first styling with custom design tokens
- Shadcn UI component library built on Radix UI primitives
- Custom theme system using CSS variables for light/dark mode support
- Design inspired by modern dating apps (Tinder, Bumble, Hinge)

**Real-time Communication**
- WebSocket client for real-time chat messaging
- Automatic reconnection and message syncing

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and REST API
- Node.js HTTP server for production
- Vite middleware integration for development

**API Design**
- RESTful endpoints for CRUD operations
- WebSocket server for real-time messaging
- Session-based authentication middleware
- Activity logging on all major actions

**Data Layer**
- Drizzle ORM for type-safe database queries
- PostgreSQL for data persistence (via Neon serverless driver)
- Schema-first design with Zod validation

### Authentication & Authorization

**Authentication Strategy**
- Replit Auth using OpenID Connect (OIDC)
- Passport.js for auth middleware integration
- Session management with connect-pg-simple for PostgreSQL-backed sessions
- Secure session cookies with httpOnly and secure flags

**Authorization Levels**
- Regular users: Can browse profiles, like users, chat with matches
- Admin users: Full access to dashboard, user management, and analytics
- Middleware guards: `isAuthenticated` and `isAdmin` protect routes

### Database Schema

**Core Tables**
- `users` - User accounts with profile data (email, name, bio, interests, profile image)
- `profiles` - Extended profile information (embedded in users table)
- `likes` - User-to-user like relationships with indexes on both user IDs
- `matches` - Mutual like relationships (created automatically when both users like each other)
- `messages` - Chat messages between matched users with sender/receiver references
- `sessions` - PostgreSQL-backed session storage for authentication
- `activity_logs` - Comprehensive audit trail of all user actions

**Key Design Decisions**
- UUID primary keys for all tables (using PostgreSQL `gen_random_uuid()`)
- Cascade deletes on foreign keys to maintain referential integrity
- Timestamps on all records for audit trails
- Array type for interests (PostgreSQL native array)
- Indexes on frequently queried columns (user IDs in likes, matches, messages)

### Real-time Features

**WebSocket Implementation**
- Dedicated WebSocket server running alongside Express HTTP server
- User-to-match room isolation (messages only sent to participants)
- Automatic client reconnection with exponential backoff
- Message persistence to database before WebSocket broadcast

**Message Flow**
1. Client sends message via REST API POST
2. Server validates user is part of match
3. Message saved to database
4. WebSocket broadcast to both users in match
5. React Query cache invalidated on receiving client

### File Structure

**Client Organization**
- `/client/src/pages` - Route components (landing, home, profile, matches, chat, admin)
- `/client/src/components` - Reusable UI components (mostly Shadcn UI)
- `/client/src/hooks` - Custom React hooks (useAuth, useToast, use-mobile)
- `/client/src/lib` - Utilities (queryClient, authUtils, cn helper)

**Server Organization**
- `/server/routes.ts` - API endpoint definitions and WebSocket setup
- `/server/storage.ts` - Database abstraction layer with all CRUD operations
- `/server/db.ts` - Database connection configuration
- `/server/replitAuth.ts` - Authentication setup and middleware
- `/server/app.ts` - Express app configuration

**Shared Code**
- `/shared/schema.ts` - Database schema definitions shared between client and server
- Drizzle schema exports used for TypeScript types across the stack

### Build & Deployment

**Development**
- `npm run dev` - Runs Vite dev server with HMR and Express API
- TypeScript compilation checked separately (no emit)
- Dev-only plugins: Replit cartographer, dev banner, runtime error overlay

**Production**
- `npm run build` - Vite builds client, esbuild bundles server
- Client assets output to `dist/public`
- Server bundle output to `dist/index.js`
- Static file serving from Express in production
- Environment variables for DATABASE_URL, SESSION_SECRET, NODE_ENV

**Deployment Target**
- Designed for Render.com deployment
- PostgreSQL database provisioned separately
- Environment variables configured in Render dashboard
- Automatic builds from Git repository

## External Dependencies

### Database
- **PostgreSQL** - Primary database (via Neon serverless)
- Connection pooling with `@neondatabase/serverless`
- Drizzle ORM for queries and migrations
- Session store backed by PostgreSQL

### Authentication
- **Replit Auth** - OIDC provider for user authentication
- OpenID Connect discovery and token management
- Requires `ISSUER_URL` and `REPL_ID` environment variables

### Third-party Libraries

**UI Components**
- Radix UI primitives (accordion, dialog, dropdown, popover, etc.)
- Inter and DM Sans fonts from Google Fonts
- Lucide React for icons

**Data Fetching**
- TanStack React Query for server state
- Native fetch API for HTTP requests

**Form Management**
- React Hook Form with Zod resolvers for validation
- Zod schemas for runtime type checking

**Styling**
- TailwindCSS with custom configuration
- Class Variance Authority for component variants
- clsx and tailwind-merge for conditional classes

**Real-time**
- `ws` library for WebSocket server
- Native WebSocket API on client

**Session Management**
- `express-session` for session middleware
- `connect-pg-simple` for PostgreSQL session store

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Secret for session encryption (32+ characters)
- `NODE_ENV` - Environment (development/production)
- `ISSUER_URL` - Replit OIDC issuer URL (defaults to https://replit.com/oidc)
- `REPL_ID` - Replit application ID
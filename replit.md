# BoK Pharm - Pharmacy Delivery PWA

## Overview

BoK Pharm is a Progressive Web Application (PWA) that enables customers to search for over-the-counter (OTC) medications from nearby pharmacies and place orders with delivery. The platform connects three user types: customers who search and order medications, pharmacy partners who manage inventory and fulfill orders, and delivery partners who transport orders from pharmacies to customers. An admin dashboard provides oversight of all platform operations.

The application is built as a mobile-first PWA following design patterns from successful delivery platforms like UberEats and Bolt Food, combined with healthcare-appropriate Material Design principles for credibility and clarity.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- Mobile-first responsive design using Tailwind CSS

**Component Library:**
- Radix UI primitives for accessible, unstyled components
- shadcn/ui component system with custom theming
- Custom components for domain-specific features (PharmacyCard, MedicationCard, OrderStatusTimeline, etc.)

**State Management:**
- TanStack Query (React Query) for server state synchronization and caching
- Local React state (useState, useEffect) for UI state
- Firebase Auth state managed through custom `useFirebaseAuth` hook

**Design System:**
- Inter font family as primary typeface
- Uber Eats-inspired "BoK Pharm" stacked logo branding
- Tailwind-based spacing scale and component styling
- Light/dark theme support with CSS custom properties

### Backend Architecture

**Hybrid Node.js + Python Architecture:**
- **Node.js Proxy Server (Port 5000):** Express-based proxy that forwards `/api` requests to Python backend
- **Python Flask Server (Port 5001):** Handles all business logic, database operations, and API endpoints
- **Rationale:** Leverages Python's strengths for data processing and API development while maintaining Node.js for frontend tooling

**API Routes (Python Flask):**
- `/api/health` - Health check endpoint
- `/api/medications` - OTC medication catalog (GET/POST)
- `/api/pharmacies` - Pharmacy directory (GET/POST)
- `/api/inventory` - Inventory management (CRUD operations)
- `/api/auth/user` - Current user retrieval
- `/api/auth/sync-user` - Firebase to Supabase user synchronization
- `/api/auth/setup-pharmacy` - Pharmacy onboarding and assignment

**Authentication Flow:**
1. Client authenticates with Firebase (Google/Facebook OAuth)
2. Client receives Firebase ID token
3. Token sent in Authorization header to Python backend
4. Python backend verifies token using Firebase Admin SDK
5. User data synchronized to Supabase database
6. Subsequent requests include Firebase ID token for authorization

**Database Schema (Supabase PostgreSQL):**
- `users` - User profiles with role-based access (customer, pharmacy, delivery, admin)
- `pharmacies` - Pharmacy locations with geospatial data and onboarding status
- `medications` - OTC medication catalog with validation (`isOTC` field enforced)
- `inventory` - Stock levels linking pharmacies to medications with pricing
- `sessions` - Express session storage via connect-pg-simple

**OTC Medication Validation:**
- Schema-level validation using Zod ensures only OTC medications can be added
- `isOTC: true` required for all medications
- `requiresPrescription: false` enforced at database level

### External Dependencies

**Authentication:**
- **Firebase Authentication** - Social login (Google, Facebook) with JWT-based session management
- Firebase Admin SDK for server-side token verification
- Client SDK for OAuth flows and session persistence

**Database:**
- **Supabase** - Managed PostgreSQL database with REST API
- Supabase JavaScript client for database operations
- Service key authentication for backend operations

**Development Tools:**
- **Drizzle ORM** - Type-safe database schema and migrations (configured but migration to Python in progress)
- **Drizzle Kit** - Schema introspection and migration tooling

**UI & Styling:**
- **Tailwind CSS** - Utility-first styling framework
- **Radix UI** - Headless component primitives for accessibility
- **Lucide React** - Icon library
- **React Icons** - Social media icons (Facebook, Google)

**Form Handling:**
- React Hook Form with Zod resolver for type-safe form validation
- Zod schemas for runtime type checking

**HTTP & Networking:**
- Axios-free fetch-based API client
- http-proxy-middleware for Node.js proxy routing

**PWA Support:**
- Manifest.json for installable PWA experience
- Service worker registration (configured)
- Mobile viewport optimization

**Environment Configuration:**
- dotenv for environment variable management
- Separate `.env` for local development
- Firebase and Supabase credentials stored as environment variables

### Key Architectural Decisions

**Why Firebase + Supabase:**
Firebase provides robust authentication with social login support, while Supabase offers a full PostgreSQL database with better relational data modeling. This combination provides best-of-breed solutions for auth and data persistence.

**Why Python Backend:**
Python Flask was chosen for the backend to provide cleaner API route handling and better integration with data processing libraries if needed for future analytics features. The Node.js proxy maintains compatibility with existing Vite tooling.

**Why Drizzle (Partial Implementation):**
Drizzle ORM is configured for type-safe schema definitions and PostgreSQL migrations. The migration from Node.js/Drizzle to Python/Supabase client is in progress, with schema definitions still maintained in TypeScript for type safety on the frontend.

**Mobile-First PWA Approach:**
The application prioritizes mobile experience with bottom navigation, touch-friendly components, and responsive layouts that adapt to desktop screens. Progressive Web App features enable installation and offline capability.

**OTC-Only Restriction:**
The platform restricts to OTC medications only to avoid regulatory complexity around prescription handling, ensuring legal compliance and simpler user flows without prescription verification requirements.
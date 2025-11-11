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
- **Python FastAPI Server (Port 5001):** Modern async Python framework handling all business logic, database operations, and API endpoints
- **Rationale:** FastAPI provides automatic OpenAPI documentation, async support, type validation with Pydantic, and better performance than Flask

**API Routes (Python FastAPI):**
- `/api/health` - Health check endpoint
- `/api/medications` - OTC medication catalog (GET, GET by ID)
- `/api/pharmacies` - Pharmacy directory (GET, GET by ID)
- `/api/cart` - Shopping cart management (GET, POST, PATCH, DELETE)
- `/api/cart/add` - Add medication to cart
- `/api/cart/items/{item_id}` - Update or delete cart item
- `/api/auth/user` - Current user retrieval (authenticated)
- `/api/auth/sync-user` - Firebase to Supabase user synchronization
- `/api/google-maps-api-key` - Google Maps API key for frontend

**Authentication Flow:**
1. Client authenticates with Firebase (Google/Facebook OAuth)
2. Client receives Firebase ID token
3. Token sent in Authorization header to Python backend
4. Python backend verifies token using Firebase Admin SDK
5. User data synchronized to Supabase database
6. Subsequent requests include Firebase ID token for authorization

**Database Schema (Supabase PostgreSQL):**
- `user` - User profiles with Firebase UID, role-based access (customer, pharm, admin, delivery)
- `pharmacy` - Pharmacy locations with geospatial data (lat/lng), license verification, opening hours
- `medication` - OTC medication catalog with pricing, category, dosage information
- `order` - Customer orders with status tracking (created, pending, confirmed, dispatched, delivered, cancelled, completed)
- `order_item` - Line items for orders with medication details and pricing
- `cart` - User shopping carts
- `cart_item` - Cart line items with medication details and quantities

**OTC Medication Validation:**
- Schema-level validation using Zod ensures only OTC medications can be added
- `isOTC: true` required for all medications
- `requiresPrescription: false` enforced at database level

### External Dependencies

**Authentication:**
- **Firebase Authentication** - Social login (Google, Facebook) with JWT-based session management
- Firebase Admin SDK for server-side token verification in FastAPI
- Client SDK for OAuth flows and session persistence
- All protected endpoints verify Firebase ID tokens before processing requests

**Database:**
- **Supabase** - Managed PostgreSQL database with REST API
- Supabase JavaScript client for database operations
- Service key authentication for backend operations

**Development Tools:**
- **SQLModel** - Pydantic-based ORM for type-safe database operations
- **Uvicorn** - ASGI server for running FastAPI applications
- **FastAPI** - Modern Python web framework with automatic API documentation

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

**Maps & Geocoding:**
- **Google Maps Places API** - Address autocomplete for delivery addresses
- **Google Geocoding API** - Convert addresses to latitude/longitude coordinates
- Custom AddressAutocomplete component for seamless integration

**Environment Configuration:**
- dotenv for environment variable management
- Replit Secrets for secure credential storage
- Required environment variables:
  - `VITE_FIREBASE_API_KEY` - Firebase web API key
  - `VITE_FIREBASE_APP_ID` - Firebase application ID
  - `VITE_FIREBASE_PROJECT_ID` - Firebase project ID
  - `SUPABASE_URL` - Supabase project URL
  - `SUPABASE_SERVICE_KEY` - Supabase service role key
  - `GOOGLE_MAPS_API_KEY` - Google Maps API key for Places/Geocoding

### Key Architectural Decisions

**Why Firebase + Supabase:**
Firebase provides robust authentication with social login support, while Supabase offers a full PostgreSQL database with better relational data modeling. This combination provides best-of-breed solutions for auth and data persistence.

**Why FastAPI Backend:**
FastAPI was chosen for the backend to provide async performance, automatic API documentation (OpenAPI/Swagger), type safety with Pydantic models, and superior developer experience. The async capabilities enable better scalability for real-time features like order tracking. The Node.js proxy maintains compatibility with existing Vite tooling.

**Why SQLModel:**
SQLModel combines Pydantic for data validation with SQLAlchemy for database operations, providing a unified type-safe approach to data modeling. Models are defined once and used for both API validation and database operations, reducing code duplication and ensuring consistency.

**Mobile-First PWA Approach:**
The application prioritizes mobile experience with bottom navigation, touch-friendly components, and responsive layouts that adapt to desktop screens. Progressive Web App features enable installation and offline capability.

**OTC-Only Restriction:**
The platform restricts to OTC medications only to avoid regulatory complexity around prescription handling, ensuring legal compliance and simpler user flows without prescription verification requirements.
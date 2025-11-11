# Design Guidelines: MedConnect Nigeria - Pharmacy Delivery PWA

## Design Approach

**Hybrid Approach**: Drawing from successful delivery platforms (UberEats, Lieferando, Bolt Food) for the ordering experience, combined with Material Design principles for healthcare-appropriate structure and trust.

**Core Philosophy**: Clean, efficient, mobile-first design that prioritizes speed and clarity for urgent medication needs while maintaining professional healthcare credibility.

---

## Typography

**Font Family**: 
- Primary: Inter (via Google Fonts CDN)
- System fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI'

**Scale**:
- Hero/Page Headers: text-3xl font-bold (30px)
- Section Headers: text-2xl font-semibold (24px)
- Card Titles: text-lg font-semibold (18px)
- Body Text: text-base (16px)
- Small Text/Labels: text-sm (14px)
- Captions: text-xs (12px)

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Tight spacing: p-2, gap-2
- Standard spacing: p-4, gap-4, m-6
- Section spacing: py-8, py-12, py-16
- Large spacing: mb-24

**Container Widths**:
- Mobile-first: Full width with px-4
- Desktop max-width: max-w-7xl mx-auto
- Form containers: max-w-md mx-auto
- Dashboard content: max-w-6xl mx-auto

---

## Component Library

### Navigation
**Customer App Header**:
- Fixed top navigation with search bar prominence
- Logo left, search center (desktop), profile/cart right
- Mobile: Hamburger menu, search icon, cart badge
- Bottom navigation bar (mobile): Home, Orders, Search, Profile

**Pharmacy/Partner/Admin Navigation**:
- Sidebar navigation (desktop) with collapsible sections
- Top bar with notifications and profile dropdown
- Mobile: Bottom tab navigation

### Search & Discovery
**Medication Search**:
- Large search input with autocomplete dropdown
- Search suggestions appear below with medication name, strength, and price preview
- Recent searches section
- Popular medications grid (4 cards mobile, 8 cards desktop)

**Pharmacy Cards**:
- Card layout with pharmacy name, distance, rating, delivery time
- Availability badge (In Stock / Call to Confirm / Out of Stock)
- Phone number as clickable link with WhatsApp integration option
- Two-column grid (mobile), three-column (tablet), four-column (desktop)

### Order Flow
**Product Cards**:
- Image left, details right layout
- Medication name, strength, manufacturer
- Price (₦) with original/discounted display
- Quantity stepper (-, input, +)
- Add to cart button

**Cart**:
- Slide-in drawer from right
- Sticky footer with subtotal and checkout button
- Pharmacy grouping (if multi-pharmacy orders)
- Delivery/Pickup toggle

**Checkout**:
- Single-page flow with progressive sections
- Address selection with map preview
- Delivery/Pickup radio buttons
- Payment method selection
- Order summary sidebar (desktop) or expandable (mobile)

### Order Tracking
**Status Timeline**:
- Vertical timeline with checkpoints: Pending → Confirmed → Preparing → Out for Delivery → Delivered
- Active step highlighted with animation pulse
- Delivery partner info card (photo placeholder, name, phone, rating)
- Live location map integration placeholder

### Dashboards
**Customer Dashboard**:
- Hero section with search bar
- Quick actions: Reorder, Track Order, Find Pharmacy
- Order history cards (chronological)
- Saved addresses management

**Pharmacy Dashboard**:
- Stats cards row: Today's Orders, Revenue, Pending Orders, Inventory Alerts
- Orders table with status filters
- Inventory management with low stock warnings
- Quick actions for accepting/rejecting orders

**Delivery Partner Dashboard**:
- Available orders within 5km radius
- Active delivery tracking
- Earnings summary
- Pickup/delivery checklist interface

**Admin Dashboard**:
- Overview metrics grid (4 columns desktop, 2 mobile)
- Transaction monitoring table with search/filter
- User management sections
- Dispute resolution interface with messaging

### Forms
**Authentication**:
- Clean, centered cards with max-w-md
- Firebase Google Sign-In button (prominent)
- Email/password fields with show/hide toggle
- Role selection during registration (Customer/Pharmacy/Delivery Partner)

**Input Fields**:
- Floating labels pattern
- Icon prefixes for context (phone, location, email)
- Validation states with inline error messages
- Location autocomplete with current location button

### Maps & Location
- Full-width map sections with pharmacy markers
- Pharmacy info cards overlay on map
- Current location indicator
- Radius visualization for delivery partners (5km circle)

---

## Icons

**Library**: Heroicons (via CDN)
- Navigation: home, shopping-bag, clock, user-circle
- Actions: magnifying-glass, phone, map-pin, check-circle
- Status: truck, clock, check-badge, exclamation-triangle

---

## Animations

Use sparingly:
- Loading skeleton screens for content
- Slide-in transitions for cart drawer and modals
- Subtle pulse on active order status
- Smooth scroll for navigation

---

## Images

### Hero Section (Landing/Marketing Page)
Large hero image showing Nigerian pharmacy/healthcare context with professional overlay. Image should communicate trust and local relevance. Hero includes prominent search bar overlay.

### Dashboard/App Interface
- Medication product images (square thumbnails, 80x80px)
- Pharmacy logo placeholders (circular, 48x48px)
- Delivery partner photo placeholders (circular, 64x64px)
- Empty state illustrations for no orders/inventory

### Trust Elements
- Partner pharmacy logos in footer/about section
- Regulatory compliance badges
- Customer testimonial photos (if applicable)

---

## Progressive Web App Features

- Install prompt with custom UI
- Offline state messaging with retry actions
- Service worker cache indicators
- App-like transitions between views
- Pull-to-refresh on order lists

---

## Nigeria-Specific Design Elements

- Currency: Always prefix with ₦
- Phone numbers: Format as +234 XXX XXX XXXX with country code
- Address fields: Include State, LGA, Street
- Time zones: Display in WAT (West Africa Time)
- Trust signals: Include NAFDAC references where relevant
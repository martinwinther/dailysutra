# 52 Weeks of Raja Yoga

A year-long Raja Yoga journey tracker based on the Yoga Sūtras, guiding users through 52 weeks of contemplative practices with daily tracking and reflection tools.

## Features

- **52-week Raja Yoga curriculum** linked to specific sūtras from Patañjali's Yoga Sūtras
- **Daily practice tracking** with checkbox completion and personal notes
- **Weekly review system** with completion flags, enjoyment ratings, bookmarks, and reflection notes
- **Progress dashboard** showing statistics, recent activity, and bookmarked weeks
- **Journal timeline** displaying daily notes and weekly reflections in chronological order
- **Email-based authentication** powered by Firebase Auth
- **Trial subscription model** with 1-month free access, then editing locked unless upgraded
- **Stripe Checkout integration** for upgrading to "Pro" subscription
- **PWA support** with installable manifest, icons, and basic offline functionality
- **Local backup/restore** of journey data as JSON files

## Tech Stack

- **Next.js App Router** with TypeScript
- **Tailwind CSS** with custom "glass" UI components
- **Firebase Auth** for user authentication
- **Firestore** for real-time data synchronization
- **Stripe Checkout** for subscription payments
- **next-pwa** for Progressive Web App functionality

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Firebase project with Auth and Firestore enabled
- Stripe account (test mode for development)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd raja-yoga
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project
   - Enable Email/Password authentication in Firebase Auth
   - Create a Firestore database
   - Note: Firestore rules allow user-owned documents at `users/{uid}` and `journeys` subcollection

4. **Set up Stripe**
   - Create a Stripe account and get your test keys
   - Create a subscription product with a recurring price
   - Copy the price ID for your subscription

5. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in all required values (see Environment Variables section below)

6. **Start development server**
   ```bash
   npm run dev
   ```

### Available Routes

- `/` – Home dashboard (requires authentication)
- `/auth` – Sign up / Sign in page
- `/day/[dayNumber]` – Individual day practice page (1-364)
- `/progress` – Progress statistics and bookmarked weeks
- `/journal` – Timeline of daily notes and weekly reflections
- `/settings` – Account settings, backup/restore, subscription management
- `/about` – Information about the program
- `/offline` – Offline fallback page
- `/checkout/success` – Post-payment success page

## Environment Variables

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_... # Your subscription price ID

# App URL (fallback for Stripe checkout URLs)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Firebase Structure

### User Documents (`users/{uid}`)
```javascript
{
  subscriptionStatus: "none" | "trial" | "active" | "expired",
  trialStartedAt: Timestamp,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Journey Documents (`users/{uid}/journeys/raja-yoga-v1`)
```javascript
{
  programKey: "raja-yoga-v1",
  programVersion: "1.0",
  dayProgress: {
    1: { completed: true, notes: "..." },
    2: { completed: false, notes: "" },
    // ... up to day 364
  },
  weekProgress: {
    1: { 
      completed: true, 
      enjoyed: true, 
      bookmarked: false, 
      reflection: "..." 
    },
    // ... up to week 52
  },
  settings: {
    theme: "dark" | "light" | "system"
  },
  updatedAt: Timestamp
}
```

**Note:** Subscription gating is currently handled client-side via `SubscriptionProvider`. For production use, Firestore security rules should enforce subscription status on write operations.

## Stripe Integration

The subscription flow works as follows:

1. `/api/create-checkout-session` creates a Stripe Checkout session
2. Session metadata includes the user's `firebaseUid`
3. After successful payment, Stripe redirects to `/checkout/success`
4. Success page updates user's `subscriptionStatus` to "active" in Firestore

**Production Note:** This implementation lacks Stripe webhooks. For production deployment, implement webhook endpoints to verify subscription status server-side and handle subscription lifecycle events.

## PWA Behavior

- **Manifest** with app icons and metadata for installation
- **Service Worker** via next-pwa caches static assets
- **Offline detection** with `AppStatusBanner` component
- **Offline page** served when network is unavailable
- **Firebase requests** are network-only (not cached)

PWA functionality is disabled in development mode (`NODE_ENV=development`).

## Development Notes

### 52-Week Program Structure

The complete Raja Yoga curriculum is defined in `data/yogaProgram.ts` as the `YOGA_PROGRAM` array. Each week includes:

- Week number (1-52)
- Theme and core sūtras
- Key philosophical idea
- Specific weekly practice instructions

To modify program content, edit this file without touching the application logic.

### Glass UI Design

The app uses a custom "glass morphism" design system with:
- Semi-transparent backgrounds
- Backdrop blur effects
- Subtle borders and shadows
- Dark theme optimized for contemplative use

## Future Work / TODO

- **Add Stripe webhooks** with Firebase Admin SDK to ensure server-side subscription verification
- **Enhance Firestore security rules** to enforce subscription status on write operations
- **Implement account management** features (email change, password reset) in Settings
- **Improve PWA assets** with better icons, splash screens, and branding
- **Add multi-program support** for other 52-week spiritual/philosophical journeys
- **Replace console.warn logging** with proper error tracking (e.g., Sentry)
- **Add data export formats** beyond JSON (CSV, PDF reports)
- **Implement push notifications** for daily practice reminders
- **Add social features** like sharing bookmarked weeks or insights
- **Create admin dashboard** for program content management
- **Add accessibility improvements** for screen readers and keyboard navigation
- **Implement caching strategies** for better offline experience with journey data

## License

Private project - all rights reserved.
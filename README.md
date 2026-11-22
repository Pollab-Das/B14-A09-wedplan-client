# WedPlan — Wedding Planning Platform

WedPlan is a role-based wedding planning marketplace where customers discover wedding services and submit booking requests, vendors publish and manage services/bookings/subscriptions, and admins manage users, services, and transactions.

## Important Features

- Public home, service browsing, search/filter/sort, and service details
- Better Auth email/password and Google authentication with vendor/customer roles
- Role-protected customer, vendor, and admin dashboards
- Vendor service CRUD, booking request management, and Stripe premium subscription flow
- Customer booking requests, status tracking, and pending-booking cancellation
- Admin user management, service moderation, statistics, and transaction monitoring
- ImgBB image uploads, Sonner notifications, responsive UI, and Motion animations

## Technology Stack

Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/Base UI, Framer Motion, Better Auth, MongoDB, Express.js, Stripe Checkout, ImgBB.

## Installation

```bash
npm install
cp .env.example .env.local
```

Fill in the environment variables, then start the separate Express server and this client.

## Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

See `.env.example`. Never commit `.env`, `.env.local`, or secret values. Required variables include MongoDB URI/database, Better Auth URL/secret/config, Google OAuth credentials, backend API URL, ImgBB API key, and Stripe secret/webhook keys on the server.

## URLs

- Live website: https://b14-a09-wedplan-client.vercel.app
- Client repository: https://github.com/Pollab-Das/B14-A09-wedplan-client
- Server repository: https://github.com/Pollab-Das/B14-A09-wedplan-server

## Deployment Guideline

Deploy the client on Vercel or any Node host. Set all environment variables in the hosting dashboard. Configure the Express server CORS allowlist with the deployed client origin, expose only `NEXT_PUBLIC_*` values to the browser, enable HTTPS, and configure Stripe webhooks to the deployed server endpoint. Verify all private routes after deployment by refreshing directly.

## Evaluation

Admin credentials and live URLs must be supplied separately by the project owner.

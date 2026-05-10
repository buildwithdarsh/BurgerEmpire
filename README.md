> This project is made with the help of Claude (1M context).

# Burger Empire

Restaurant management & online ordering platform for Burger Empire Gwalior — a vegetarian burger chain since 2019.

## Overview

A full-featured restaurant website covering online ordering, table reservations, loyalty programs, delivery tracking, and a comprehensive admin dashboard. Integrates with the PetPooja POS for real-time inventory and order management across 19+ outlets in 15+ cities.

## Features

### Customer
- Menu browsing with search and filtering (bestsellers, combos, wraps, sides, beverages, desserts)
- Online ordering with live cart and order tracking
- Self check-in for in-store dining
- Loyalty program, referrals, student passes
- Email/SMS notifications via SMTP and SMS gateway
- Help center, blog, and support tickets

### Admin Dashboard (15+ modules)
- Orders, customers, inventory, coupons, loyalty
- Multi-location management
- Blog and content management
- Meal plans, subscriptions
- Real-time delivery and POS sync

## Tech Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4, Framer Motion
- **State:** Zustand
- **POS:** PetPooja API
- **Payments:** Razorpay
- **Images:** Cloudinary, next-cloudinary
- **Database:** PostgreSQL
- **Deploy:** Vercel

## Getting Started

```bash
npm install
cp .env.example .env.local   # PetPooja, Razorpay, SMTP, SMS, Cloudinary, GA
npm run dev
```

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — run ESLint

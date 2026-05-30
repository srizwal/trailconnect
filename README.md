# 🏔 TrailConnect

**A full-stack trekking community platform** — organize hiking groups, hire certified guides, and connect with adventurers worldwide.

> Design inspired by Airbnb Experiences · Meetup · AllTrails · Strava

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js ≥ 18
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com))
- npm or yarn

### 2. Clone & Install

```bash
# Install backend
cd backend
npm install

# Install frontend
cd ../frontend
npm install
```

### 3. Configure Environment

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, etc.
```

### 4. Seed Database (Optional — adds sample treks, guides & users)

```bash
cd backend
node seed.js
```

Demo accounts created by seeder:
| Role  | Email                        | Password     |
|-------|------------------------------|--------------|
| User  | alex@trailconnect.com        | password123  |
| Guide | priya@trailconnect.com       | password123  |
| Admin | admin@trailconnect.com       | password123  |

### 5. Run Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend
npm start
```

Open **http://localhost:3000** 🎉

---

## 🗂 Project Structure

```
trailconnect/
├── backend/
│   ├── server.js                  # Express + Socket.IO entry point
│   ├── seed.js                    # Database seeder
│   ├── .env.example               # Environment template
│   └── src/
│       ├── models/
│       │   ├── User.js            # User + roles (user/guide/admin)
│       │   ├── Trek.js            # Trek with seats & waitlist
│       │   ├── Guide.js           # Guide marketplace profile
│       │   ├── Booking.js         # Bookings + QR code
│       │   ├── Review.js          # Guide & trek reviews
│       │   ├── Message.js         # Real-time chat messages
│       │   └── Notification.js    # Push notifications
│       ├── controllers/
│       │   ├── authController.js  # JWT auth + Google OAuth
│       │   ├── trekController.js  # Trek CRUD + join/leave/waitlist
│       │   ├── guideController.js # Guide marketplace
│       │   └── bookingController.js # Booking + QR generation
│       ├── routes/
│       │   ├── auth.js / users.js / treks.js
│       │   ├── guides.js / bookings.js / reviews.js
│       │   ├── messages.js / notifications.js
│       │   ├── admin.js / upload.js
│       ├── middleware/
│       │   └── auth.js            # JWT protect + role authorize
│       └── socket/
│           └── socketHandlers.js  # Real-time chat + SOS + location
│
└── frontend/
    └── src/
        ├── App.jsx                # Router + lazy loading
        ├── api/index.js           # Axios client + all API calls
        ├── store/AuthContext.jsx  # Auth state + JWT management
        ├── styles/global.css      # Design tokens + utilities
        ├── components/
        │   ├── layout/            # Navbar, Footer, Layout
        │   ├── trek/TrekCard      # Trek card with seat bar
        │   └── guide/GuideCard    # Guide card with rating
        └── pages/
            ├── Home               # Hero + featured + guides
            ├── Explore            # Filter/search treks
            ├── TrekDetail         # Full trek + join + chat
            ├── CreateTrek         # Multi-section trek form
            ├── GuidesMarketplace  # Guide search + filters
            ├── GuideProfile       # Guide detail + booking
            ├── BookingPage        # 3-step booking + QR
            ├── Dashboard          # User stats + bookings + badges
            ├── AdminDashboard     # Charts + user management
            ├── MessagesPage       # Real-time chat
            ├── ProfilePage        # Public user profile
            ├── Login / Register   # Auth with demo accounts
            └── NotFound           # 404 page
```

---

## 🌐 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login → JWT |
| POST | `/api/auth/google` | Google OAuth |
| GET  | `/api/auth/me` | Get current user |
| PUT  | `/api/auth/profile` | Update profile |

### Treks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/treks` | List (filter/sort/paginate) |
| GET  | `/api/treks/featured` | Featured treks |
| GET  | `/api/treks/:id` | Trek detail |
| POST | `/api/treks` | Create trek |
| PUT  | `/api/treks/:id` | Update trek |
| POST | `/api/treks/:id/join` | Join / waitlist |
| POST | `/api/treks/:id/leave` | Leave trek |
| POST | `/api/treks/:id/like` | Like toggle |
| POST | `/api/treks/:id/comment` | Add comment |

### Guides
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/guides` | List + filter |
| GET  | `/api/guides/:id` | Guide detail |
| POST | `/api/guides` | Create profile |
| PUT  | `/api/guides/me` | Update my profile |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create + QR code |
| GET  | `/api/bookings/me` | My bookings |
| PUT  | `/api/bookings/:id/cancel` | Cancel booking |

### Admin (admin role required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET  | `/api/admin/stats` | Platform stats |
| GET  | `/api/admin/users` | All users |
| PUT  | `/api/admin/guides/:id/verify` | Verify guide |
| PUT  | `/api/admin/users/:id/ban` | Ban user |

---

## 🔌 Real-Time Events (Socket.IO)

| Event | Direction | Description |
|-------|-----------|-------------|
| `join` | Client → Server | Register user socket |
| `joinRoom` | Client → Server | Join chat room |
| `sendMessage` | Client → Server | Send chat message |
| `newMessage` | Server → Client | Receive message |
| `typing` | Client → Server | Show typing indicator |
| `sosAlert` | Client → Server | Emergency SOS broadcast |
| `shareLocation` | Client → Server | Live location in trek |
| `notification` | Server → Client | Push notification |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| `--forest` | `#0d2b1f` — Primary dark |
| `--forest-mid` | `#1a4a35` — Buttons, nav |
| `--forest-light` | `#2d7a57` — Accents |
| `--peak` | `#f0a500` — CTA buttons |
| `--sage` | `#7ab89a` — Soft accents |
| Headings | Syne (800–900) |
| Body | Outfit (300–700) |

---

## ☁️ Deployment

### Backend — Railway / Render / Heroku

```bash
# Set environment variables in dashboard:
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_32char_secret
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
```

### Frontend — Vercel / Netlify

```bash
cd frontend
npm run build
# Deploy /build folder
# Set env var: REACT_APP_API_URL=https://your-backend.railway.app/api
```

### MongoDB Atlas (Free Tier)
1. Create cluster at cloud.mongodb.com
2. Add connection string to `MONGODB_URI`
3. Whitelist IP `0.0.0.0/0` for cloud deployment

---

## 🔒 Optional Integrations

### Cloudinary (Image Uploads)
In `backend/.env`:
```
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```
Uncomment code in `src/routes/upload.js`.

### Stripe (Payments)
In `backend/.env`:
```
STRIPE_SECRET_KEY=sk_test_...
```
Add payment intent creation to `bookingController.js`.

### Google OAuth
```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```
Use with Passport.js or firebase-auth.

---

## 📜 Scripts

```bash
# Backend
npm run dev      # nodemon (install: npm i -D nodemon)
npm start        # node server.js
node seed.js     # Seed database

# Frontend
npm start        # Dev server
npm run build    # Production build
```

Add to `backend/package.json`:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

---

## 🤝 Contributing
Pull requests welcome! Please open an issue first for major changes.

---

**Built with ❤️ for adventurers everywhere** 🏔

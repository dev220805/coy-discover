# Coy Discover — Swipe-Based Dating Discovery

A full-stack MERN demonstration of a swipe-based dating discovery experience, built for the **Coy Software Development Engineer Intern** assignment.

The app includes a working Express + MongoDB backend, persistent swipes and matches, privacy-safe mutual matching, and a polished React frontend with drag-to-swipe gestures.

## Features

- **Discover feed** — swipeable profile cards powered entirely by the backend
- **Swipe right / left** — like or pass with touch drag + desktop buttons
- **Persistent swipes** — swiped profiles never reappear, even after refresh
- **Mutual matching** — a match is created only when both sides have liked each other
- **Match celebration** — full-screen “It’s a Match!” experience
- **Matches list** — shows confirmed mutual matches only
- **Privacy enforced on the backend** — incoming non-mutual likes are never exposed via any API
- **Blank Home tab** — present in navigation as required; Discover is the default tab

## Technology Stack

| Layer    | Tech |
|----------|------|
| Frontend | React (Vite), JavaScript, React Router, Tailwind CSS, Axios, Framer Motion, Lucide React |
| Backend  | Node.js, Express.js, MongoDB, Mongoose |
| Other    | dotenv, express-validator, CORS, REST APIs |

## Project Structure

```
coy-assignment/
├── backend/
│   ├── config/           # Database connection
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Demo user, validation, errors
│   ├── models/           # User, Profile, Swipe, Match
│   ├── routes/           # API routes
│   ├── scripts/          # Seed script
│   ├── services/         # Business logic
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/   # UI building blocks
│   │   ├── context/      # App context (toast, demo user)
│   │   ├── hooks/        # useFeed, useMatches
│   │   ├── pages/        # Home, Discover
│   │   ├── services/     # Axios API client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (default: `mongodb://127.0.0.1:27017`)
- npm

## Installation

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/coy_discover
DEMO_USER_ID=
NODE_ENV=development
```

`DEMO_USER_ID` is optional. If empty, the API resolves the user marked `isDemo: true` after seeding.

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Database Setup & Seeding

Make sure MongoDB is running, then:

```bash
cd backend
npm run seed
```

The seed script will:

1. Clear existing Users, Profiles, Swipes, and Matches
2. Create a demo user (**Alex Rivera**)
3. Create **32** additional discoverable profiles (30+ as required)
4. Seed **8** incoming likes toward the demo user (hidden from all APIs)

Tip: liking one of the first 8 profiles in the feed (same creation order) will create a mutual match.

## Running the Application

Open two terminals:

```bash
# Terminal 1 — API
cd backend
npm run dev
# → http://localhost:5000

# Terminal 2 — UI
cd frontend
npm run dev
# → http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173). The app lands on **Discover**.

## API Documentation

All endpoints assume the single demo logged-in user (no auth).

### `GET /health`

Health check.

### `GET /me`

Returns the demo user’s public profile (for the match overlay).

### `GET /feed`

Returns profiles the demo user has **not** already swiped on.

- Excludes already liked/passed profiles
- Excludes the demo user’s own profile
- Does **not** expose incoming likes

**Response**

```json
{
  "success": true,
  "count": 32,
  "profiles": [
    {
      "_id": "...",
      "name": "Aanya",
      "age": 22,
      "photo": "https://...",
      "bio": "...",
      "city": "Bangalore",
      "interests": ["Coffee", "Travel"]
    }
  ]
}
```

### `POST /swipe`

```json
{
  "profileId": "PROFILE_ID",
  "action": "like"
}
```

`action` must be `"like"` or `"pass"`.

**Behavior**

- Validates profile ID and action
- Rejects duplicate swipes
- Persists the swipe in MongoDB
- On `like`, checks whether the other user already liked the demo user
- Creates a mutual match only when both sides liked
- Never returns information about non-mutual incoming likes

**Match response**

```json
{
  "success": true,
  "matched": true,
  "match": {
    "id": "MATCH_ID",
    "profile": { "_id": "...", "name": "...", "age": 22, "photo": "...", "bio": "...", "city": "...", "interests": [] }
  }
}
```

**Non-match response**

```json
{
  "success": true,
  "matched": false,
  "match": null
}
```

### `GET /matches`

Returns only confirmed mutual matches for the demo user.

```json
{
  "success": true,
  "count": 1,
  "matches": [
    {
      "id": "...",
      "createdAt": "...",
      "profile": { "...": "..." }
    }
  ]
}
```

## Database Models

| Model   | Purpose |
|---------|---------|
| `User`  | Account + profile fields; one demo user (`isDemo: true`) |
| `Profile` | Public discoverable card linked 1:1 to a User |
| `Swipe` | Persistent like/pass with unique `(userId, profileId)` |
| `Match` | Mutual match only; unique via `pairKey` + `(userId, matchedProfileId)` |

## Demo Instructions

1. Start MongoDB, seed the database, run backend + frontend.
2. Open the app — you should land on **Discover** with a profile card.
3. **Pass** a profile (left swipe or ✕) — it disappears and stays gone after refresh.
4. **Like** a profile that has **not** liked you — no match overlay; swipe is saved.
5. **Like** a profile that **already liked** you (one of the first ~8 seeded profiles) — see the **It’s a Match!** screen.
6. Open **Matches** — only mutual matches appear.
7. Keep swiping until the feed is empty — empty state is shown.
8. Refresh the browser — swipes and matches persist; no swiped profile returns.
9. Inspect Network responses for `/feed`, `/swipe`, and `/matches` — no incoming-like identities are exposed.

### Quick API smoke test (PowerShell)

```powershell
# Feed
Invoke-RestMethod http://localhost:5000/feed

# Pass
$body = @{ profileId = "<ID_FROM_FEED>"; action = "pass" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:5000/swipe -ContentType "application/json" -Body $body

# Like
$body = @{ profileId = "<ID_FROM_FEED>"; action = "like" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://localhost:5000/swipe -ContentType "application/json" -Body $body

# Matches
Invoke-RestMethod http://localhost:5000/matches
```

## Privacy Notes

- Incoming likes are stored only as `Swipe` documents for match evaluation.
- `/feed` and `/matches` never return one-sided likers.
- `/swipe` returns match details **only** when a mutual match is created.



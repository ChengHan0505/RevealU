# RevealU

<p align="center" style="padding-bottom:20px;padding-top:20px">
  <strong style="font-size:32px">Reveal<span style="color:#10bfd0">U</span></strong>
  <br/><br/>
  <em>Gamified peer feedback for clearer teamwork, fairer recognition, and faster improvement.</em>
</p>

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</div>

---

## Repository Overview
Domains: https://reveal-u-two.vercel.app/
```
**RevealU** is a full-stack peer evaluation application built with **Next.js App Router**, **React**, **Tailwind CSS**, and **MongoDB**. It helps teams create private feedback sessions, share evaluation links, collect anonymous-style peer ratings, and generate live leaderboard results.

The app is production-oriented for Vercel deployment. The primary backend lives inside `frontend/app/api` as Next.js serverless API routes. A separate Express backend scaffold is also included for local development or future standalone API deployment.

---

## Core Features

1. **Landing, Login, and Register Flow**
   - Modern RevealU landing page.
   - Login and register pages with a shared auth card.
   - Public pages hide post-login navigation tabs.

2. **Dashboard**
   - Displays active sessions from MongoDB with localStorage fallback.
   - Provides quick access to session results.
   - Includes a create session action.

3. **Create Session**
   - Users enter a session name and team member names.
   - Session is saved to MongoDB before the evaluation link is generated.
   - Generated links point to `/sessions/:sessionId/evaluate`.

4. **Peer Evaluation Form**
   - Dynamic evaluation columns based on the team members in the session.
   - Fixed assessment criteria.
   - Ratings are calculated in real time.
   - Each evaluator must select their own name before submitting.

5. **Results and Leaderboard**
   - Scores are aggregated cumulatively across valid submissions.
   - Leaderboard sorts contributors by total score in descending order.
   - Duplicate submissions from the same evaluator in the same session are blocked server-side.
   - Result page can copy the evaluation link only when the session is confirmed in MongoDB.

---

## System Architecture

RevealU uses a clean separation between routing, presentation, state, utilities, and data access.

```text
RevealU/
├── frontend/
│   ├── app/
│   │   ├── api/                  # Next.js serverless API routes
│   │   ├── dashboard/            # Dashboard route
│   │   ├── login/                # Login route
│   │   ├── register/             # Register route
│   │   └── sessions/             # Session pages
│   ├── components/               # Reusable UI and feature components
│   ├── data/                     # Static evaluation criteria
│   ├── hooks/                    # Client-side state and flow logic
│   ├── server/                   # MongoDB connection, models, services
│   ├── types/                    # Shared TypeScript data contracts
│   └── utils/                    # API helpers, scoring, session helpers
├── backend/                      # Express API scaffold for local/future use
├── scripts/                      # Root development runner
├── vercel.json                   # Vercel deployment config
└── package.json                  # Root scripts
```

### Production Backend Path

For Vercel, the production backend is:

```text
frontend/app/api
```

These API routes connect directly to MongoDB through:

```text
frontend/server/db.ts
frontend/server/session-service.ts
frontend/server/models/session.ts
```

### Express Backend Scaffold

The Express backend remains available at:

```text
backend/server.js
backend/routes
backend/models
```

It mirrors the main session logic and is useful for local backend experimentation or future deployment to Render, Railway, or another Node hosting provider.

---

## Tech Stack

### Frontend

- **Next.js App Router**
- **React**
- **TypeScript**
- **Tailwind CSS**

### Backend

- **Next.js Serverless API Routes** for Vercel production
- **Node.js / Express** scaffold for local or standalone backend use
- **Mongoose** for MongoDB schemas and queries

### Database

- **MongoDB Atlas**
- Session documents include:
  - Session ID
  - Session name
  - Team members
  - Evaluation path
  - Submitted evaluations
  - Aggregated scoring source data

### Deployment

- **Vercel**
- Root `vercel.json` builds and deploys the `frontend` app.

---

## End-to-End Data Flow

### Create Session

```text
Create Session UI
-> useSessionBuilder
-> POST /api/sessions/create
-> MongoDB SessionModel.create()
-> Return session object
-> Generate clickable evaluation link
```

### Submit Evaluation

```text
Evaluation Form
-> User selects evaluator name
-> User rates each member
-> useEvaluationSession
-> POST /api/sessions/:id/submit
-> Server validates evaluator
-> Server blocks duplicate evaluator submission
-> MongoDB pushes submission
-> Return updated cumulative result
-> Redirect to results page
```

### Results

```text
Results Page
-> GET /api/sessions/:id
-> GET /api/sessions/:id/result
-> Aggregate scores by member ID
-> Sort leaderboard descending
-> Poll every 2 seconds for live updates
```

---

## API Routes

### Auth

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Login route scaffold |
| `POST` | `/api/auth/register` | Register route scaffold |

### Sessions

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/sessions` | List recent sessions |
| `POST` | `/api/sessions/create` | Create a new feedback session |
| `GET` | `/api/sessions/:id` | Fetch one session |
| `POST` | `/api/sessions/:id/submit` | Submit one evaluator response |
| `GET` | `/api/sessions/:id/result` | Fetch cumulative leaderboard result |

---

## Local Development

### 1. Install Dependencies

From the project root:

```bash
npm run install:all
```

If you only need the frontend:

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create:

```text
frontend/.env.local
```

Use:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/revealu?appName=RevealU
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For the optional Express backend, create:

```text
backend/.env
```

Use:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/revealu?appName=RevealU
```

### 3. Run the Project

From the project root:

```bash
npm run dev
```

The app should run at:

```text
http://localhost:3000
```

If port `3000` is already in use, Next.js may start on another available port.

---

## MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Copy the connection string.
4. Add `/revealu` before the query string:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/revealu?appName=RevealU
```

5. In **Network Access**, allow your local IP.
6. For Vercel deployment, allow Vercel to connect. The fastest option is:

```text
0.0.0.0/0
```

> Security note: keep `.env` files private. This repository ignores `.env`, `.env.*`, `frontend/.env.local`, and `backend/.env`.

---

## Deployment to Vercel

The root `vercel.json` is configured to deploy the frontend Next.js app:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/.next",
  "installCommand": "cd frontend && npm install",
  "framework": "nextjs"
}
```

### Required Vercel Environment Variables

Set these in the Vercel project dashboard:

```env
MONGO_URI=your_mongodb_connection_string
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

Do not upload `.env` files to GitHub.

### Deployment Checklist

- `npm --prefix frontend run check` passes.
- `npm --prefix frontend run build` passes.
- MongoDB Atlas allows your deployment origin/network.
- Vercel environment variables are set.
- Fresh sessions can be created and fetched from MongoDB.
- Result page copy link is enabled after MongoDB confirms the session.

---

## Validation Status

The project has been checked with:

```bash
npm --prefix frontend run check
npm --prefix frontend run build
node --check backend/server.js
node --check backend/routes/sessionRoutes.js
node --check backend/models/sessionModel.js
```

A live API flow was also verified:

```text
create session -> fetch session -> submit evaluation -> fetch result
```

Expected result:

```text
E2E_OK
```

---

## Troubleshooting

### Result Page Says Session Is Not Synced to MongoDB

This means the result page can see local browser data, but the API cannot confirm the session in MongoDB.

Fix:

1. Check `MONGO_URI`.
2. Add your IP in MongoDB Atlas Network Access.
3. Restart the project.
4. Create a fresh session.
5. Generate a new evaluation link.

### Evaluation Link Opens Session Not Found

This usually happens with old links created before MongoDB was connected.

Fix:

1. Create a fresh session after MongoDB is connected.
2. Generate a new link.
3. Share the new link.

### MongoDB Connection Times Out

Check:

- Atlas cluster is running.
- Current IP is whitelisted.
- `MONGO_URI` includes the database name.
- Password is URL-safe if it contains special characters.

### Same Evaluator Cannot Submit Twice

This is expected. RevealU blocks duplicate submissions from the same selected evaluator in the same session to keep leaderboard scoring fair.

---

## Future Improvements

- Replace auth scaffolds with real user accounts and sessions.
- Add owner-specific dashboard filtering.
- Add session close/archive status.
- Add evaluator invitation tokens for stronger identity control.
- Add automated tests for API routes and scoring utilities.

---

## Project Status

RevealU is ready for Vercel deployment when MongoDB Atlas access and Vercel environment variables are configured.

# Cybreva

> **Check Before You Trust.** — AI-powered online safety and scam detection platform.

Cybreva helps users verify messages, emails, and websites for scams and threats using AI analysis and threat intelligence APIs.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + Tailwind CSS 4 + Ant Design |
| Backend | Node.js + Express.js (ES Modules) |
| Database | MongoDB Atlas + Mongoose 9 |
| AI | Groq SDK (`qwen/qwen3.8-27b`) |
| Threat Intel | Google Safe Browsing / Web Risk + VirusTotal (optional) |
| Auth | JWT via HTTP-only cookies + bcryptjs |
| Validation | Zod |

---

## Project Structure

```
web/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # AuthContext
│   │   ├── pages/           # public/ | auth/ | dashboard/
│   │   ├── services/        # Axios API service modules
│   │   └── utils/           # riskUtils, etc.
│   └── vite.config.js
└── server/                  # Express backend
    ├── config/              # Database connection
    ├── constants/           # App-wide constants
    ├── controllers/         # Route handlers
    ├── middleware/          # auth, errorHandler, rateLimiter
    ├── models/              # Mongoose schemas
    ├── routes/              # Express routers
    ├── services/            # Business logic (AI, scanners, threat intel)
    ├── validators/          # Zod schemas
    ├── utils/               # AppError, helpers, tokenUtils
    └── test/                # run.js (functional) | security.js (security)
```

---

## Quick Start

### Prerequisites

- Node.js ≥ 20
- MongoDB Atlas account
- Groq API key
- Google Safe Browsing API key (optional but recommended)

### 1. Clone and install

```bash
git clone <repo-url>
cd web

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` — see [Environment Variables](#environment-variables) below.

The client reads from `client/.env`:

```
VITE_API_URL=http://localhost:8000/api
```

### 3. Run in development

Open **two terminals**:

```bash
# Terminal 1 — Backend
cd server
npm run dev        # node --watch server.js

# Terminal 2 — Frontend
cd client
npm run dev        # vite
```

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`

### 4. Run tests

```bash
# Functional tests (server must be running)
cd server && node test/run.js

# Security tests (server must be running)
cd server && node test/security.js
```

---

## API Endpoints

### Authentication — `/api/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Register new user |
| POST | `/login` | No | Login |
| POST | `/logout` | No | Logout (clears cookie) |
| GET | `/me` | ✅ | Get current user |
| PUT | `/profile` | ✅ | Update name |
| PUT | `/change-password` | ✅ | Change password |
| POST | `/forgot-password` | No | Request password reset |
| POST | `/reset-password/:token` | No | Reset password with token |

### Scans — `/api/scans`

All scan endpoints require authentication. Results are persisted per user.

| Method | Path | Description |
|---|---|---|
| POST | `/message` | Analyze a text message for scams |
| POST | `/email` | Analyze email content for phishing |
| POST | `/website` | Check URL safety |
| GET | `/history` | Paginated scan history |
| GET | `/:id` | Get single scan |
| DELETE | `/:id` | Delete scan |

### AI Assistant — `/api/ai`

| Method | Path | Description |
|---|---|---|
| POST | `/chat` | Send message to AI security assistant |
| GET | `/sessions` | List chat sessions |
| GET | `/sessions/:id` | Get session with messages |
| DELETE | `/sessions/:id` | Delete session |

### Dashboard — `/api/dashboard`

| Method | Path | Description |
|---|---|---|
| GET | `/stats` | Aggregated user stats (totals, by type, by risk, recent scans) |

### Health — `/api/health`

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Server status check |

---

## Environment Variables

**`server/.env`** (never commit this file)

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default 8000) |
| `NODE_ENV` | No | `development` or `production` |
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Secret for signing JWTs (min 32 chars) |
| `JWT_EXPIRES_IN` | No | JWT expiration (default `7d`) |
| `CLIENT_URL` | ✅ | Frontend origin for CORS (e.g. `http://localhost:5173`) |
| `GROQ_API_KEY` | ✅ | Groq AI API key |
| `GROQ_MODEL` | No | Override Groq model (default `qwen/qwen3.8-27b`) |
| `GOOGLE_SAFE_BROWSING_API_KEY` | No | Google Safe Browsing v4 API key |
| `GOOGLE_WEB_RISK_API_KEY` | No | Google Web Risk API key (alternative) |
| `VIRUSTOTAL_API_KEY` | No | VirusTotal API key (optional integration) |

---

## Security Features

- **HTTP-only cookies** — JWT never stored in localStorage
- **bcrypt** — passwords hashed with cost factor 12
- **Helmet** — security headers (CSP, HSTS, X-Frame-Options, etc.)
- **Rate limiting** — separate limiters for auth, scans, AI, and general routes
- **CORS allowlist** — only configured origins allowed
- **Zod validation** — all inputs validated before processing
- **SSRF protection** — private IPs, localhost, and non-HTTP schemes blocked in URL scanner
- **Ownership checks** — users can only access their own scans and sessions
- **Generic error responses** — password reset endpoint does not reveal whether email exists
- **No API keys in frontend** — all third-party calls are server-side

---

## Deployment

### Backend (e.g. Railway, Render, Fly.io)

1. Set all environment variables in your hosting dashboard.
2. Set `NODE_ENV=production`.
3. Set `CLIENT_URL` to your production frontend domain.
4. The start command is: `node server.js`

### Frontend (e.g. Vercel, Netlify)

1. Set `VITE_API_URL` to your production backend URL (e.g. `https://cybreva.vercel.app/api`).
2. Build command: `npm run build`
3. Output directory: `dist`
4. **SPA routing**: configure your host to serve `index.html` for all routes.
   - Netlify: add a `_redirects` file with `/* /index.html 200`
   - Nginx: `try_files $uri /index.html;`

---

## Disclaimers

- Cybreva's scan results are AI-assisted and should not be treated as verified facts.
- No system can detect 100% of scams. Always exercise independent judgment.
- VirusTotal and Google threat intelligence require separate API agreements and licensing.

# OpportunityVault

AI-powered smart opportunity tracker for scholarships, jobs, internships, research programs, summer courses, and more.

## Features

- **AI Extraction** — Paste raw text from any source; Groq/Gemini/Mistral/Ollama extract structured fields
- **Opportunity Management** — Table and card views with sorting, filtering, URL-searchable filters
- **Urgency System** — Dynamic deadline urgency (critical/high/medium/low)
- **Dashboard** — Stats, urgent items, deadline timeline, type breakdown chart
- **ntfy.sh Notifications** — Deadline alerts, status changes, weekly summaries
- **Export** — CSV, JSON, and Notion sync
- **JWT Auth** — Access + refresh tokens with secure session handling

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, TypeScript, Vite, Tailwind, Framer Motion, Zustand, React Router v6 |
| Backend | Node.js, Express, TypeScript, Prisma |
| Database | SQLite (local), PostgreSQL (production) |
| AI | Groq, Gemini, Mistral, Ollama (fallback chain) |
| Notifications | ntfy.sh |

## Quick Start (Local)

### Prerequisites

- Node.js 20+
- npm 10+

### 1. Install dependencies

```bash
cd D:\Project\OpportunityVault
npm install
```

### 2. Configure environment

```bash
cp .env.example server/.env
cp .env.example client/.env
```

Edit `server/.env`:

```env
DATABASE_URL=file:./dev.db
JWT_ACCESS_SECRET=your_secret_min_32_chars_here
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars
GROQ_API_KEY=your_groq_key
PORT=4000
CLIENT_URL=http://localhost:5173
```

### 3. Initialize database

```bash
cd server
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Run development servers

From project root:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## Environment Variables

### Server (`server/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | `file:./dev.db` (SQLite) or PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Secret for access tokens |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens |
| `JWT_ACCESS_EXPIRES` | Default: `15m` |
| `JWT_REFRESH_EXPIRES` | Default: `7d` |
| `PORT` | API port (default: 4000) |
| `CLIENT_URL` | Frontend URL for CORS |
| `AI_PROVIDER` | Primary provider: `groq`, `gemini`, `mistral`, `ollama` |
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) (free) |
| `GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com) (free) |
| `MISTRAL_API_KEY` | [console.mistral.ai](https://console.mistral.ai) (free tier) |
| `OLLAMA_BASE_URL` | Default: `http://localhost:11434` |
| `NTFY_DEFAULT_SERVER` | Default: `https://ntfy.sh` |
| `NOTION_API_KEY` | Optional, for Notion export |

### Client (`client/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (default: `http://localhost:4000/api`) |

## Free AI API Keys

1. **Groq** — Sign up at [console.groq.com](https://console.groq.com), create API key
2. **Gemini** — Get key at [aistudio.google.com](https://aistudio.google.com)
3. **Mistral** — Register at [console.mistral.ai](https://console.mistral.ai)
4. **Ollama** — Install from [ollama.com](https://ollama.com), run `ollama pull llama3.2`

## ntfy.sh Setup

1. Install **ntfy** app (Android/iOS)
2. Open app → tap **+** → subscribe to a topic (e.g. `opportunityvault-yourname`)
3. In OpportunityVault **Settings → Notifications**, enter the same topic
4. Click **Test →** to verify

### Self-hosted ntfy

```bash
docker run -p 80:80 -v /var/cache/ntfy:/var/cache/ntfy \
  -v /etc/ntfy:/etc/ntfy binwiederhier/ntfy serve
```

## PostgreSQL (Optional)

```bash
docker-compose up -d
```

Update `server/.env`:

```env
DATABASE_URL=postgresql://opportunityvault:opportunityvault@localhost:5432/opportunityvault
```

Change `provider` in `server/prisma/schema.prisma` to `postgresql`, then:

```bash
npx prisma migrate dev
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh tokens |
| POST | `/api/extract` | AI extraction preview |
| POST | `/api/extract/save` | Save extracted opportunity |
| GET | `/api/opportunities` | List (filterable) |
| GET | `/api/opportunities/:id` | Get one |
| PATCH | `/api/opportunities/:id` | Update |
| DELETE | `/api/opportunities/:id` | Delete |
| GET | `/api/stats/overview` | Dashboard stats |
| POST | `/api/notifications/test` | Test ntfy |
| GET/PATCH | `/api/settings` | User settings |

## Keyboard Shortcuts

- **Ctrl+N** — Open Add Opportunity page

## Deployment

### Option A: Vercel + Render + Supabase

1. **Supabase** — Create project, copy `DATABASE_URL`, run `npx prisma migrate deploy`
2. **Render** — Deploy server with build: `npm install && npx prisma generate && npm run build`, start: `npm start`
3. **Vercel** — Deploy client with `VITE_API_URL=https://your-api.onrender.com/api`

### Option B: Fly.io

```bash
fly launch
fly deploy
```

### Option C: Railway

Connect GitHub repo; add PostgreSQL plugin; set env vars.

**Tip:** Use [UptimeRobot](https://uptimerobot.com) to ping Render every 10 min (free tier sleeps after 15 min).

## Notion Export

1. Create a Notion integration at [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Create a database with properties: Name (title), Type (select), Deadline (date), Status (select), Countries (multi-select), Apply Link (url), Notes (rich_text)
3. Share database with your integration
4. In **Settings → Export**, paste integration token and database ID

## Project Structure

```
opportunityvault/
├── client/          # React frontend
├── server/          # Express API
├── docker-compose.yml
├── .env.example
└── README.md
```

## License

MIT

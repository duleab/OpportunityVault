# OpportunityVault — Production Deployment Guide

Deploy the full stack on free tiers: **Supabase** (PostgreSQL) + **Render** (Express API + cron) + **Vercel** (React SPA).

```
User Browser
    ↓
Vercel (client/) — static SPA
    ↓ VITE_API_URL
Render (server/) — Express API + node-cron
    ↓ DATABASE_URL / DIRECT_URL
Supabase PostgreSQL
```

**Estimated time:** 30–45 minutes  
**Cost:** $0/month on free tiers

---

## Prerequisites

- GitHub account with this repo pushed: [duleab/OpportunityVault](https://github.com/duleab/OpportunityVault)
- Free accounts at [Supabase](https://supabase.com), [Render](https://render.com), and [Vercel](https://vercel.com)
- At least one AI API key ([Groq](https://console.groq.com) recommended — free)
- Optional: [UptimeRobot](https://uptimerobot.com) account (keeps Render awake)
- Optional: ntfy mobile app for push notifications

---

## Step 1 — Supabase (PostgreSQL Database)

### 1.1 Create project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**
2. Choose an organization, name (e.g. `opportunityvault`), strong database password, region closest to your users
3. Wait ~2 minutes for provisioning

### 1.2 Get connection strings

1. Open your project → **Project Settings** (gear) → **Database**
2. Under **Connection string**, select **URI**
3. Copy the **Direct connection** string (port `5432`):

   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
   ```

   Save this as **`DIRECT_URL`** — used by Prisma migrations.

4. Switch to **Transaction pooler** (port `6543`) and copy that URI:

   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

   Save this as **`DATABASE_URL`** — used by the running API.

> **Important:** Replace `[YOUR-PASSWORD]` with your actual database password. If the password contains special characters (`@`, `#`, `%`, etc.), URL-encode them.

### 1.3 Verify connection (optional, local)

```powershell
cd D:\Project\OpportunityVault\server
$env:DATABASE_URL = "postgresql://..."   # your DIRECT_URL
$env:DIRECT_URL = "postgresql://..."     # same as above for local test
npx prisma migrate deploy
```

You should see: `All migrations have been successfully applied.`

---

## Step 2 — Render (Express Backend + Cron)

Render runs the Express API and `node-cron` jobs (daily deadline monitor at 09:00 UTC, weekly summary on Sundays).

### 2.1 Create Web Service

1. Go to [dashboard.render.com](https://dashboard.render.com) → **New +** → **Blueprint**
2. Connect your GitHub account and select **duleab/OpportunityVault**
3. Render detects `render.yaml` at the repo root — click **Apply**

   **Or manually:** New → Web Service → connect repo → set:
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npx prisma migrate deploy && npm start`
   - **Health Check Path:** `/api/health`

### 2.2 Set environment variables

In Render → your service → **Environment**, add:

| Variable | Value | Required |
|----------|-------|----------|
| `NODE_ENV` | `production` | Yes |
| `DATABASE_URL` | Supabase **Transaction pooler** URI (port 6543, `?pgbouncer=true`) | Yes |
| `DIRECT_URL` | Supabase **Direct** URI (port 5432) | Yes |
| `JWT_ACCESS_SECRET` | Random string, min 32 chars | Yes |
| `JWT_REFRESH_SECRET` | Different random string, min 32 chars | Yes |
| `JWT_ACCESS_EXPIRES` | `15m` | No (default) |
| `JWT_REFRESH_EXPIRES` | `7d` | No (default) |
| `CLIENT_URL` | Your Vercel URL (set after Step 3), e.g. `https://opportunityvault.vercel.app` | Yes |
| `PORT` | `4000` | Yes |
| `AI_PROVIDER` | `groq` | Yes |
| `GROQ_API_KEY` | Your Groq API key | Yes* |
| `GEMINI_API_KEY` | Gemini key (fallback) | Optional |
| `MISTRAL_API_KEY` | Mistral key (fallback) | Optional |
| `NTFY_DEFAULT_SERVER` | `https://ntfy.sh` | No (default) |
| `NOTION_API_KEY` | Notion integration token | Optional |

\* At least one AI provider key is required for extraction to work.

**Generate JWT secrets (PowerShell):**

```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 48 | ForEach-Object {[char]$_})
```

Run twice — once for access, once for refresh.

### 2.3 Deploy and verify

1. Click **Manual Deploy → Deploy latest commit**
2. Watch logs — you should see:
   - `All migrations have been successfully applied.`
   - `OpportunityVault API running on http://localhost:4000`
3. Test health endpoint:

   ```
   https://YOUR-SERVICE.onrender.com/api/health
   ```

   Expected response:

   ```json
   {"status":"ok","timestamp":"2026-06-18T..."}
   ```

> **Note:** First deploy may take 5–10 minutes. Free tier spins down after 15 min of inactivity — see Step 5 for UptimeRobot.

### 2.4 Prisma migrations on Render

Migrations run automatically on every deploy via the start command:

```
npx prisma migrate deploy && npm start
```

- Uses `DIRECT_URL` for migrations (direct PostgreSQL connection)
- Uses `DATABASE_URL` (pooled) for runtime queries

To run migrations manually (Render Shell):

```bash
npx prisma migrate deploy
```

---

## Step 3 — Vercel (React Frontend)

### 3.1 Import project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import **duleab/OpportunityVault** from GitHub
3. Configure:
   - **Framework Preset:** Other
   - **Root Directory:** leave blank (repo root — `vercel.json` handles paths)
   - **Build Command:** `npm run build -w client` (from `vercel.json`)
   - **Output Directory:** `client/dist` (from `vercel.json`)
   - **Install Command:** `npm install`

### 3.2 Set environment variable

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://YOUR-SERVICE.onrender.com/api` |

> No trailing slash. Must include `/api` suffix.

### 3.3 Deploy

Click **Deploy**. Vercel builds the Vite SPA and serves it with SPA rewrites (all routes → `index.html`).

Your app URL will be something like: `https://opportunityvault.vercel.app`

### 3.4 Vercel CLI (optional)

The Vercel CLI is **not installed** on this machine. To deploy from CLI:

```powershell
npm i -g vercel
vercel login
cd D:\Project\OpportunityVault
vercel --prod
```

Set `VITE_API_URL` when prompted or in the Vercel dashboard before deploying.

---

## Step 4 — Wire Everything Together

After Vercel deploys, update Render with the final frontend URL:

1. Render → **Environment** → set `CLIENT_URL` to your exact Vercel URL:
   ```
   https://opportunityvault.vercel.app
   ```
2. **Save** — Render redeploys automatically
3. In Vercel, confirm `VITE_API_URL` points to your Render API:
   ```
   https://opportunityvault-api.onrender.com/api
   ```
4. If you changed `VITE_API_URL`, trigger a **Redeploy** in Vercel (env vars are baked in at build time)

### CORS

The API allows requests from `CLIENT_URL` only. Auth uses Bearer tokens (not cookies), so cross-origin works once `CLIENT_URL` matches your Vercel domain exactly — including `https://` and no trailing slash.

### Architecture checklist

- [ ] Supabase project created, both connection strings saved
- [ ] Render deployed, `/api/health` returns `{"status":"ok"}`
- [ ] Vercel deployed, app loads in browser
- [ ] `CLIENT_URL` on Render = Vercel URL
- [ ] `VITE_API_URL` on Vercel = Render URL + `/api`
- [ ] JWT secrets set (not defaults)
- [ ] At least one AI API key set on Render

---

## Step 5 — UptimeRobot (Keep Render Awake)

Render free tier sleeps after **15 minutes** of inactivity. First request after sleep takes ~30–60 seconds (cold start).

1. Go to [uptimerobot.com](https://uptimerobot.com) → **Add New Monitor**
2. **Monitor Type:** HTTP(s)
3. **URL:** `https://YOUR-SERVICE.onrender.com/api/health`
4. **Monitoring Interval:** 5 minutes (free tier minimum)
5. Save

This pings your API regularly so cron jobs and notifications stay reliable.

---

## Step 6 — ntfy.sh Push Notifications

### 6.1 Subscribe on mobile

1. Install **ntfy** ([Android](https://play.google.com/store/apps/details?id=io.heckel.ntfy) / [iOS](https://apps.apple.com/app/ntfy/id1625396347))
2. Tap **+** → subscribe to a unique topic, e.g. `ov-yourname-abc123`
3. Use a topic name others cannot guess (topics are public on ntfy.sh)

### 6.2 Configure in app

1. Open your deployed OpportunityVault → **Settings → Notifications**
2. Enter the same topic name
3. Click **Test** — you should receive a push notification on your phone

### 6.3 What gets notified

| Event | Cron schedule |
|-------|---------------|
| Deadline reminders (1, 3, 7 days before) | Daily 09:00 UTC |
| Weekly summary | Sundays 09:00 UTC |
| Status change alerts | Immediate (on update) |
| Test notification | Manual (Settings) |

Default server: `https://ntfy.sh` (set via `NTFY_DEFAULT_SERVER` on Render).

---

## Step 7 — Test Production

Run through this checklist after deploy:

### Auth
- [ ] Register a new account
- [ ] Log out and log back in
- [ ] Token refresh works (stay logged in > 15 min)

### AI Extraction
- [ ] **Add Opportunity** → paste sample text → **Extract**
- [ ] Fields populate (name, deadline, type, etc.)
- [ ] Save opportunity appears in list

### Dashboard & Filters
- [ ] Dashboard shows stats
- [ ] Table/card views work
- [ ] Filters and sorting work

### Notifications
- [ ] Settings → enter ntfy topic → **Test** → push received
- [ ] Create opportunity with deadline tomorrow → wait for daily cron (or check logs)

### Export
- [ ] Export CSV downloads
- [ ] Export JSON downloads
- [ ] Notion sync (if `NOTION_API_KEY` configured)

### API health
```powershell
Invoke-RestMethod https://YOUR-SERVICE.onrender.com/api/health
```

---

## Troubleshooting

### `Can't reach database server` on Render

- Verify `DATABASE_URL` uses port **6543** with `?pgbouncer=true`
- Verify `DIRECT_URL` uses port **5432** (direct connection)
- Check Supabase project is not paused (free tier pauses after 1 week inactivity)
- URL-encode special characters in the database password

### CORS errors in browser console

- `CLIENT_URL` on Render must exactly match your Vercel URL
- Include `https://`, no trailing slash
- Redeploy Render after changing `CLIENT_URL`

### `401 Unauthorized` on API calls

- Check JWT secrets are set and consistent (don't change after users register)
- Clear browser localStorage and log in again

### AI extraction fails

- Verify `GROQ_API_KEY` (or another provider key) is set on Render
- Check Render logs for provider error messages
- Try switching `AI_PROVIDER` to `gemini` if Groq rate-limits

### Vercel shows app but API calls fail

- Confirm `VITE_API_URL` includes `/api` suffix
- Redeploy Vercel after changing env vars (Vite bakes them at build time)
- Check browser Network tab — requests should go to `onrender.com`, not `localhost`

### Render cold start (slow first load)

- Normal on free tier — use UptimeRobot (Step 5)
- First request after sleep: 30–60 seconds

### Prisma migration errors

```bash
# In Render Shell or locally with production DIRECT_URL:
npx prisma migrate deploy
npx prisma migrate status
```

If migrations are out of sync, check Supabase **Table Editor** for existing tables.

### Cron jobs not running

- Cron only runs while the Render service is awake
- UptimeRobot keeps the service warm
- Check Render logs around 09:00 UTC for `[cron] Running daily deadline monitor`

### ntfy notifications not received

- Topic names are case-sensitive — must match exactly in app and ntfy app
- Verify phone is subscribed to the topic in ntfy app
- Check `ntfyEnabled` is on in Settings
- Try **Test** button first before waiting for cron

---

## Local Development vs Production

| | Local | Production |
|---|-------|------------|
| Database | PostgreSQL via `docker-compose up -d` | Supabase PostgreSQL |
| API | `npm run dev -w server` (port 4000) | Render |
| Frontend | `npm run dev -w client` (port 5173) | Vercel |
| Env files | `server/.env`, `client/.env` | Platform dashboards |

### Local setup (matches production)

```powershell
cd D:\Project\OpportunityVault
docker-compose up -d
copy .env.example server\.env
copy .env.example client\.env
cd server
npx prisma migrate deploy
npx prisma generate
cd ..
npm run dev
```

### SQLite quick dev (optional)

For fast local dev without Docker:

1. In `server/prisma/schema.prisma`, change `provider = "postgresql"` to `provider = "sqlite"` and remove the `directUrl` line
2. Set `DATABASE_URL=file:./dev.db` in `server/.env`
3. Run `npx prisma migrate dev --name init`

> Switch back to PostgreSQL before deploying to production.

---

## Environment Variables Reference

### Supabase

| Variable | Where used | Description |
|----------|------------|-------------|
| Connection string (6543) | Render `DATABASE_URL` | Pooled connection for API runtime |
| Connection string (5432) | Render `DIRECT_URL` | Direct connection for migrations |

### Render (`server/`)

| Variable | Example | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://...@...supabase.com:6543/postgres?pgbouncer=true` | Pooled DB URL |
| `DIRECT_URL` | `postgresql://...@...supabase.com:5432/postgres` | Direct DB URL for migrations |
| `JWT_ACCESS_SECRET` | (random 32+ chars) | Access token signing key |
| `JWT_REFRESH_SECRET` | (random 32+ chars) | Refresh token signing key |
| `JWT_ACCESS_EXPIRES` | `15m` | Access token TTL |
| `JWT_REFRESH_EXPIRES` | `7d` | Refresh token TTL |
| `CLIENT_URL` | `https://opportunityvault.vercel.app` | Frontend URL for CORS |
| `PORT` | `4000` | API listen port |
| `AI_PROVIDER` | `groq` | Primary AI provider |
| `GROQ_API_KEY` | `gsk_...` | Groq API key |
| `GEMINI_API_KEY` | `AI...` | Google Gemini key |
| `MISTRAL_API_KEY` | `...` | Mistral key |
| `NTFY_DEFAULT_SERVER` | `https://ntfy.sh` | Default ntfy server |
| `NOTION_API_KEY` | `secret_...` | Notion integration (optional) |

### Vercel (`client/`)

| Variable | Example | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `https://opportunityvault-api.onrender.com/api` | Backend API base URL |

---

## Updating Production

```powershell
git add .
git commit -m "Your change description"
git push origin main
```

- **Render:** auto-deploys on push to `main` (if auto-deploy enabled)
- **Vercel:** auto-deploys on push to `main`
- Migrations run automatically on Render startup

---

## Support

- [Supabase Docs](https://supabase.com/docs)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Prisma + Supabase](https://www.prisma.io/docs/guides/database/supabase)
- [ntfy.sh Docs](https://docs.ntfy.sh)

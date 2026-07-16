# OpportunityVault

> **AI-powered smart tracker for scholarships, jobs, internships, fellowships, research programs, competitions, and more.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-opportunity--vault--client.vercel.app-2563eb?style=flat-square&logo=vercel)](https://opportunity-vault-client.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](./LICENSE)

🌐 **Live app:** https://opportunity-vault-client.vercel.app

---

## Table of Contents

- [What is OpportunityVault?](#what-is-opportunityvault)
- [Features](#features)
- [Screenshots](#screenshots)
- [AI Provider Setup (Detailed Guide)](#ai-provider-setup-detailed-guide)
  - [How AI Extraction Works](#how-ai-extraction-works)
  - [Provider 1: Groq — Llama 3.3 70B](#provider-1-groq--llama-33-70b-recommended)
  - [Provider 2: Z.ai GLM-4 Flash (ZhipuAI)](#provider-2-zai-glm-4-flash-zhipuai)
  - [Provider 3: Google Gemini 1.5 Flash](#provider-3-google-gemini-15-flash)
  - [Provider 4: Mistral Small](#provider-4-mistral-small)
  - [Provider 5: Ollama (Local / Offline)](#provider-5-ollama-local--offline)
  - [Configuring Providers in the App](#configuring-providers-in-the-app)
  - [Testing Your API Keys](#testing-your-api-keys)
  - [How the Fallback Chain Works](#how-the-fallback-chain-works)
- [ntfy.sh Push Notifications](#ntfysh-push-notifications)
- [Notion Export](#notion-export)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## What is OpportunityVault?

OpportunityVault is a personal opportunity management system designed for students, researchers, and professionals who apply to scholarships, fellowships, internships, jobs, research programs, conferences, and competitions.

**The core idea:** Instead of manually filling out forms, you simply **paste the raw announcement text** (from emails, websites, PDFs, or social media) into the app. The AI reads it and instantly extracts every structured detail — name, organization, type, countries, deadline, funding, eligibility, application link, and more. You review, save, and the app tracks everything from there.

---

## Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Extraction** | Paste any raw text or drop a screenshot — AI extracts all details automatically into structured fields |
| 📋 **List Management** | Server-side pagination (20 / 50 / 100 rows), URL-persistent filters, toggleable columns |
| 🔍 **Smart Filtering** | Filter by type, status, urgency, country, or free-text search with live filter chip display |
| ↕️ **Flexible Sorting** | Sort by Date Added, Deadline, Name, Status, Type, Urgency, or Last Updated |
| ☑️ **Batch Actions** | Select multiple rows → bulk status update or bulk delete in one click |
| ⚡ **Urgency System** | Dynamic deadline urgency — Critical / High / Medium / Low — colour-coded everywhere |
| 📊 **Dashboard** | Stats cards, urgent items, deadline timeline, type breakdown donut chart, application funnel |
| 🔔 **ntfy.sh Notifications** | Deadline alerts (1 / 3 / 7 days before), status changes, weekly digest — on your phone |
| 📤 **Export** | CSV, JSON, and direct Notion database sync |
| 🔐 **JWT Auth** | Access + refresh tokens with silent renewal — stays logged in securely |
| 🌗 **Responsive** | Full-featured table view on desktop; card view auto-enabled on mobile |

---

## Screenshots

### 1. Create Your Account

![Create Account](./Figures/001-Create%20your%20account%20tab.png)

Registration is free with no credit card required. Fill in an optional display name, your email, and a password (minimum 6 characters), then click **Create account →**.

---

### 2. Login

![Login](./Figures/002-%20Login%20%20account%20tab.png)

Use your registered email and password to sign in. The app uses JWT tokens with automatic silent refresh, so you stay logged in across browser sessions.

---

### 3. Dashboard

![Dashboard](./Figures/003-%20Dashboard%20tab.png)

The Dashboard gives you a full picture of your pipeline at a glance:

- **Total Saved** — all opportunities ever added
- **Applications** — how many you've submitted
- **Urgent Deadlines** — opportunities with ≤7 days remaining
- **Accepted** — successful outcomes
- **Needs Immediate Attention** — the most critical upcoming deadline, with a direct **Apply Now** link
- **Upcoming Deadlines** — next items sorted by deadline
- **Type Breakdown** — donut chart by category (Scholarship, Internship, Fellowship, etc.)
- **Application Funnel** — Saved → Planning → In Progress → Applied → Interview → Accepted

---

### 4. Add Opportunity (AI Extraction)

![Add Opportunity](./Figures/004-Add%20Opportunity%20tab.png)

This is the core feature. See the [AI Extraction section](#how-ai-extraction-works) below for the full step-by-step guide.

---

### 5. Opportunity List

![Opportunity List](./Figures/Opportunity%20List.png)

The list page supports filtering by type, status, urgency, and country; sorting; column toggle; batch selection; and rows-per-page control (20 / 50 / 100).

---

### 6. AI Provider Settings

![AI Provider Settings](./Figures/Al%20Provider%20tab.png)

Configure which AI model powers your extractions. See the [full AI provider guide](#ai-provider-setup-detailed-guide) below.

---

### 7. Account Settings

![Account Settings](./Figures/Account%20setting.png)

Update your display name, change your password, or permanently delete your account from the **Settings → Account** tab.

---

## AI Provider Setup (Detailed Guide)

OpportunityVault supports **5 AI providers**. You can configure a personal API key per provider directly inside the app — no re-deployment needed. Here is everything you need to know.

### How AI Extraction Works

The **Add Opportunity** page is the heart of the app. Here is the exact workflow:

**Step 1 — Find an opportunity announcement**

Copy the full raw text of any scholarship, job posting, fellowship, grant, or program announcement. The source can be:
- An email body
- A website (copy-paste the full text from the page)
- A PDF (copy the text from it)
- A social media post (LinkedIn, Twitter/X, Facebook)
- A university announcement or portal

The more text you include, the better the AI performs. There is no need to clean or format it — paste it messy, the AI handles everything.

**Step 2 — Paste into the text box**

On the **Add Opportunity** page, paste the raw text into the large input area labelled _"Paste the full text here, or drag & drop an image/poster..."_.

- The character count appears at the bottom right of the box.
- You can also **drag & drop an image** (poster, screenshot, flyer) directly onto the drop zone, or click **Browse Image** to upload it. The AI will read the image visually.
- Click **Clear** (top right of the box) to reset the input.

**Step 3 — Select your AI provider**

Below the text box, there is a dropdown showing your currently selected AI model (e.g. `GLM (Z.ai) — ZhipuAI`). Click it to switch providers before extracting.

**Step 4 — Click "Extract with AI"**

Click the blue **✦ Extract with AI** button. The AI sends your text (or image) to the selected provider and returns structured data. The **AI Preview** panel on the right fills in with:

- Name of the opportunity
- Organization / issuer
- Type (Scholarship, Fellowship, Job, etc.)
- Country / countries
- Deadline date
- Funding details
- Eligibility requirements
- Application link

**Step 5 — Review and edit**

You can edit any auto-extracted field before saving. Fields the AI was uncertain about are flagged with a low-confidence warning so you know what to double-check.

**Step 6 — Save**

Click **Save** to store the opportunity. It immediately appears in your list and dashboard. A push notification is sent to your phone if ntfy is configured.

> **Fill manually** — If you prefer not to use AI, click the **Fill manually** button (top right of the Add page) to enter all fields yourself in a standard form.

---

### Provider 1: Groq — Llama 3.3 70B ✅ Recommended

**Why use it:** Groq is the fastest provider by far (sub-second responses), uses Meta's Llama 3.3 70B model, and has a generous free tier. This is the recommended starting point.

**Limitations:** Rate limits on the free tier (roughly 30 requests/minute, 14,400/day). For heavy personal use, this is more than sufficient.

**How to get a free Groq API key:**

1. Go to **https://console.groq.com**
2. Click **Sign Up** — use Google, GitHub, or email
3. After logging in, click **API Keys** in the left sidebar
4. Click **Create API Key**
5. Give it a name (e.g. `opportunityvault`)
6. **Copy the key immediately** — it starts with `gsk_` — it is only shown once
7. Store it safely (e.g. in a password manager)

**Key format:** `gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

### Provider 2: Z.ai GLM-4 Flash (ZhipuAI)

**Why use it:** ZhipuAI's GLM-4 Flash model is fast and well-suited for multilingual text (strong for Chinese, English, and other languages). It has a free tier.

**How to get a free Z.ai / ZhipuAI API key:**

1. Go to **https://open.bigmodel.cn** (ZhipuAI) or **https://www.zhipuai.cn**
2. Click **Register** / **注册** — you can use an email address
3. After logging in, navigate to **API Keys** (API 密钥) in your account dashboard
4. Click **Create API Key** (创建 API 密钥)
5. Copy the generated key
6. Note: New accounts receive free credits to get started

**Key format:** Typically a long alphanumeric string

> **Tip:** If you are outside China, the international portal at **https://open.bigmodel.cn** is recommended. Registration requires an email address and phone number verification.

---

### Provider 3: Google Gemini 1.5 Flash

**Why use it:** Google's Gemini 1.5 Flash is excellent at understanding images/screenshots and is free via Google AI Studio with generous rate limits (15 requests/minute, 1 million tokens/day on the free tier).

**How to get a free Gemini API key:**

1. Go to **https://aistudio.google.com**
2. Sign in with your **Google account**
3. Click **Get API key** in the top navigation, or go to **https://aistudio.google.com/app/apikey**
4. Click **Create API key in new project** (or select an existing Google Cloud project)
5. The key is generated instantly — copy it
6. No billing setup required for the free tier

**Key format:** `AIzaSy...` (starts with `AIzaSy`, ~39 characters total)

**Image extraction:** Gemini is the best provider for extracting data from uploaded images and posters, as it has native vision capabilities.

---

### Provider 4: Mistral Small

**Why use it:** Mistral Small is a compact, efficient model from Mistral AI (a French AI company). It has a free tier and is a good alternative if Groq is unavailable.

**How to get a free Mistral API key:**

1. Go to **https://console.mistral.ai**
2. Click **Sign Up** — use Google or email
3. Verify your email address
4. In the dashboard, go to **API Keys** in the left sidebar
5. Click **Create new key**
6. Name it (e.g. `opportunityvault`) and click **Create**
7. **Copy the key immediately** — it is shown only once
8. Note: The free tier ("Experiment" plan) gives you access to Mistral Small with rate limits sufficient for personal use

**Key format:** Alphanumeric string, typically starting with a random character sequence

---

### Provider 5: Ollama (Local / Offline)

**Why use it:** Ollama runs entirely on your own machine — no API key, no internet connection needed, no usage limits, and complete privacy (your data never leaves your computer).

**Limitations:** Requires a computer with enough RAM (at least 8GB for small models, 16GB+ recommended for better models). Speed depends on your hardware. Not available in the cloud-hosted (Vercel + Render) deployment unless you expose your Ollama instance publicly.

**How to set up Ollama:**

1. Go to **https://ollama.com**
2. Download and install Ollama for your OS (Windows, macOS, Linux)
3. Open a terminal and pull a model:
   ```bash
   ollama pull llama3.2        # ~2GB — recommended for speed
   # or
   ollama pull mistral         # ~4GB — better quality
   # or
   ollama pull llama3.1:8b    # ~5GB — high quality
   ```
4. Ollama starts automatically and listens on `http://localhost:11434`
5. No API key needed — just select **Ollama (Local)** in the app

---

### Configuring Providers in the App

All provider configuration happens in **Settings → AI Provider** — no code changes or redeployment required.

![AI Provider Settings](./Figures/Al%20Provider%20tab.png)

**Step-by-step:**

1. Navigate to **Settings** (in the left sidebar) → click the **AI Provider** tab
2. You will see all 5 providers listed as radio button cards:
   - **Groq (Llama 3.3 70B)** — Fastest • Free tier
   - **Z.ai GLM-4 Flash** — ZhipuAI • Fast
   - **Google Gemini 1.5 Flash** — Google • Free tier
   - **Mistral Small** — Mistral AI • Free
   - **Ollama (Local)** — Self-hosted • No key
3. **Click on a provider card** to select it as your primary provider. The card turns blue and the selection is saved instantly to the server.
4. **Enter your API key** in the text field below each provider (shown as "... API Key (Optional)"). Each provider has its own separate key field.
   - The key field shows dots (`•••••`) by default. Click the 👁 eye icon to reveal/hide it.
   - Keys are saved **per user** in the database and used for all your personal extractions.
   - If a field says *"Optional"*, it means the server has a global fallback key configured — your personal key will take priority over the server key if both are present.
5. **Keys are auto-saved** when you click out of the field. A "API keys saved" toast notification confirms success.
6. If you have entered any keys manually, a **Save API Keys** button also appears at the bottom to save all keys at once.

> **Privacy note:** Your personal API keys are stored in the database associated with your user account. They are sent to the AI provider only when you trigger an extraction — they are never logged or shared.

---

### Testing Your API Keys

Every provider card has a **Test** button on the right side. Click it to:

1. Send a short test extraction request to that specific provider using your configured key
2. If the test **succeeds**: you'll see a green toast — `"Test extraction succeeded!"`
3. If the test **fails**: you'll see a red toast — `"Test failed — check API key for this provider"`

**What to do if a test fails:**

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Test fails immediately | Wrong or missing API key | Re-copy the key from the provider console |
| Test fails with timeout | Provider is slow / overloaded | Try again in a minute |
| Test fails only for Ollama | Ollama is not running | Run `ollama serve` or restart the Ollama app |
| Test fails for all providers | Server env var missing | Set `GROQ_API_KEY` (or another provider key) in your server environment variables |

---

### How the Fallback Chain Works

When you click **Extract with AI**, the system uses the following priority order:

```
1. Your personal API key for the selected provider (set in Settings)
        ↓ (if missing or fails)
2. The server-level API key for that provider (set as an environment variable)
        ↓ (if also missing or fails)
3. Try the next provider in the chain: Groq → Gemini → Mistral → Zhipu → Ollama
        ↓ (if all fail)
4. Return an error — "AI extraction failed"
```

This means:
- If you have a personal Groq key in Settings and select Groq, your key is used first.
- If your key runs out of quota, the server's shared Groq key (if configured) is tried next.
- If Groq fails entirely, the system automatically tries Gemini, then Mistral, etc.
- You will always see which provider actually performed the extraction in the results.

The active AI provider is shown in the **top navigation bar** (e.g. `● GLM (Z.ai)` in the screenshot above) so you always know what's being used.

---

## ntfy.sh Push Notifications

OpportunityVault sends push notifications to your phone via [ntfy.sh](https://ntfy.sh) — a free, open-source service with no account required.

### Setup

1. Install the **ntfy** app: [Android (Play Store)](https://play.google.com/store/apps/details?id=io.heckel.ntfy) | [iOS (App Store)](https://apps.apple.com/app/ntfy/id1625396347)
2. Open the app → tap **+** → subscribe to a unique topic name of your choice (e.g. `opportunityvault-yourname-abc123`)
   - Keep your topic name private — topics are publicly accessible on ntfy.sh by URL
   - Use a random suffix to make it hard to guess (e.g. add numbers or letters)
3. In OpportunityVault: go to **Settings → Notifications**
4. Enter the exact same topic name in the **ntfy Topic** field
5. Click **Test** — you should receive a test notification on your phone within seconds
6. Toggle **Enable notifications** on

---

## Notion Export

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations) → **New integration**
2. Name it (e.g. `OpportunityVault`), select your workspace → **Submit**
3. Copy the **Internal Integration Token** (`secret_...`)
4. Create a Notion database with these exact property names and types:
   - `Name` → Title
   - `Type` → Select
   - `Deadline` → Date
   - `Status` → Select
   - `Countries` → Multi-select
   - `Apply Link` → URL
   - `Notes` → Rich text
5. Open the database → click **···** (top right) → **Add connections** → select your integration
6. Copy the database ID from the URL: `notion.so/your-workspace/{DATABASE_ID}?v=...`
7. In OpportunityVault: **Settings → Export** → paste your integration token and database ID → **Sync to Notion**

---

## Project Structure

```
opportunityvault/
├── Figures/                     # App screenshots (used in this README)
├── client/                      # React 18 + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── cards/           # OpportunityCard, UrgentBanner
│       │   ├── table/           # OpportunityTable, filters, sort, chips
│       │   ├── ui/              # Button, Badge, Pagination, Modal, …
│       │   ├── dashboard/       # Dashboard widgets and charts
│       │   └── settings/        # Account, Notifications, AI Provider, Export tabs
│       ├── hooks/               # useOpportunities, useFilters, useMediaQuery, …
│       ├── pages/               # Dashboard, Opportunities, Add, AddManual, Detail, Settings
│       ├── services/            # API client functions (fetch wrappers)
│       ├── store/               # Zustand global state (auth, opportunities, settings)
│       └── types/               # Shared TypeScript interfaces and enums
├── server/                      # Node.js + Express backend
│   └── src/
│       ├── controllers/         # Route handler functions
│       ├── routes/              # Express routers
│       ├── services/
│       │   ├── ai/              # Per-provider AI extraction logic
│       │   ├── extraction.service.ts  # Fallback chain orchestration
│       │   ├── notification.service.ts
│       │   ├── export.service.ts
│       │   └── deadline.service.ts
│       ├── middleware/          # Auth (JWT), error handling
│       ├── lib/                 # Prisma client wrapper
│       ├── jobs/                # node-cron deadline monitor + weekly summary
│       ├── prisma/              # schema.prisma + migrations
│       └── utils/               # Urgency calculator, serialization helpers
├── docker-compose.yml           # Local PostgreSQL (matches production schema)
├── render.yaml                  # Render Blueprint — auto-deploy config
├── DEPLOYMENT.md                # Full production deployment guide
└── .env.example                 # Environment variable template with comments
```

---

## Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org/): `git commit -m "feat: add your feature"`
4. Push and open a Pull Request against `main`

Please keep PRs focused — one feature or fix per PR. Include screenshots for UI changes.

---

## License

[MIT](./LICENSE) © [duleab](https://github.com/duleab)

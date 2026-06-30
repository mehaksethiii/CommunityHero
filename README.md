# Community Hero — Hyperlocal Problem Solver

A civic issue reporting platform where citizens report, verify, and track local infrastructure problems using real-time maps, community verification, and AI-powered assistance.

---

## Tech Stack

- **Frontend:** React 18, Vite, TypeScript
- **Styling:** Tailwind CSS
- **Maps:** Leaflet + OpenStreetMap (free, no billing)
- **Database:** Firebase Firestore (real-time)
- **Auth:** Firebase Authentication (Google Sign-In)
- **State Management:** Zustand
- **Forms:** React Hook Form
- **Charts:** Recharts
- **Deployment:** Google Cloud Run (Docker + Nginx)

---

## Core Features

- Photo-based issue reporting with drag-and-drop upload
- AI-powered issue categorization via Gemini Vision (on image upload)
- Interactive map with color-coded markers by issue status
- Community verification — 3+ verifications auto-escalates issue to "Verified"
- Real-time issue feed with filters by category and status
- AI Resolution Plan — department, helpline, action steps, complaint letter
- Impact dashboard with pie charts, trend lines, ward-level analytics
- Predictive insights powered by Gemini AI
- Gamification — points system, 8 unlockable badges, live leaderboard
- Google Sign-In authentication

---

## Future Enhancements

- **AI-powered issue categorization via Gemini Vision** — automatic image analysis to detect pothole, water leakage, etc. from uploaded photos (requires valid Gemini API key with billing enabled)
- **CivicBot** — AI chatbot powered by Gemini for answering citizen queries, drafting complaint letters, and guiding resolution
- **Push notifications** — alert citizens when their reported issue gets verified or resolved
- **Authority dashboard** — separate view for municipal officers to manage and update issue status
- **Offline support** — PWA with service workers for reporting without internet
- **Multi-language support** — Hindi and regional Indian languages
- **Voice reporting** — describe an issue verbally using speech-to-text

---

## Project Structure

```
community-hero/
├── src/
│   ├── components/
│   │   ├── common/        # Layout, Navbar, Sidebar, IssueCard, IssueDetail
│   │   └── report/        # MediaUploader, LocationPicker, AiSuggestion
│   ├── lib/
│   │   ├── firebase.ts    # Firebase config
│   │   ├── gemini.ts      # Gemini AI calls
│   │   ├── badges.ts      # Badge system
│   │   └── seedData.ts    # Sample data seeder
│   ├── pages/             # Feed, Map, Report, Dashboard, Leaderboard, Profile
│   ├── store/             # Zustand stores (auth, issues)
│   └── types/             # TypeScript types
├── .env.example
├── Dockerfile
├── nginx.conf
└── vite.config.ts
```

---

## Setup & Run

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Fill in Firebase and Gemini API keys
```

### 3. Run locally
```bash
npm run dev
# Open http://localhost:5173
```

### 4. Build for production
```bash
npm run build
```

### 5. Deploy to Google Cloud Run
```bash
docker build -t community-hero .
docker tag community-hero gcr.io/<your-project-id>/community-hero
docker push gcr.io/<your-project-id>/community-hero
gcloud run deploy community-hero \
  --image gcr.io/<your-project-id>/community-hero \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated
```

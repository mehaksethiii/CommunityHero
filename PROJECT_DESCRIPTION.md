# Community Hero — Hyperlocal Problem Solver
### Vibe2Ship Hackathon | Coding Ninjas x Google for Developers

---

## Problem Statement Selected
**Community Hero — Hyperlocal Problem Solver**

---

## The Problem

Every day, millions of Indians deal with broken roads, burst water pipes, dead streetlights, and overflowing garbage dumps. The frustrating part isn't just the problem itself — it's not knowing who to call, where to report, or whether anything will ever get done. Existing systems are fragmented, non-transparent, and offer zero community participation.

People give up. Issues go unresolved for months. And the cycle continues.

---

## Our Solution

**Community Hero** is an AI-powered civic issue reporting platform that turns passive citizens into active community heroes. Anyone can report a local infrastructure problem, get it verified by neighbors, track it in real time on a map, and receive an AI-generated resolution plan — complete with the right government department, helpline number, and a ready-to-send complaint letter.

The platform creates a transparent, accountable loop between citizens and local authorities — powered by AI, built on Google Cloud.

---

## How It Works

1. **Report** — A citizen spots a pothole, water leak, or broken streetlight. They open Community Hero, upload a photo, and drop a pin on the map. Gemini AI instantly analyzes the image, identifies the issue type, suggests priority, and auto-fills the category.

2. **Verify** — Other community members in the area see the report on their feed and map. They upvote and verify it. Once 3+ people verify an issue, it automatically gets promoted to "Verified" status — adding credibility and urgency.

3. **Resolve** — The reporter clicks "Get Resolution Plan" and instantly receives the responsible government department, a helpline number, estimated resolution time, step-by-step action guide, and a pre-written formal complaint letter they can copy and send.

4. **Track** — Everyone can see issue status updates (Open → Verified → In Progress → Resolved) on a live map and feed in real time.

5. **Engage** — Citizens earn points and badges for reporting and verifying issues, creating a gamified incentive loop that drives community participation.

---

## Key Features

- **AI-Powered Image Analysis** — Upload a photo of any civic issue and Gemini AI auto-detects the category (pothole, water leakage, streetlight, waste, road damage, tree hazard), suggests priority level, and generates descriptive tags

- **Real-Time Issue Feed** — Browse all reported issues with filters by category and status. See live updates as issues get verified and resolved

- **Interactive Map** — All issues plotted on a live OpenStreetMap with color-coded markers by status (red = open, blue = verified, yellow = in progress, green = resolved)

- **Community Verification** — Citizens upvote and verify reports. Issues with 3+ verifications auto-escalate to "Verified" — adding social proof and urgency for authorities

- **AI Resolution Plan** — Every issue gets a complete resolution guide: responsible department, helpline number, action steps, and a pre-written complaint letter the citizen can copy and send

- **Impact Dashboard** — Visual analytics showing total issues, resolution rates, category breakdown (pie chart), monthly trends (line chart), and top problem areas by ward

- **Predictive Insights** — Gemini AI analyzes community data and generates insights about recurring problems and what authorities should prioritize

- **Gamification** — Points system (+10 per report, +5 per verification), badges (First Reporter, Active Reporter, Community Champion, Truth Seeker), and a live leaderboard

- **Google Authentication** — One-click sign in with Google account

---

## Technologies Used

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS |
| Maps | Leaflet + OpenStreetMap |
| State Management | Zustand |
| Forms | React Hook Form |
| Charts | Recharts |
| Routing | React Router v6 |
| Deployment | Google Cloud Run + Docker + Nginx |

---

## Google Technologies Utilized

| Google Technology | How We Used It |
|-------------------|---------------|
| **Firebase Authentication** | Google Sign-In for all users — one-click login with Google account |
| **Cloud Firestore** | Real-time NoSQL database storing all issues, users, verifications, and upvotes with live sync across all clients |
| **Gemini 1.5 Flash (Google AI)** | Image analysis for auto-categorizing civic issues from photos, generating resolution plans, and producing predictive community insights |
| **Google Cloud Run** | Containerized deployment of the React app via Docker — fully managed, serverless, auto-scaling |

---

## Impact

Community Hero directly addresses the gap between citizens and local governance. By making issue reporting simple (one photo + one tap), verification social (community-driven), and resolution actionable (AI-generated plans), we create a platform that doesn't just collect complaints — it drives resolution.

The gamification layer ensures sustained engagement beyond one-time reporting. The dashboard gives both citizens and potential municipal authorities a clear picture of community health.

---

## Future Enhancements

- **AI-powered issue categorization via Gemini Vision** — automatic image analysis to detect issue type from uploaded photos with confidence scores and auto-tagging (requires Gemini API key)
- **CivicBot** — AI chatbot powered by Gemini 1.5 Flash for answering citizen queries, drafting complaint letters, and step-by-step resolution guidance
- **Real-time authority notifications** — push alerts to municipal officers when issues cross verification thresholds
- **Authority dashboard** — separate portal for municipal officers to claim, update, and resolve issues
- **Offline-first PWA** — service workers for reporting issues without internet connectivity
- **Multi-language support** — Hindi and regional Indian languages for wider accessibility
- **Voice reporting** — describe an issue verbally using speech-to-text
- **Social sharing** — share issue reports to WhatsApp/Twitter to amplify community pressure

---

## Team

Built for Vibe2Ship Hackathon — Coding Ninjas x Google for Developers
Submission Deadline: June 29, 2026

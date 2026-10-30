# Aarohan Grievance360
### Smart India Hackathon 2026 — Problem Statement 26264
**Centralized Redressal Scrutiny, Institutional Accountability & Overlap Detection System**

> **Tagline:** One Institution. One Unified View. Complete Accountability.

---

## 📌 Problem Overview
Educational institutions under AICTE frequently receive complaints from students, teachers, and faculty members. Different AICTE bureaus and cells—including the Regional Bureau (RB) and Public Grievance Redressal Cell (PGRC)—regularly process complaints concerning the same institution independently without central coordination.

This leads to:
- Duplicate or overlapping complaints across bureaus.
- Multiple offices investigating the same institutional issue without coordination.
- Difficulty monitoring statutory 15-day resolution deadlines and officer accountability.
- Lack of a unified institutional dossier showing historical compliance.

**Aarohan Grievance360** centralizes complaint tracking, provides a unified institutional profile, automatically detects related cross-bureau cases, enforces statutory SLAs, and enables institutional Action Taken Reports (ATRs).

---

## 🚀 Key Features

### 1. Student / Teacher Portal (`/student`)
- **Lodge Grievance**: Confidential or whistleblower anonymous complaint submission with auto-generated tracking numbers (e.g., `AICTE-2026-DL-8901`).
- **Live Status Stepper**: 5-stage visual tracking pipeline showing intake, bureau routing, institutional ATR, inquiry, and disposal.
- **Clarification Workflow**: Direct channel for complainants to review officer clarification requests and submit responses with evidence.
- **My Complaints Register**: Filter complaints by category, status, and submission date.

### 2. Institution Dashboard (`/institution`)
- **Active Institution Scope**: Switch between connected technical campuses or inspect the consolidated register.
- **Action Taken Report (ATR) Filing**: Submit official inquiry explanations, corrective remedy resolutions, and upload signed committee minutes.
- **SLA Countdown & Overdue Alerts**: 15-day countdown timers tracking compliance deadlines.
- **Audit History**: Track previous complaints, institutional responses, and grievance categories.

### 3. AICTE Central Admin & Overlap Detection Center (`/admin`)
- **Master Complaint Register**: Multi-parameter search, bureau filters (RB vs PGRC), priority tags, status updates, and CSV export.
- **Overlap Detection Engine (Core Innovation)**: Real-time text similarity & PID matching engine flagging duplicate or related cases across bureaus with explainable confidence indicators.
- **Side-by-Side Comparison Modal**: Review case narratives concurrently, establish inter-bureau links, or dismiss non-correlations.
- **Unified Institution Directory**: Institutional dossiers aggregating cross-bureau complaints, compliance performance, and nodal officer contacts.

---

## 🛠️ Technology Stack
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts & Metrics**: [Recharts](https://recharts.org/)
- **State & Persistence**: LocalStorage Service with seeded initial scenarios & reset capability
- **Deployment**: Vercel-ready with zero server-side lock-in

---

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/nothing123-a/Aarohan2.git
cd Aarohan2
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🌐 Deploy to Vercel
This repository is configured for out-of-the-box deployment on Vercel:
1. Push your changes to GitHub.
2. Import the repository in [Vercel](https://vercel.com/new).
3. Framework Preset: **Next.js**
4. Root Directory: `./`
5. Click **Deploy**.

---

## ⚖️ Disclaimer
*This project is a prototype developed for Smart India Hackathon 2026 (Problem Statement 26264). Demonstration data is fictional and does not represent official AICTE records.*


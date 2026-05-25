<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=300&color=gradient&text=OverDrive%20Frontend%&descAlign=53&descAlignY=53&animation=fadeIn&fontSize=30&textBg=false"/>
</p>

<h3 align="center">Over-Drive — AI Vehicle Valuation Platform (Frontend)</h3>

<p align="center">
  Modern, responsive React web application for intelligent used vehicle valuation in Kenya.
</p>

---

## Features

- **AI-Powered Vehicle Analysis** — Upload photos and get instant AI condition assessment
- **Real Kenyan Market Valuation** — Accurate pricing based on local market data
- **Detailed Reports** — Condition score, risk level, comparables, and buyer recommendations
- **Image Analysis** — Per-image breakdown with positives, issues & repair suggestions
- **Beautiful UI/UX** — Dark modern design with smooth animations
- **History & Saved Valuations** — Track all previous valuations
- **Mobile Responsive** — Works perfectly on phones and tablets

---

## Tech Stack

- **React 18** + **Vite**
- **React Router v6**
- **Lucide React** (Icons)
- **Tailwind CSS** (with custom CSS)
- **Context API** (Toast, Auth, etc.)
- **Axios** (API calls)
- **React Hot Toast** / Custom Toast System

---

## Project Structure

```bash
over-drive-frontend/
├── src/
│   ├── components/          # Reusable components
│   ├── pages/               # Main pages (History, ValuationResult, etc.)
│   ├── Context/             # React Contexts (Toast, Auth)
│   ├── assets/
│   ├── App.jsx
│   └── main.jsx
├── public/
├── .env
├── vite.config.js
└── package.json
```

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/over-drive-frontend.git
cd over-drive-frontend
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Variables (`.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
# VITE_API_BASE_URL=https://your-backend.onrender.com/api   # Production
```

### 4. Run Development Server
```bash
npm run dev
```

App runs at: `http://localhost:5173`

---

## Key Pages

- `/` — Landing / Home
- `/login` — User Login
- `/register` — User Registration
- `/dashboard` — Main Dashboard
- `/history` — Valuation History
- `/valuation/:id` or via state — **Valuation Result** (Detailed Report)
- `/upload` — Vehicle Image Upload

---

## Main Features Implemented

- Vehicle photo upload with preview
- AI valuation result page with:
  - Recommended price
  - Condition score + Risk level
  - Detailed image-by-image analysis
  - Smart buyer recommendation
  - Market comparables
- Responsive design (Mobile-first)
- Toast notifications
- Clean state management

---

## Backend Connection

The frontend connects to the **Over-Drive Backend** via REST API.

Make sure your backend is running on the URL specified in `VITE_API_BASE_URL`.

---

## Deployment

### Vercel / Netlify (Recommended)

1. Push code to GitHub
2. Import project in Vercel/Netlify
3. Add Environment Variable:
   - `VITE_API_BASE_URL` → your backend URL

### Build Command
```bash
npm run build
```

### Preview Locally
```bash
npm run preview
```

---

# Contributors

This project was developed by:

1. Mary Onyango
2. Nelson Romeo
3. Noah Kemboi
4. Jelagat Asumpta
5. Angella Musamali

---

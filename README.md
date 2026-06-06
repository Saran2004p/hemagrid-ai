# 🩸 BloodBridge AI — Firebase Deployment Guide

## ⚡ Prerequisites (Install Once)

```bash
# Install Node.js 18+ from https://nodejs.org

# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login
```

---

## 🔥 Step 1 — Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Add Project" → Name: `bloodbridge-ai`
3. Left sidebar → "Firestore Database" → "Create Database"
4. Select "Start in test mode"
5. Region: `asia-south1` (Mumbai)
6. Click Enable

---

## 🔧 Step 2 — Update Project ID

Get your Project ID from Firebase Console (top of page)

Update `.firebaserc`:
```json
{
  "projects": {
    "default": "YOUR-PROJECT-ID-HERE"
  }
}
```

Update `frontend/src/api.js` — replace `bloodbridge-ai-XXXXX` with your actual project ID in both URLs.

---

## 📦 Step 3 — Install Dependencies

```bash
# Install functions dependencies
cd functions
npm install
cd ..
```

---

## 🏗️ Step 4 — Build Frontend

```bash
# Copy your bloodbridge-ai folder into this project as 'frontend'
# Then build it:
cd frontend
npm install --legacy-peer-deps
npm run build
cd ..
```

---

## 🚀 Step 5 — Deploy Everything

```bash
# From the bloodbridge-firebase folder:
firebase deploy
```

This deploys:
- ✅ Firestore rules & indexes
- ✅ Cloud Functions (backend API)
- ✅ Frontend (React app)

---

## 🌐 Your Live URLs After Deploy

```
Frontend:  https://bloodbridge-ai-XXXXX.web.app
API:       https://asia-south1-bloodbridge-ai-XXXXX.cloudfunctions.net/api
```

---

## 🧪 Test Locally First (Optional)

```bash
# Install emulators
firebase init emulators

# Start local emulators
firebase emulators:start

# Frontend runs at: http://localhost:5000
# Functions run at: http://localhost:5001
# Firestore UI at:  http://localhost:4000
```

---

## ✅ API Endpoints (Same as before)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/donors/register` | Register donor → saves to Firestore |
| GET | `/donors/stats?city=Chennai&bloodType=O+` | AI Finder live data |
| GET | `/donors/city-summary` | City donor counts for map |
| POST | `/requests` | Submit request → triggers AI Pulse |
| GET | `/requests/live-pulse` | Live map data |
| GET | `/requests/stats` | Dashboard stats |

---

## 🔍 View Your Data

In Firebase Console → Firestore Database → you'll see:
- `donors` collection — all registered donors
- `bloodRequests` collection — all blood requests

No more MongoDB Atlas network issues! 🎉

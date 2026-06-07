# 🩸 BloodBridge AI — Free Deployment Guide

## Architecture (100% Free)
```
Frontend  → Firebase Hosting  (free)
Backend   → Render.com        (free)
Database  → Firebase Firestore (free)
```

---

## PART 1 — Deploy Backend to Render (Free)

### Step 1 — Push backend to GitHub
1. Go to https://github.com → Create new repo → `bloodbridge-backend`
2. Upload all files from this `bloodbridge-render` folder

### Step 2 — Deploy on Render
1. Go to https://render.com → Sign up free
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Fill in:
   - Name: `bloodbridge-backend`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Click "Create Web Service"

### Step 3 — Get your backend URL
After deploy, Render gives you:
```
https://bloodbridge-backend.onrender.com
```

### Step 4 — Add Firebase Service Account (for real DB)
In Render Dashboard → Environment Variables → Add:
```
FIREBASE_SERVICE_ACCOUNT = (paste your service account JSON)
CLIENT_URL = https://bloodbridge-ai.web.app
NODE_ENV = production
```

To get service account JSON:
- Firebase Console → Settings ⚙️ → Service Accounts
- Click "Generate New Private Key"
- Copy the entire JSON content

---

## PART 2 — Deploy Frontend to Firebase Hosting (Free)

### Step 1 — Update API URL in frontend
Open `bloodbridge-ai-v3/src/api.js` and set:
```javascript
 BASE_URL = 'https://bloodbridge-backend.onrender.com'
```

### Step 2 — Rebuild frontend
```bash
cd bloodbridge-ai-v3
npm run build
cd ..
```

### Step 3 — Deploy frontend only
```bash
firebase deploy --only hosting
```

---

## ✅ Your Live URLs

```
🌐 Website: https://bloodbridge-ai.web.app
🔗 API:     https://bloodbridge-backend.onrender.com
```

---

## ⚡ Works Without Firebase Too!
The backend has a built-in fallback mode with demo data.
Even if Firebase is not configured, all API endpoints work perfectly.

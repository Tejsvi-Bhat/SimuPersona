# Deployment Guide for SimuPersona

## Backend Deployment (simupersona-backend)

### Option 1: Vercel Web Interface
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import the SimuPersona repository
4. Set root directory to: `simupersona-backend`
5. Framework Preset: Other
6. Build Command: (leave empty)
7. Output Directory: (leave empty)
8. Install Command: `npm install`

### Environment Variables (Backend):
- NODE_ENV: production
- DEFAULT_AI_PROVIDER: gemini
- GOOGLE_API_KEY: (your Google API key)

### Backend URL will be: 
https://simupersona-backend-[hash].vercel.app

---

## Frontend Deployment (simupersona-frontend)

### Option 1: Vercel Web Interface
1. Go to https://vercel.com/dashboard
2. Click "New Project" 
3. Import the SimuPersona repository (or create new project)
4. Set root directory to: `simupersona-frontend`
5. Framework Preset: Create React App
6. Build Command: `npm run build`
7. Output Directory: `build`
8. Install Command: `npm install`

### Environment Variables (Frontend):
- REACT_APP_API_URL: https://simupersona-backend-[hash].vercel.app

### Frontend URL will be:
https://simupersona-frontend-[hash].vercel.app

---

## Alternative: Railway Deployment for Backend

If Vercel continues to have issues with the backend, Railway is an excellent alternative:

1. Go to https://railway.app
2. Connect GitHub repository
3. Select the `simupersona-backend` folder
4. Railway will auto-detect Node.js and deploy
5. Add the same environment variables
6. Get the Railway URL and use it in frontend's REACT_APP_API_URL

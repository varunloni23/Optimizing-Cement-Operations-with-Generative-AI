# Render Deployment Configuration

## Issue Fixed
The frontend was showing "DISCONNECTED" because it was deployed as static files instead of a server-side Next.js application.

## Changes Made

### 1. next.config.js
- Removed `output: 'export'` to enable server-side rendering
- This allows WebSocket connections to work properly

### 2. package.json
- Changed `start` script from `npx serve@latest out` to `next start`
- This runs the app as a Next.js server instead of static files

## Render Configuration

In your Render dashboard for the frontend service:

### Build Settings
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### Environment Variables
Add these in Render dashboard → Environment:
```
NEXT_PUBLIC_BACKEND_URL=https://backend2-0-lrcn.onrender.com
NEXT_PUBLIC_WS_URL=wss://backend2-0-lrcn.onrender.com
```

### Port Configuration
- Next.js will automatically bind to the PORT environment variable provided by Render
- No additional port configuration needed

## Expected Results After Redeployment
✅ WebSocket connection will work
✅ "CONNECTED" status instead of "DISCONNECTED"
✅ Real-time data from backend
✅ Environment variables available at runtime
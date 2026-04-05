# 🚀 Deploying to Render (Backend)

Follow these steps to deploy your backend PIN code service.

### 1. Create a Web Service
- Connect your GitHub repository.
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 2. Environment Variables
In the Render dashboard, go to the **Environment** tab and add:

| Key | Value | Note |
|-----|-------|------|
| `MONGO_URI` | `mongodb+srv://...` | Your Atlas string |
| `DB_NAME` | `Pincode` | Case-sensitive |
| `COLLECTION_NAME` | `Pincode` | Case-sensitive |
| `FRONTEND_URL` | `https://your-vercel-app.vercel.app` | **CRITICAL** for CORS |
| `NODE_ENV` | `production` | Suppresses stack traces |

---

# 🚀 Deploying to Vercel (Frontend)

Follow these steps to deploy your React frontend.

### 1. Project Configuration
- **Framework Preset**: `Vite`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 2. Environment Variables
In the Vercel dashboard, add the following variable:

| Key | Value | Note |
|-----|-------|------|
| `VITE_API_URL` | `https://your-render-api.onrender.com/api` | Your Render URL + `/api` |

---

### 🛡️ Security Hardening Applied
- **Helmet**: Secured with HTTP headers.
- **CORS**: Restricted to your `FRONTEND_URL`.
- **Error Handling**: Stack traces are hidden in production.
- **DNS Override**: Built-in Google DNS (8.8.8.8) fallback to prevent ISP blocks on MongoDB SRV records.

### 💡 Pro Tip
Render's **Free Tier** spins down after 15 minutes of inactivity. The first request after a break might take 30-60 seconds to load. For production-grade speed, consider the **Starter** tier.


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
| `FRONTEND_URL` | `https://your-vercel-app.vercel.app` | Your frontend URL |
| `NODE_ENV` | `production` | Enables performance optimizations |

---

### 💡 Pro Tip
Render's **Free Tier** spins down after 15 minutes of inactivity. The first request after a break might take 30-60 seconds to load. For production-grade speed, consider the **Starter** tier.

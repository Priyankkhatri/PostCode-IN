# 📮 PinIndia — Indian PIN Code Explorer

### 🔗 [Live Demo](https://post-code-in.vercel.app) | 📡 [API Status](https://postcode-in.onrender.com/api)

A high-performance, enterprise-grade full-stack application for exploring and analyzing India's comprehensive postal database. Built for speed, precision, and a premium user experience.

---

## 🌟 Key Features

- **⚡ Lightning Fast Search**: Full-text search across Office Names, Pincodes, and Taluks.
- **📊 Interactive Analytics**: Real-time distribution charts for states and delivery status using **Recharts**.
- **📥 CSV Export**: One-click absolute-path exports for filtered datasets.
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop with **Tailwind CSS**.
- **🔍 Advanced Filtering**: Deep-dive into data by State, District, and Taluk with dynamic dropdowns.
- **📦 Production-Ready**: Secured with **Helmet**, **CORS**, and advanced error handling.

---

## 🏗️ Technical Architecture

The project follows a decoupled **MERN** (MongoDB, Express, React, Node) architecture, optimized for scalability and performance.

### 💾 Backend (`/backend`)
- **Node.js & Express**: High-concurrency RESTful API.
- **MongoDB Atlas**: Cloud-native document storage for 150k+ records.
- **Mongoose**: Robust schema-based data modeling.
- **Environment Driven**: Fully configurable for local, staging, and production.

### 🎨 Frontend (`/frontend`)
- **React 18**: Modern UI with a focus on hooks and performance.
- **Vite**: Ultra-fast build engine for a seamless developer experience.
- **Framer Motion**: Smooth micro-interactions and transitions.
- **TanStack Query**: Efficient server-state management and caching.

---

## 🚀 Quick Setup

### 1. Backend Setup
```bash
cd backend
npm install
# Create a .env file with MONGO_URI and FRONTEND_URL
npm start
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Create a .env file with VITE_API_URL
npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/states` | List all unique states |
| `GET`  | `/api/pincodes` | Paginated search & filtering |
| `GET`  | `/api/stats` | Global count and distribution data |
| `GET`  | `/api/export` | Download filtered data as CSV |

---

## 🛡️ Security & Observability

- **CORS Protection**: Restricted to authorized production origins only.
- **Helmet**: Hardened HTTP headers for XSS and Clickjacking protection.
- **Production Logs**: Enhanced startup diagnostics for cloud-native observability.
- **Automatic Scalability**: Optimized for deployment on Render and Vercel.

---

## 🛠️ Tech Stack Credits

- **UI**: React, Tailwind CSS, Recharts, Lucide Icons, Framer Motion
- **API**: Express, Node.js, json2csv, Mongoose
- **DB**: MongoDB Atlas (Vector Search Ready)
- **Deployment**: Vercel (Frontend), Render (Backend)

---

- By **Priyank Khatri**

# 📮 PinIndia — Indian PIN Code Explorer

### 🔗 [Live Demo](https://post-code-in.vercel.app) | 📡 [API Status](https://postcode-in.onrender.com/api) | 📮 [Postman Docs](https://documenter.getpostman.com/view/50839274/2sBXqDri3M)

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=github)](#)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**PinIndia** is a high-performance, enterprise-grade full-stack application designed to explore, search, and analyze India's massive postal database (150k+ records). Built with a focus on speed, precision, and immersive data visualization.

---

## 🌟 Key Features

### ⚡ Lightning Fast Explorations
- **Universal Search**: Real-time full-text search across Office Names, Pincodes, Taluks, and Districts.
- **Deep Categorical Filters**: Drill down into data by State → District → Taluk with dynamic, hierarchical dropdowns.
- **Micro-Interactions**: Powered by **Framer Motion** for a premium, desktop-class experience.

### 📊 Advanced Data Analytics
- **Live Distribution Charts**: Interactive bar and pie charts visualizing state-wise office density and delivery versus non-delivery status.
- **Real-time Stats**: Instant insights into the total count of Pincodes, Districts, and Operational Taluks across the nation.

### 📥 One-Click Dataset Export
- **CSV Engine**: Export filtered datasets (up to 50,000 records) directly to your machine for offline analysis.

### 🛡️ Secure & Scalable Architecture
- **Hardened Security**: Protected with **Helmet.js**, strict **CORS** policies, and regex-safe query sanitization.
- **Optimized Performance**: In-memory caching for heavy analytics and paginated database queries for sub-second response times.

---

## 🏗️ Technical Architecture

The project utilizes a decoupled **MERN** architecture, ensuring the frontend and backend can scale independently.

### 💾 Backend (`/backend`)
- **Express & Node.js**: Modular controller-based architecture.
- **Mongoose**: Schema-driven data modeling for consistent data integrity.
- **Caching Layer**: Native JS memory caching for static dataset metadata (states, global stats).
- **Environment Management**: Dynamic CORS and Database configuration.

### 🎨 Frontend (`/frontend`)
- **React 18 & Vite**: Lightning-fast HMR and building.
- **TanStack Query**: Enterprise-grade server state synchronization and caching.
- **Tailwind CSS**: Utility-first styling for a sleek, responsive dark-mode UI.
- **Lucide Icons**: Clean, consistent iconography throughout the dashboard.

---

## 📡 API Endpoints
> [!TIP]
> **Complete API Documentation**: Access the full Postman collection and interactive documentation [here](https://documenter.getpostman.com/view/50839274/2sBXqDri3M).

### Core Data Lookup
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/states` | List all available states (cached) |
| `GET`  | `/api/states/:s/districts` | List districts within a specific state |
| `GET`  | `/api/states/:s/districts/:d/taluks` | List taluks within a district |

### Search & Detail
| Method | Endpoint | Params | Description |
|--------|----------|--------|-------------|
| `GET`  | `/api/search` | `q=query` | Quick universal search (returns top 20) |
| `GET`  | `/api/pincode/:id` | `:id` | Detailed office records + nearby pincodes |
| `GET`  | `/api/pincodes` | `state`, `q`, `page` | Advanced paginated filtering & sorting |

### Analytics & Tools
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/stats` | Global metrics and delivery vs non-delivery split |
| `GET`  | `/api/stats/state-distribution` | Top 15 states by office density |
| `GET`  | `/api/export` | Export filtered data to `.csv` download |

---

## 🚀 Deployment & Local Setup

### Installation
```bash
# Clone the repository
git clone https://github.com/Priyankkhatri/PostCode-IN.git

# Setup Backend
cd backend && npm install
# Add MONGO_URI and FRONTEND_URL to .env
npm start

# Setup Frontend
cd ../frontend && npm install
# Add VITE_API_URL to .env
npm run dev
```

### Production Stack
- **Dashboard**: Deployed on **Vercel** with automatic CI/CD.
- **Core API**: Hosted on **Render** (Node.js runtime).
- **Database**: **MongoDB Atlas** (Global Cluster).

---

- Developed with ❤️ by **Priyank Khatri**

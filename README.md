# 📮 PinIndia — Indian PIN Code Explorer

A full-stack application to explore India's complete postal PIN code database.

---

## 🗂 Project Structure

```
pincode-app/
├── backend/          # Node.js + Express REST API
└── frontend/         # React + Vite + Tailwind CSS
```

---

## ⚙️ Prerequisites

- Node.js v18+
- MongoDB Atlas (data already imported)

---

## 🚀 Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pincodesDB
```

> ⚠️ Replace `pincodesDB` with your actual DB name, and `pincodes` in `models/Pincode.js` with your actual collection name.

Start the server:
```bash
npm run dev     # development (nodemon)
npm start       # production
```

Server runs at: `http://localhost:5000`

---

## 🎨 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App runs at: `http://localhost:5173`

> The Vite dev server proxies `/api` calls to `http://localhost:5000` automatically.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/states` | All states |
| GET | `/api/states/:state/districts` | Districts by state |
| GET | `/api/states/:state/districts/:district/taluks` | Taluks by district |
| GET | `/api/pincodes?state=&district=&taluk=&page=1&limit=20` | Paginated filtered data |
| GET | `/api/search?q=` | Full-text search |
| GET | `/api/pincode/:pincode` | Detail by PIN code |
| GET | `/api/stats` | Dashboard stats |
| GET | `/api/stats/state-distribution` | Bar chart data |
| GET | `/api/stats/delivery-distribution` | Pie chart data |
| GET | `/api/export?state=&district=&taluk=` | Download CSV |

---

## 🔧 MongoDB Field Names

If your collection uses different field names, update `models/Pincode.js`.

Common variations to watch for:
- `stateName` vs `State` vs `state`
- `districtName` vs `District`
- `deliveryStatus` vs `Delivery`

Run this in MongoDB Compass shell to check:
```js
db.pincodes.findOne()
```

---

## 📦 Build for Production

```bash
# Frontend
cd frontend && npm run build
# Serve dist/ with nginx or any static host

# Backend
cd backend && npm start
```

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express, Mongoose, json2csv
- **Database**: MongoDB Atlas
- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, React Router v6, Axios

---

Built for **CodingGita × SU Semester 1** — Full Stack Project

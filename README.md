# 🌍 Earthquake Visualizer

**Earthquake Visualizer** is an interactive web application built with **React**, **Vite**, and **Tailwind CSS**.  
It displays **real-time global earthquake data** fetched from the **USGS Earthquake API**, allowing users to explore seismic activity through a **visually rich, responsive, and filterable** map interface.

---

## 🧭 Overview

This project was developed as part of a **UI Development Challenge** to showcase front-end engineering, geospatial visualization, and a clean user experience.  
The app focuses on **real-time data visualization**, **intuitive filters**, and **high-performance rendering**.

Users can:
- View earthquakes on an **interactive global map**
- Filter results by **magnitude**, **depth**, and **time range** (past hour, day, week, or month)
- Visualize patterns with **heatmaps** and **clustered markers**
- Explore **dynamic charts** using **Recharts**

---

## ⚙️ Tech Stack

| Category | Technologies |
|-----------|---------------|
| Front-End Framework | **React (Vite)** |
| Styling | **Tailwind CSS** |
| Maps & Visualization | **React Leaflet**, **Leaflet**, **React-Leaflet-Cluster**, **React-Leaflet-Heatmap-Layer-V3**, **Recharts**, **Framer Motion** |
| Icons | **Lucide React** |
| Data Source | **USGS Earthquake GeoJSON API** |

---

## 🌐 Data Source

The app fetches earthquake data dynamically from:  
https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_${timeRange}.geojson



Where `${timeRange}` can be:
- `hour` — Earthquakes in the past hour  
- `day` — Earthquakes in the past 24 hours  
- `week` — Earthquakes in the past 7 days  
- `month` — Earthquakes in the past 30 days  

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally:

```bash
# Clone the repository
git clone https://github.com/Nikhilsharma00101/Earthquake-visualizer.git

# Navigate to the project directory
cd earthquake-visualizer

# Install dependencies
npm install

# Start the development server
npm run dev


##🧩 Features

- Interactive Map View — Explore global earthquake activity
- Smart Filters — Filter by magnitude range, depth, and time range
- Heatmap Visualization — Understand intensity and density visually
- Data Charts — Visualize magnitude and depth distributions
- Real-Time Updates — Uses USGS live GeoJSON feeds
- Smooth Animations — Powered by Framer Motion
- Fully Responsive — Works across desktop, tablet, and mobile



##🧪 Scripts -

# Start development server
npm run dev
# Build for production
npm run build
# Preview production build
npm run preview
# Run lint checks
npm run lint


##🛠️ Project Structure -

earthquake-visualizer/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components (MapView, Filters, Charts)
│   ├── pages/             # Page-level components (Home, etc.)
│   ├── utils/             # Data fetching & helpers
│   ├── styles/            # Tailwind setup & global styles
│   └── main.tsx           # Entry point
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts

---

## 📝 Development Notes

### 🎯 Problem Understanding
Casey, a geography student, needs a simple way to **visualize global seismic activity** to study earthquake patterns.  
The solution had to be **real-time**, **visual**, and **interactive**, providing filters for time, magnitude, and depth.

### 🧠 Approach
- Used **React + Vite** for fast development and modular architecture.  
- Integrated **USGS GeoJSON API** for live data without authentication.  
- Implemented **React-Leaflet** for the map layer and **Recharts** for data insights.  
- Managed state using React Hooks for simplicity.  
- Designed a clean, minimal UI with **Tailwind CSS**, ensuring full responsiveness.  
- Added **Framer Motion** for smooth animations and transitions.


### 🧪 Testing & Validation
- Verified API fetch works for all ranges (hour, day, week, month).  
- Tested filters and chart updates dynamically.  
- Checked responsiveness across desktop and mobile.  
- Handled API/network failures gracefully with fallback messages.

### 🚀 Deployment
- **Platform:** Vercel  
- **Branch:** main (production)  
- **Build Command:** `npm run build`  
- **Live URL:** https://earthquake-visualizer-70rho307r.vercel.app

### 💡 Learnings & Next Steps
- Learned GeoJSON parsing and map visualization with Leaflet.  
- Next steps: add clustering refinements, 3D globe mode, and WebSocket-based alerts.

---

## 💬 ChatGPT Work Reference (Level 1 Requirement)

This project was developed with planning, debugging, and optimization guidance through ChatGPT sessions.  
You can view the full conversation logs here:  
👉 [ChatGPT Work Log](https://chatgpt.com/g/g-p-68ff85f197bc819191bb38e8d9d591f3-aganitha-project/project)

---


##💡 Future Improvements - 

- Add 3D globe visualization
- Real-time earthquake alerts via WebSocket
- Earthquake detail popups with location metadata
- Historical trend comparison charts



## 🧑‍💻 Author
**Nikhil Sharma**  
Full Stack Developer  
🖥️ React • Node.js • MongoDB • TypeScript

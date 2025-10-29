# 🌍 Earthquake Visualizer

**Earthquake Visualizer** is an interactive web application built with **React**, **Vite**, and **Tailwind CSS**.  
It displays **real-time global earthquake data** fetched from the **USGS Earthquake API**, allowing users to explore seismic activity through a **visually rich, responsive, and filterable** map interface.

---

## 🧭 Overview

This project was developed as part of a **UI Development Challenge** to showcase front-end engineering, geospatial visualization, and clean user experience.  
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


🧩 Features

- Interactive Map View — Explore global earthquake activity
- Smart Filters — Filter by magnitude range, depth, and time range
- Heatmap Visualization — Understand intensity and density visually
- Data Charts — Visualize magnitude and depth distributions
- Real-Time Updates — Uses USGS live GeoJSON feeds
- Smooth Animations — Powered by Framer Motion
- Fully Responsive — Works across desktop, tablet, and mobile



🧪 Scripts -

# Start development server
npm run dev
# Build for production
npm run build
# Preview production build
npm run preview
# Run lint checks
npm run lint


🛠️ Project Structure -

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



💡 Future Improvements - 

- Add 3D globe visualization
- Real-time earthquake alerts via WebSocket
- Earthquake detail popups with location metadata
- Historical trend comparison charts




🧑‍💻 Author

Nikhil Sharma
Full Stack Developer | React • Node.js • MongoDB • TypeScript
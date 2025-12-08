# Map App 🗺️

An open-source alternative to Google Maps API built with modern web technologies and free mapping services.

## Overview

This application provides a complete mapping solution using entirely open-source and free services, eliminating the need for costly Google Maps API subscriptions. Perfect for developers looking for a cost-effective mapping solution with full control over their implementation.

## Features

- **Interactive Maps** - Powered by OpenStreetMap (OSM) and Leaflet.js
- **Routing & Navigation** - Turn-by-turn directions using OSRM (Open Source Routing Machine)
- **Geocoding & Search** - Location search and reverse geocoding via Nominatim API
- **Real-time Updates** - WebSocket support for live location tracking and updates
- **Zero API Costs** - Completely free and open-source infrastructure

## Tech Stack

### Frontend
- **Leaflet.js** - Interactive map rendering and manipulation
- **JavaScript** (98.4%)
- **HTML** (1.5%)
- **CSS** (0.1%)

### Backend
- **Node.js/Express** - Server-side logic and API handling
- **WebSocket** - Real-time bidirectional communication

### APIs & Services
- **OpenStreetMap (OSM)** - Map tiles and geographic data
- **OSRM** - Routing engine for navigation
- **Nominatim** - Geocoding and address lookup

## Project Structure

```
map-app/
├── backend/           # Server-side application
│   ├── routes/       # API endpoints
│   ├── controllers/  # Business logic
│   └── websocket/    # WebSocket handlers
├── frontend/         # Client-side application
│   ├── js/          # JavaScript modules
│   ├── css/         # Stylesheets
│   └── index.html   # Main HTML file
├── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository
```bash
git clone https://github.com/Prateet-Github/map-app.git
cd map-app
```

2. Install dependencies
```bash
npm install
```

3. Start the backend server
```bash
cd backend
npm start
```

4. Start the frontend development server
```bash
cd frontend
npm start
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

### Basic Map Display
```javascript
// Initialize map
const map = L.map('map').setView([latitude, longitude], zoomLevel);

// Add OSM tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
```

### Geocoding with Nominatim
```javascript
// Search for a location
fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json`)
    .then(response => response.json())
    .then(data => {
        // Handle location results
    });
```

### Routing with OSRM
```javascript
// Get route between two points
fetch(`https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`)
    .then(response => response.json())
    .then(data => {
        // Display route on map
    });
```

### Real-time Updates with WebSocket
```javascript
// Connect to WebSocket server
const socket = new WebSocket('ws://localhost:5001');

socket.onmessage = (event) => {
    // Handle real-time location updates
};
```

## API Endpoints

### Backend Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/geocode` | Search for locations |
| GET | `/api/reverse` | Reverse geocoding |
| POST | `/api/route` | Calculate route between points |
| GET | `/api/places` | Find nearby places |

## Features in Detail

### 1. Interactive Mapping
- Pan and zoom controls
- Custom markers and popups
- Layer management
- Geolocation support

### 2. Search & Geocoding
- Address search
- Reverse geocoding
- Autocomplete suggestions
- Place details

### 3. Routing & Navigation
- Multi-point routing
- Alternative routes
- Distance and duration calculation
- Turn-by-turn directions

### 4. Real-time Features
- Live location tracking
- Real-time marker updates
- Multi-user collaboration
- Event broadcasting

## Advantages Over Google Maps API

| Feature | This App | Google Maps API |
|---------|----------|-----------------|
| Cost | Free | Paid (after quota) |
| Rate Limits | Generous | Restrictive |
| Data Access | Full control | Limited |
| Customization | Complete | Limited |
| Privacy | Self-hosted | Google servers |
| Open Source | Yes | No |

## Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5001
FRONTEND_URL=http://localhost:5173
WEBSOCKET_PORT=5001
```

### Map Configuration

Customize map settings in `frontend/js/config.js`:

```javascript
const MAP_CONFIG = {
    defaultCenter: [51.505, -0.09],
    defaultZoom: 13,
    maxZoom: 19,
    minZoom: 3
};
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- **OpenStreetMap** - Map data and tiles
- **OSRM Project** - Routing engine
- **Nominatim** - Geocoding service
- **Leaflet.js** - Mapping library

## Resources

- [OpenStreetMap](https://www.openstreetmap.org/)
- [OSRM Documentation](http://project-osrm.org/)
- [Nominatim API Docs](https://nominatim.org/release-docs/latest/api/Overview/)
- [Leaflet.js Docs](https://leafletjs.com/)

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Built with ❤️ using open-source technologies**
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { LocationSearch } from "./LocationSearch";

// 🔹 Map marker handling
function LocationMarkers({ pickup, setPickup, drop, setDrop }) {
  useMapEvents({
    click(e) {
      if (!pickup) {
        setPickup(e.latlng);
      } else if (!drop) {
        setDrop(e.latlng);
      } else {
        setPickup(e.latlng);
        setDrop(null);
      }
    },
  });

  return (
    <>
      {pickup && (
        <Marker position={pickup}>
          <Popup>Pickup Location</Popup>
        </Marker>
      )}
      {drop && (
        <Marker position={drop}>
          <Popup>Destination</Popup>
        </Marker>
      )}
    </>
  );
}

// 🔹 Auto-fit to route bounds
function FitBoundsHandler({ route }) {
  const map = useMap();
  useEffect(() => {
    if (route && route.length > 0) {
      map.fitBounds(route, { padding: [50, 50] });
    }
  }, [route, map]);
  return null;
}

function App() {
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [route, setRoute] = useState([]);
  const [info, setInfo] = useState(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  useEffect(() => {
    if (pickup && drop) {
      const fetchRoute = async () => {
        setIsLoadingRoute(true);
        try {
          const url = `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${drop.lng},${drop.lat}?geometries=geojson&overview=full`;
          const response = await fetch(url);
          const data = await response.json();

          if (data.routes && data.routes.length > 0) {
            const routeData = data.routes[0];
            const coords = routeData.geometry.coordinates.map((coord) => [
              coord[1],
              coord[0],
            ]);
            setRoute(coords);

            setInfo({
              distance: (routeData.distance / 1000).toFixed(1),
              duration: Math.round(routeData.duration / 60),
            });
          }
        } catch (err) {
          console.error("Error fetching route:", err);
        } finally {
          setIsLoadingRoute(false);
        }
      };
      fetchRoute();
    } else {
      setRoute([]);
      setInfo(null);
    }
  }, [pickup, drop]);

  const clearAll = () => {
    setPickup(null);
    setDrop(null);
    setRoute([]);
    setInfo(null);
  };

  return (
    <div className="h-screen w-full bg-white">
      {/* Mobile Layout */}
      <div className="lg:hidden h-full flex flex-col">
        {/* Mobile Header with Search */}
        <div className="bg-white shadow-sm z-[1000] relative">
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900">
                Plan your trip
              </h1>
              {(pickup || drop) && (
                <button
                  onClick={clearAll}
                  className="text-sm font-medium text-gray-600"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-3">
              <LocationSearch
                label="Pickup"
                placeholder="Enter pickup location"
                onSelect={setPickup}
                allowCurrentLocation={true}
                icon="🟢"
                value={pickup?.display || ""}
              />

              <LocationSearch
                label="Destination"
                placeholder="Where to?"
                onSelect={setDrop}
                icon="🔴"
                value={drop?.display || ""}
              />
            </div>
          </div>
        </div>

        {/* Mobile Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={[28.6139, 77.209]}
            zoom={13}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <LocationMarkers
              pickup={pickup}
              setPickup={setPickup}
              drop={drop}
              setDrop={setDrop}
            />
            {route.length > 0 && (
              <>
                <Polyline
                  positions={route}
                  color="#000000"
                  weight={6}
                  opacity={0.8}
                />
                <FitBoundsHandler route={route} />
              </>
            )}
          </MapContainer>

          {/* Mobile Instructions Overlay */}
          {!pickup && !drop && (
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-95 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-center max-w-sm mx-4">
              <div className="text-3xl mb-3">🗺️</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">
                Set your locations
              </h3>
              <p className="text-gray-600 text-sm">
                Use the search above or tap on the map to set your pickup and
                destination.
              </p>
            </div>
          )}
        </div>

        {/* Mobile Bottom Route Info */}
        {(info || isLoadingRoute) && (
          <div className="bg-white border-t border-gray-200 p-4 shadow-2xl">
            {isLoadingRoute ? (
              <div className="flex items-center justify-center py-4 text-gray-500">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-3"></div>
                <span className="font-medium">Finding route...</span>
              </div>
            ) : (
              info && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-lg font-bold text-black">
                        {info.duration} min • {info.distance} km
                      </div>
                      <div className="text-sm text-gray-600">
                        Fastest route • Light traffic
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600">
                        $12
                      </div>
                      <div className="text-xs text-gray-500">estimate</div>
                    </div>
                  </div>
                  <button className="w-full bg-black text-white py-4 px-6 rounded-xl font-semibold text-lg">
                    Request Ride
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full">
        {/* Desktop Sidebar */}
        <div className="w-96 xl:w-[400px] bg-white flex-shrink-0 flex flex-col border-r border-gray-200">
          {/* Desktop Header */}
          <div className="px-6 py-5 border-b border-gray-100 bg-white">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Plan your trip
              </h1>
              {(pickup || drop) && (
                <button
                  onClick={clearAll}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Desktop Search Section */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-4">
              <LocationSearch
                label="Pickup"
                placeholder="Enter pickup location"
                onSelect={setPickup}
                allowCurrentLocation={true}
                icon="🟢"
                value={pickup?.display || ""}
              />

              <LocationSearch
                label="Destination"
                placeholder="Where to?"
                onSelect={setDrop}
                icon="🔴"
                value={drop?.display || ""}
              />

              {/* Desktop Suggestions */}
              {!pickup && !drop && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Suggestions
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        🏠
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Home</div>
                        <div className="text-sm text-gray-500">
                          Set your home address
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        💼
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Work</div>
                        <div className="text-sm text-gray-500">
                          Set your work address
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Route Information */}
            {(info || isLoadingRoute) && (
              <div className="border-t border-gray-100 p-6">
                {isLoadingRoute ? (
                  <div className="flex items-center justify-center py-8 text-gray-500">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black mr-3"></div>
                    <span className="font-medium">Finding best route...</span>
                  </div>
                ) : (
                  info && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Route Overview
                      </h3>

                      <div className="bg-gray-50 rounded-2xl p-6 mb-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-black">
                              {info.duration}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                              minutes
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="text-3xl font-bold text-black">
                              {info.distance}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                              kilometers
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              $12
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                              estimated
                            </div>
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-sm text-gray-600 mb-4">
                            Fastest route • Light traffic
                          </div>
                          <button className="w-full bg-black text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors">
                            Request Ride
                          </button>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        * Prices and times are estimates and may vary based on
                        traffic and demand
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Map Container */}
        <div className="flex-1 relative">
          <MapContainer
            center={[28.6139, 77.209]}
            zoom={13}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <LocationMarkers
              pickup={pickup}
              setPickup={setPickup}
              drop={drop}
              setDrop={setDrop}
            />
            {route.length > 0 && (
              <>
                <Polyline
                  positions={route}
                  color="#000000"
                  weight={6}
                  opacity={0.8}
                />
                <FitBoundsHandler route={route} />
              </>
            )}
          </MapContainer>

          {/* Desktop Map Instructions */}
          {!pickup && !drop && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-95 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-center max-w-sm mx-4">
              <div className="text-3xl mb-3">🗺️</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">
                Set your locations
              </h3>
              <p className="text-gray-600 text-sm">
                Use the search panel or tap on the map to set your pickup and
                destination points.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

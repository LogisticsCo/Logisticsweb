import { useEffect, useRef } from "react";
import { FaPhone, FaComment } from "react-icons/fa";
import mapboxgl from "mapbox-gl"; // Import Mapbox GL JS

// Set the Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapSection = () => {
  // Initialize map reference
  const mapContainer = useRef(null); // Reference for the map container

  useEffect(() => {
    // Mock route data
    const mockRoute = {
      origin: { lng: -74.006, lat: 40.7128, name: "New York City" },
      destination: { lng: -73.935242, lat: 40.73061, name: "Brooklyn" },
      checkpoints: [
        { lng: -74.002, lat: 40.719, name: "Checkpoint 1" },
        { lng: -73.990, lat: 40.721, name: "Checkpoint 2" },
      ],
    };

    // Mapbox map initialization
    const { origin, destination, checkpoints } = mockRoute;

    const map = new mapboxgl.Map({
      container: mapContainer.current, // Map container reference
      style: "mapbox://styles/mapbox/streets-v11", // Map style
      center: [origin.lng, origin.lat], // Start center based on the origin
      zoom: 12, // Adjust zoom level
    });

    // Add a marker for the origin
    new mapboxgl.Marker({ color: "green" })
      .setLngLat([origin.lng, origin.lat])
      .setPopup(new mapboxgl.Popup().setHTML(`<h3>Origin</h3><p>${origin.name}</p>`))
      .addTo(map);

    // Add markers for checkpoints
    checkpoints.forEach((checkpoint) => {
      new mapboxgl.Marker({ color: "orange" })
        .setLngLat([checkpoint.lng, checkpoint.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>Checkpoint</h3><p>${checkpoint.name}</p>`))
        .addTo(map);
    });

    // Add a marker for the destination
    new mapboxgl.Marker({ color: "red" })
      .setLngLat([destination.lng, destination.lat])
      .setPopup(new mapboxgl.Popup().setHTML(`<h3>Destination</h3><p>${destination.name}</p>`))
      .addTo(map);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-gray-900 rounded-3xl overflow-hidden border border-gray-400/50">
      {/* Map Section (Mapbox integration) */}
      <div className="absolute inset-0">
        <div
          className="h-full w-full"
          ref={mapContainer} // Attach the map to the container
          style={{ height: "100%" }}
        ></div>
      </div>

      {/* Example Buttons */}
      <div
        style={{
          background:
            "linear-gradient(to bottom, rgba(31, 41, 55, 1), rgba(55, 65, 81, 0.9))",
        }}
        className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-30"
      >
        <button className="bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-2 flex items-center text-white">
          <FaPhone className="mr-2" /> Call Driver
        </button>
        <button className="bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-2 flex items-center text-white">
          <FaComment className="mr-2" /> Chat with Driver
        </button>
      </div>
    </div>
  );
};

export default MapSection;

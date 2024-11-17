import { useState, useEffect, useRef } from "react";
import { FaPhone, FaComment } from "react-icons/fa";
import axios from "axios"; // For API requests
import mapboxgl from "mapbox-gl"; // Import Mapbox GL JS

// Set the Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapSection = ({ orderId }) => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize map reference
  const mapContainer = useRef(null); // Reference for the map container

  useEffect(() => {
    // Function to fetch order data
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}/`);  // Update with your API endpoint
        setOrderData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch order data.");
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]); // Re-fetch data if orderId changes

  useEffect(() => {
    if (orderData && orderData.route) {
      // Mapbox map initialization when order data is available
      const { route } = orderData;
      const { origin, destination, checkpoints } = route;

      const map = new mapboxgl.Map({
        container: mapContainer.current, // Map container reference
        style: "mapbox://styles/mapbox/streets-v11", // Map style
        center: [origin.lng, origin.lat], // Start center based on the origin
        zoom: 10, // Adjust zoom level
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
    }
  }, [orderData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Destructure order data
  const { status, driver, image, route } = orderData;

  return (
    <div className="relative w-full min-h-screen md:h-full bg-gray-900 md:rounded-3xl overflow-hidden md:border border-gray-400/50">
      {/* Map Section (Mapbox integration) */}
      <div className="absolute inset-0">
        <div
          className="h-full w-full"
          ref={mapContainer} // Attach the map to the container
          style={{ height: "100%" }}
        ></div>
      </div>

      {/* Order Details Section */}
      <div
        style={{
          background:
            "linear-gradient(to bottom, rgba(31, 41, 55, 1), rgba(55, 65, 81, 0.9))",
        }}
        className="absolute top-0 left-0 right-0 p-4 md:p-6 flex flex-col justify-between items-center z-30"
      >
        <div className="flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center w-full">
          <div className="md:text-xs 2xl:text-sm font-semibold text-white">
            Order ID {orderId}
            <span className="text-green-400">({status})</span>
          </div>
          <div className="flex space-x-2">
            <button className="bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-2 flex items-center text-xs 2xl:text-sm text-white">
              <FaPhone className="mr-2" /> Call Driver
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-2 flex items-center text-xs 2xl:text-sm text-white">
              <FaComment className="mr-2" /> Chat with Driver
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Truck Capacity and Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-30">
        <div className="mb-6 bg-gray-800 p-4 rounded-lg flex items-center">
          <img
            src={image || "https://via.placeholder.com/100"} // Use order's image
            alt="Truck"
            className="w-fit h-16 mr-4"
          />
          <div className="w-full">
            <div className="flex bg-gray-300 rounded-full h-4">
              <div
                className="bg-blue-500 rounded-full"
                style={{ width: "60%" }} // Adjust this dynamically based on real data
              ></div>
            </div>

            <div className="text-sm mt-2 text-gray-300">60% Full</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSection;

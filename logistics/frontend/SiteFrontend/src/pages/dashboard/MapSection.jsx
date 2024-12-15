import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapSection = ({ order, statuss }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [markers, setMarkers] = useState([]);
  const [status, setStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("+1234567890");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [37.012128, -1.100903],
        zoom: 10,
      });
    }
  }, []);

  useEffect(() => {
    if (!order) return;

    const fetchData = async () => {
      try {
        markers.forEach((marker) => marker.remove());
        setMarkers([]);

        if (map.current.getLayer("route")) {
          map.current.removeLayer("route");
          map.current.removeSource("route");
        }

        if (map.current.getLayer("greenRoute")) {
          map.current.removeLayer("greenRoute");
          map.current.removeSource("greenRouteSource");
        }

        const { data } = await axios.get(
          `https://cklogisticsback.onrender.com/backend/order/${order}/coordinates/`
        );
        const { origin, destination, checkpoints } = data;
        const locations = [origin, ...checkpoints, destination];
        const newMarkers = [];

        locations.forEach((location) => {
          const markerColor =
            location === origin
              ? "green"
              : location === destination
              ? "red"
              : "blue";

          const marker = new mapboxgl.Marker({ color: markerColor })
            .setLngLat([location.longitude, location.latitude])
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(location.name))
            .addTo(map.current);

          newMarkers.push(marker);
        });

        setMarkers(newMarkers);

        const bounds = new mapboxgl.LngLatBounds();
        locations.forEach((location) =>
          bounds.extend([location.longitude, location.latitude])
        );
        map.current.fitBounds(bounds, { padding: 50 });

        const waypoints = locations.map((location) => [
          location.longitude,
          location.latitude,
        ]);
        const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints
          .map((point) => point.join(","))
          .join(";")}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

        const routeResponse = await axios.get(routeUrl);
        const routeData = routeResponse.data.routes[0].geometry;

        if (routeData) {
          map.current.addLayer({
            id: "route",
            type: "line",
            source: {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: routeData,
              },
            },
            paint: {
              "line-color": "#ff0000",
              "line-width": 5,
            },
          });
        }

        const liveResponse = await axios.get(
          `https://cklogisticsback.onrender.com/backend/coordinates/?order_id=${order}`
        );
        const liveCoordinates = liveResponse.data.coordinates.map((coord) => [
          coord.longitude,
          coord.latitude,
        ]);

        const latestCoordinates =
          liveResponse.data.coordinates[
            liveResponse.data.coordinates.length - 1
          ];
        const { longitude, latitude } = latestCoordinates;

        const latestMarker = new mapboxgl.Marker({ color: "green" })
          .setLngLat([longitude, latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setText("Latest Data Point")
          )
          .addTo(map.current);
        newMarkers.push(latestMarker);

        const greenPathData = {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              [origin.longitude, origin.latitude],
              ...liveCoordinates,
              [longitude, latitude],
            ],
          },
        };

        if (map.current.getSource("greenRouteSource")) {
          map.current.getSource("greenRouteSource").setData(greenPathData);
        } else {
          map.current.addSource("greenRouteSource", {
            type: "geojson",
            data: greenPathData,
          });

          map.current.addLayer({
            id: "greenRoute",
            type: "line",
            source: "greenRouteSource",
            paint: {
              "line-color": "#00ff00",
              "line-width": 5,
            },
          });
        }

        const finalBounds = new mapboxgl.LngLatBounds();
        locations.forEach((location) =>
          finalBounds.extend([location.longitude, location.latitude])
        );
        finalBounds.extend([longitude, latitude]);
        map.current.fitBounds(finalBounds, { padding: 50 });

        if (
          latitude === destination.latitude &&
          longitude === destination.longitude
        ) {
          setStatus("completed");
          await axios.post(
            `https://cklogisticsback.onrender.com/backend/order/${order}/status/`,
            { status: "Completed" }
          );
        } else {
          setStatus("active");
          await axios.post(
            `https://cklogisticsback.onrender.com/backend/order/${order}/status/`,
            { status: "Active" }
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [order]);

  const handleChatWithDriver = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSendMessage = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
    closeModal();
  };

  return (
    <div className="bg-gray-700/50 md:rounded-3xl w-full h-full mx-auto border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white border-b border-gray-700">
        <div>
          <span className="text-lg font-bold">Order ID: {order}</span>
          {status && (
            <span
              className={`ml-2 text-sm ${
                status === "completed" ? "text-green-500" : "text-yellow-500"
              }`}
            >
              ({status})
            </span>
          )}
        </div>
        <div className="flex gap-4">
          
          <button
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded"
            onClick={handleChatWithDriver}
          >
            Chat with Driver
          </button>
        </div>
      </div>
     
      
      {/* Map */}
      <div ref={mapContainer} style={{ width: "100%", height: "500px" }} />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Chat with Driver</h2>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                onClick={handleSendMessage}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapSection;

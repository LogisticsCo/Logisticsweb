import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapSection = ({ order, statuss }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [markers, setMarkers] = useState([]); // Keep track of markers
  const [status, setStatus] = useState(""); // Order status (checking by default)

  // Initialize the map only once
  useEffect(() => {
    if (!map.current && mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [37.012128, -1.100903], // Default center (Juja, Kenya)
        zoom: 10,
      });
    }
  }, []);

  // Handle orderId change
  useEffect(() => {
    if (!order) return; // Early return if no orderId

    const fetchData = async () => {
      try {
        // Clear previous markers
        markers.forEach((marker) => marker.remove());
        setMarkers([]);

        // Remove previous route layer if it exists
        if (map.current.getLayer("route")) {
          map.current.removeLayer("route");
          map.current.removeSource("route");
        }

        // Remove previous green path layer if it exists
        if (map.current.getLayer("greenRoute")) {
          map.current.removeLayer("greenRoute");
          map.current.removeSource("greenRouteSource");
        }

        // Fetch order data
        const { data } = await axios.get(
          `https://cklogistics-h9bxfpgsaqf3duab.canadacentral-01.azurewebsites.net/backend/order/${order}/coordinates/`
        );
        const { origin, destination, checkpoints } = data;

        // Add new markers for origin, checkpoints, and destination
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

        // Adjust map bounds to fit all markers
        const bounds = new mapboxgl.LngLatBounds();
        locations.forEach((location) =>
          bounds.extend([location.longitude, location.latitude])
        );
        map.current.fitBounds(bounds, { padding: 50 });

        // Fetch route data from Mapbox Directions API
        const waypoints = locations.map((location) => [
          location.longitude,
          location.latitude,
        ]);
        const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints
          .map((point) => point.join(","))
          .join(";")}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

        const routeResponse = await axios.get(routeUrl);
        const routeData = routeResponse.data.routes[0].geometry;

        // Add the route layer if data exists
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

        // Fetch live coordinates
        const liveResponse = await axios.get(
          `https://cklogistics-h9bxfpgsaqf3duab.canadacentral-01.azurewebsites.net/backend/coordinates/?order_id=${order}`
        );
        const liveCoordinates = liveResponse.data.coordinates.map((coord) => [
          coord.longitude,
          coord.latitude,
        ]);

        console.log("Extracted Coordinates:", liveCoordinates);

        // Latest coordinate
        const latestCoordinates =
          liveResponse.data.coordinates[
            liveResponse.data.coordinates.length - 1
          ];
        const { longitude, latitude } = latestCoordinates;

        // Add latest marker
        const latestMarker = new mapboxgl.Marker({ color: "green" })
          .setLngLat([longitude, latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setText("Latest Data Point")
          )
          .addTo(map.current);
        newMarkers.push(latestMarker);

        // Update green path
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
              "line-color": "#00ff00", // Green color
              "line-width": 5,
            },
          });
        }

        // Adjust map bounds for the latest point
        const finalBounds = new mapboxgl.LngLatBounds();
        locations.forEach((location) =>
          finalBounds.extend([location.longitude, location.latitude])
        );
        finalBounds.extend([longitude, latitude]);
        map.current.fitBounds(finalBounds, { padding: 50 });

        // Update status
        if (
          latitude === destination.latitude &&
          longitude === destination.longitude
        ) {
          setStatus("completed");
          await axios.post(
            `https://cklogistics-h9bxfpgsaqf3duab.canadacentral-01.azurewebsites.net/backend/order/${order}/status/`,
            { status: "Completed" }
          );
        } else {
          setStatus("active");
          await axios.post(
            `https://cklogistics-h9bxfpgsaqf3duab.canadacentral-01.azurewebsites.net/backend/order/${order}/status/`,
            { status: "Active" }
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [order]);

  return (
    <div className="bg-gray-700/50 md:rounded-3xl w-full h-full mx-auto border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white border-b border-gray-700">
        <div>
          <span className="text-lg font-bold">Order ID: {order}</span>
          {statuss && (
            <span
              className={`ml-2 text-sm ${
                statuss === "In Transit" ? "text-green-500" : "text-yellow-500"
              }`}
            >
              ({statuss})
            </span>
          )}
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
            Call Driver
          </button>
          <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded">
            Chat with Driver
          </button>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex justify-around bg-gray-800 text-gray-400 py-2 border-b border-gray-700">
        {["Shipping Info", "Vehicle Info", "Documents", "Company", "Bill"].map(
          (tab) => (
            <button key={tab} className="hover:text-white">
              {tab}
            </button>
          )
        )}
      </div>
      <div ref={mapContainer} style={{ width: "100%", height: "500px" }} />
    </div>
  );
};

export default MapSection;

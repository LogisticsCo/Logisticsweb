import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapSection = ({ orderId }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [markers, setMarkers] = useState([]); // Keep track of markers

  useEffect(() => {
    // Initialize the map only once when the component mounts
    if (!map.current && mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [37.012128, -1.100903], // Default center (Juja, Kenya)
        zoom: 10,
      });
    }
  }, []);

  useEffect(() => {
    if (orderId) {
      axios
        .get(`https://cklogisticsco.onrender.com/backend/order/${orderId}/coordinates/`)
        .then((response) => {
          const { origin, destination, checkpoints } = response.data;

          // Remove previous markers
          markers.forEach((marker) => marker.remove()); // Remove old markers
          setMarkers([]); // Clear the markers state

          // Remove previous route layer if any
          const layers = map.current.getStyle().layers;
          layers.forEach((layer) => {
            if (layer.id === "route") {
              map.current.removeLayer("route");
              map.current.removeSource("route");
            }
          });

          const newMarkers = [];
          const locations = [origin, ...checkpoints, destination];

          // Add markers for origin, checkpoints, and destination
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

          setMarkers(newMarkers); // Update state with new markers

          // Adjust map bounds to fit all markers
          const bounds = new mapboxgl.LngLatBounds();
          locations.forEach((location) =>
            bounds.extend([location.longitude, location.latitude])
          );
          map.current.fitBounds(bounds, { padding: 50 });

          // Request route from the Directions API
          const waypoints = locations.map(
            (location) => [location.longitude, location.latitude]
          );

          const routeUrl =
            checkpoints.length > 0
              ? `https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints
                  .map((point) => point.join(","))
                  .join(";")}?geometries=geojson&access_token=${mapboxgl.accessToken}`
              : `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

          axios
            .get(routeUrl)
            .then((routeResponse) => {
              const routeData = routeResponse.data.routes[0].geometry;

              // Add the route as a line on the map
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
            })
            .catch((error) => console.error("Error fetching route:", error));

          // Fetch another marker and draw a green line from the origin to this marker
          axios
            .get("https://cklogisticsco.onrender.com/backend/coordinates/")
            .then((anotherMarkerResponse) => {
              const { longitude, latitude } = anotherMarkerResponse.data;

              // Create the new marker (green)
              const anotherMarker = new mapboxgl.Marker({ color: "green" })
                .setLngLat([longitude, latitude])
                .setPopup(new mapboxgl.Popup({ offset: 25 }).setText("Another Marker"))
                .addTo(map.current);

              newMarkers.push(anotherMarker); // Add this new marker

              // Draw a green line from the origin to the new marker
              const lineData = {
                type: "Feature",
                geometry: {
                  type: "LineString",
                  coordinates: [
                    [origin.longitude, origin.latitude],
                    [longitude, latitude],
                  ],
                },
                properties: {},
              };

              map.current.addLayer({
                id: "greenRoute",
                type: "line",
                source: {
                  type: "geojson",
                  data: lineData,
                },
                paint: {
                  "line-color": "#00ff00", // Green color for the line
                  "line-width": 5,
                },
              });

              // Adjust map bounds to fit all markers, including the new marker
              const bounds = new mapboxgl.LngLatBounds();
              locations.forEach((location) => bounds.extend([location.longitude, location.latitude]));
              bounds.extend([longitude, latitude]); // Include the new marker's coordinates
              map.current.fitBounds(bounds, { padding: 50 });
            })
            .catch((error) =>
              console.error("Error fetching another marker coordinates:", error)
            );
        })
        .catch((error) => console.error("Failed to fetch order data:", error));
    }
  }, [orderId]); // Only fetch data when `orderId` changes

  return <div ref={mapContainer} style={{ width: "100%", height: "500px" }} />;
};

export default MapSection;

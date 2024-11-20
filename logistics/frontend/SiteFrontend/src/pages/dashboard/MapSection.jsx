import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapSection = ({ orderId }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [markers, setMarkers] = useState([]); // Keep track of markers
  const [greenPathLayerId, setGreenPathLayerId] = useState(null); // Track green path layer ID

  // Initialize map only once
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
    if (!orderId) return; // Early return if no orderId

    const fetchData = async () => {
      try {
        // Clear previous markers and layers
        markers.forEach((marker) => marker.remove());
        setMarkers([]);

        // Remove previous route layer
        const layers = map.current.getStyle().layers;
        layers.forEach((layer) => {
          if (layer.id === "route") {
            map.current.removeLayer("route");
            map.current.removeSource("route");
          }
        });

        // Remove previous green path layer if it exists
        if (greenPathLayerId) {
          map.current.removeLayer(greenPathLayerId);
          map.current.removeSource(greenPathLayerId);
          setGreenPathLayerId(null); // Clear the previous layer ID
        }

        // Fetch order data
        const { data } = await axios.get(
          `https://cklogisticsco.onrender.com/backend/order/${orderId}/coordinates/`
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

        setMarkers(newMarkers); // Update markers state

        // Adjust map bounds to fit all markers
        const bounds = new mapboxgl.LngLatBounds();
        locations.forEach((location) =>
          bounds.extend([location.longitude, location.latitude])
        );
        map.current.fitBounds(bounds, { padding: 50 });

        // Fetch route data from Mapbox Directions API
        const waypoints = locations.map(
          (location) => [location.longitude, location.latitude]
        );
        const routeUrl =
          checkpoints.length > 0
            ? `https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints
                .map((point) => point.join(","))
                .join(";")}?geometries=geojson&access_token=${mapboxgl.accessToken}`
            : `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

        const routeResponse = await axios.get(routeUrl);
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

        // Fetch another marker and draw green path
        const anotherMarkerResponse = await axios.get(
          "https://cklogisticsco.onrender.com/backend/coordinates/"
        );
        const { longitude, latitude } = anotherMarkerResponse.data;

        // Create the new marker (green)
        const anotherMarker = new mapboxgl.Marker({ color: "green" })
          .setLngLat([longitude, latitude])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setText("Another Marker"))
          .addTo(map.current);

        newMarkers.push(anotherMarker); // Add new marker

        // Draw green path from origin to new marker
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

        const newGreenPathLayerId = "greenRoute-" + Date.now(); // Unique layer ID
        map.current.addLayer({
          id: newGreenPathLayerId,
          type: "line",
          source: {
            type: "geojson",
            data: lineData,
          },
          paint: {
            "line-color": "#00ff00", // Green color
            "line-width": 5,
          },
        });

        setGreenPathLayerId(newGreenPathLayerId); // Set new green path layer ID

        // Adjust map bounds to fit all markers including new one
        const finalBounds = new mapboxgl.LngLatBounds();
        locations.forEach((location) =>
          finalBounds.extend([location.longitude, location.latitude])
        );
        finalBounds.extend([longitude, latitude]); // Include the new marker
        map.current.fitBounds(finalBounds, { padding: 50 });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [orderId]); 

  return <div ref={mapContainer} style={{ width: "100%", height: "500px" }} />;
};

export default MapSection;

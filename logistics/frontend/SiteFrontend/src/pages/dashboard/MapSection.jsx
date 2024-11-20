import React, { useEffect, useState } from "react";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapSection = ({ orderId }) => {
  const mapContainer = React.useRef(null);
  const map = React.useRef(null);
  const [markers, setMarkers] = useState([]);
  const [route, setRoute] = useState(null);

  useEffect(() => {
    // Initialize the map only once
    if (!map.current && mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [37.012128, -1.100903], // Default center (Juja, Kenya)
        zoom: 10,
      });
    }

    // Cleanup route and markers when the component unmounts
    return () => {
      if (map.current) {
        const layers = map.current.getStyle().layers;
        layers.forEach((layer) => {
          if (layer.id === "route") {
            map.current.removeLayer("route");
            map.current.removeSource("route");
          }
        });
        markers.forEach((marker) => marker.remove());
      }
    };
  }, []);

  useEffect(() => {
    if (orderId) {
      axios
        .get(`https://cklogisticsco.onrender.com/backend/order/${orderId}/coordinates/`)
        .then((response) => {
          const { origin, destination, checkpoints } = response.data;

          // Clear previous markers before adding new ones
          markers.forEach((marker) => marker.remove());

          const newMarkers = [];
          let locations = [origin, ...checkpoints, destination];

          // Add markers for origin, destination, and checkpoints (if any)
          if (checkpoints.length > 0) {
            locations.forEach((location) => {
              const markerColor = location === origin ? "green" : location === destination ? "red" : "blue";

              const marker = new mapboxgl.Marker({ color: markerColor })
                .setLngLat([location.longitude, location.latitude])
                .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(location.name))
                .addTo(map.current);

              newMarkers.push(marker);
            });
          } else {
            // Only add origin and destination markers if no checkpoints exist
            const originMarker = new mapboxgl.Marker({ color: "green" })
              .setLngLat([origin.longitude, origin.latitude])
              .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(origin.name))
              .addTo(map.current);
              
            const destinationMarker = new mapboxgl.Marker({ color: "red" })
              .setLngLat([destination.longitude, destination.latitude])
              .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(destination.name))
              .addTo(map.current);

            newMarkers.push(originMarker, destinationMarker);
          }

          setMarkers(newMarkers);

          // Adjust map bounds to fit all markers
          const bounds = new mapboxgl.LngLatBounds();
          locations.forEach((location) => bounds.extend([location.longitude, location.latitude]));
          map.current.fitBounds(bounds, { padding: 50 });

          // Request route data from the Directions API
          const waypoints = locations.map((location) => [location.longitude, location.latitude]);
          const routeUrl = checkpoints.length > 0
            ? `https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints.join(";")}?geometries=geojson&access_token=${mapboxgl.accessToken}`
            : `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

          axios
            .get(routeUrl)
            .then((routeResponse) => {
              const routeData = routeResponse.data.routes[0].geometry;
              setRoute(routeData);

              // Remove previous route layer if it exists
              const layers = map.current.getStyle().layers;
              layers.forEach((layer) => {
                if (layer.id === "route") {
                  map.current.removeLayer("route");
                  map.current.removeSource("route");
                }
              });

              // Add the new route as a line on the map
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
        })
        .catch((error) => console.error("Failed to fetch order data:", error));
    }
  }, [orderId, markers]);

  return <div ref={mapContainer} style={{ width: "100%", height: "500px" }} />;
};

export default MapSection;

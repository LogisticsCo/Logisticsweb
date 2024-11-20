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
  const [additionalMarker, setAdditionalMarker] = useState(null);
  const [additionalRoute, setAdditionalRoute] = useState(null);

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
          if (layer.id === "route" || layer.id === "additionalRoute") {
            map.current.removeLayer(layer.id);
            map.current.removeSource(layer.id);
          }
        });
        markers.forEach((marker) => marker.remove());
        if (additionalMarker) additionalMarker.remove();
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

          // Now fetch the additional marker data from a different API
          axios
            .get("https://example.com/api/markerData") // Replace with your real API URL
            .then((additionalResponse) => {
              const additionalPoint = additionalResponse.data; // Assuming the data has latitude, longitude

              // Use the Mapbox Directions API to find the closest point on the route
              const closestPoint = findClosestPointOnRoute(route, [additionalPoint.longitude, additionalPoint.latitude]);

              // Add the new marker at the closest point
              const newMarker = new mapboxgl.Marker({ color: "green" })
                .setLngLat(closestPoint)
                .setPopup(new mapboxgl.Popup({ offset: 25 }).setText("Additional Marker"))
                .addTo(map.current);

              setAdditionalMarker(newMarker);

              // Draw a new route from the origin to the additional point, colored green
              const additionalRouteUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.longitude},${origin.latitude};${closestPoint[0]},${closestPoint[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
              
              axios
                .get(additionalRouteUrl)
                .then((routeResponse) => {
                  const additionalRouteData = routeResponse.data.routes[0].geometry;
                  setAdditionalRoute(additionalRouteData);

                  // Remove previous additional route layer if it exists
                  const layers = map.current.getStyle().layers;
                  layers.forEach((layer) => {
                    if (layer.id === "additionalRoute") {
                      map.current.removeLayer("additionalRoute");
                      map.current.removeSource("additionalRoute");
                    }
                  });

                  // Add the new route as a line on the map
                  if (additionalRouteData) {
                    map.current.addLayer({
                      id: "additionalRoute",
                      type: "line",
                      source: {
                        type: "geojson",
                        data: {
                          type: "Feature",
                          properties: {},
                          geometry: additionalRouteData,
                        },
                      },
                      paint: {
                        "line-color": "#00ff00", // Green color for the additional route
                        "line-width": 5,
                      },
                    });
                  }
                })
                .catch((error) => console.error("Error fetching additional route:", error));
            })
            .catch((error) => console.error("Error fetching additional marker data:", error));
        })
        .catch((error) => console.error("Failed to fetch order data:", error));
    }
  }, [orderId, markers]);

  // Function to find the closest point on the route
  const findClosestPointOnRoute = (routeGeoJSON, point) => {
    let minDistance = Infinity;
    let closestPoint = null;

    // Loop through each segment of the route
    routeGeoJSON.coordinates.forEach((coordinate, index) => {
      if (index < routeGeoJSON.coordinates.length - 1) {
        const segmentStart = routeGeoJSON.coordinates[index];
        const segmentEnd = routeGeoJSON.coordinates[index + 1];

        // Find the closest point on the segment
        const closest = getClosestPointOnSegment(segmentStart, segmentEnd, point);
        const distance = getDistance(closest, point);

        if (distance < minDistance) {
          minDistance = distance;
          closestPoint = closest;
        }
      }
    });

    return closestPoint;
  };

  // Function to get the closest point on a segment (line between two points)
  const getClosestPointOnSegment = (start, end, point) => {
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    const t = ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / (dx * dx + dy * dy);
    const clampedT = Math.max(0, Math.min(1, t));
    return [
      start[0] + clampedT * dx,
      start[1] + clampedT * dy,
    ];
  };

  // Function to calculate the distance between two points
  const getDistance = (point1, point2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (point2[1] - point1[1]) * Math.PI / 180;
    const dLon = (point2[0] - point1[0]) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(point1[1] * Math.PI / 180) * Math.cos(point2[1] * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Returns the distance in km
  };

  return (
    <div className="map-container">
      <div ref={mapContainer} className="map-container__map" />
    </div>
  );
};

export default MapSection;

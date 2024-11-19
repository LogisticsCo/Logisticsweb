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
    
    if (orderId) {
      axios
        .get(`https://cklogisticsco.onrender.com/backend/order/${orderId}/coordinates/`)
        .then((response) => {
          const { origin, destination, checkpoints } = response.data;

          
          markers.forEach((marker) => marker.remove());

          const newMarkers = [];
          const locations = [origin, ...checkpoints, destination];

          
          if (checkpoints.length > 0) {
            
            locations.forEach((location) => {
              
              const markerColor = location === origin ? "green" : location === destination ? "red" : "blue";

              const marker = new mapboxgl.Marker({
                color: markerColor, 
              })
                .setLngLat([location.longitude, location.latitude])
                .setPopup(
                  new mapboxgl.Popup({ offset: 25 }).setText(location.name)
                )
                .addTo(map.current);

              newMarkers.push(marker);
            });
          } else {
            
            const markerColor = "green";
            new mapboxgl.Marker({ color: markerColor })
              .setLngLat([origin.longitude, origin.latitude])
              .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(origin.name))
              .addTo(map.current);
              
            new mapboxgl.Marker({ color: "red" })
              .setLngLat([destination.longitude, destination.latitude])
              .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(destination.name))
              .addTo(map.current);
          }

          setMarkers(newMarkers);

          
          const bounds = new mapboxgl.LngLatBounds();
          locations.forEach((location) =>
            bounds.extend([location.longitude, location.latitude])
          );
          map.current.fitBounds(bounds, { padding: 50 });

          
          const waypoints = locations.map(location => [location.longitude, location.latitude]);
          
          
          const routeUrl = checkpoints.length > 0
            ? `https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints.join(';')}?geometries=geojson&access_token=${mapboxgl.accessToken}`
            : `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

          axios
            .get(routeUrl)
            .then((routeResponse) => {
              const routeData = routeResponse.data.routes[0].geometry;
              setRoute(routeData);

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
        })
        .catch((error) => console.error("Failed to fetch order data:", error));
    }
  }, [orderId, markers]);

  return <div ref={mapContainer} style={{ width: "100%", height: "500px" }} />;
};

export default MapSection;

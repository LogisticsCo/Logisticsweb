import React, { useEffect, useState } from "react";
import axios from "axios";
import DropdownButton from "./dropdown";

const OrderCard = ({
  orderId,
  truckPlate,
  origin,
  destination,
  checkpoints,
  orderStatus,
  isActive,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`group rounded-lg p-4 flex flex-wrap gap-5 md:gap-0 justify-between items-center mb-4 cursor-pointer transition-opacity duration-300 ease-in-out relative ${
        isActive ? "bg-blue-800 border-2 border-blue-500" : "bg-gray-900"
      }`}
    >
      <div className="flex flex-col space-y-2">
        <div className="text-white text-sm font-semibold">
          Order ID: {orderId} 
        </div>
        <div className="space-y-1 text-gray-400 text-xs">
          <div>
            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
            Tracking Number: {orderId} {/* Same as Order ID */}
          </div>
          <div>
            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
            Truck Plate: {truckPlate}
          </div>
          <div>
            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
            Origin: {origin}
          </div>
          <div>
            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
            Destination: {destination}
          </div>
          <div>
            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
            Checkpoints: {checkpoints && checkpoints.length > 0 ? checkpoints.join(", ") : "No checkpoints available"}
          </div>
          {/* Displaying Order Status */}
          <div>
            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
            Status:{" "}
            <span
              className={`font-semibold ${
                orderStatus === "Active" ? "text-green-400" : "text-red-400"
              }`}
            >
              {orderStatus}
            </span>
          </div>
          
        </div>
        
      </div>
      <div>
            <img src="/truck1.png" alt="Vehicle" className="h-20 object-contain" />
          </div>
    </div>
  );
};

const OrderList = ({ activeOrderId, setActiveOrderId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken"); // Get the refresh token from storage

      if (!refreshToken) {
        throw new Error("No refresh token found");
      }

      const response = await axios.post(
        "https://cklogisticsco.onrender.com/backend/token/refresh/",
        { refresh: refreshToken }, // Send the refresh token to get a new access token
        { headers: { "Content-Type": "application/json" } }
      );

      const { access } = response.data; // Assuming the new access token is returned in "access"
      localStorage.setItem("accessToken", access); // Save the new access token
      return access; // Return the new access token
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw new Error("Unable to refresh token");
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axios.get(
        "https://cklogisticsco.onrender.com/backend/trucks/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          const newAccessToken = await refreshAccessToken(); // Get a new access token using the refresh token

          const response = await axios.get(
            "https://cklogisticsco.onrender.com/backend/token/refresh/",
            {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            }
          );

          setOrders(response.data); 
          setLoading(false);
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          setLoading(false);
        }
      } else {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-gray-700/50 p-4 md:p-6 md:rounded-3xl w-full h-full mx-auto border border-gray-700">
      <div className="flex justify-between">
        <div className="text-white font-semibold text-xl mb-4">
          Filter by Partners
        </div>
      </div>

      {/* Order Cards */}
      <div>
        {loading ? (
          <div className="text-white">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-white">No orders available</div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.tracking_number}
              orderId={order.tracking_number} 
              truckPlate={order.truck_plate} 
              origin={order.origin} 
              destination={order.destination} 
              checkpoints={order.checkpoints} 
              orderStatus={order.status} 
              isActive={order.tracking_number === activeOrderId} 
              onClick={() => setActiveOrderId(order.tracking_number)} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default OrderList;

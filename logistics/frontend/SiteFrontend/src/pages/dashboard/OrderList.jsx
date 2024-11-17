import React, { useEffect, useState } from "react";
import axios from 'axios';
import DropdownButton from "./dropdown";

const OrderCard = ({ orderId, truckPlate, origin, destination, checkpoints, orderStatus, isActive, onClick }) => {
  return (
    
    <div
      onClick={onClick}
      className={`group rounded-lg p-4 flex flex-wrap gap-5 md:gap-0 justify-between items-center mb-4 cursor-pointer transition-opacity duration-300 ease-in-out relative ${
        isActive ? "bg-blue-800 border-2 border-blue-500" : "bg-gray-900"
      }`}
    >
      <div className="flex flex-col space-y-2">
        <div className="text-white text-sm font-semibold">
          Order ID: {orderId} {/* Use Order ID as Tracking Number */}
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
            Checkpoints: {checkpoints.join(", ")}
          </div>
          {/* Displaying Order Status */}
          <div>
            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
            Status: <span className={`font-semibold ${orderStatus === 'Active' ? 'text-green-400' : 'text-red-400'}`}>{orderStatus}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderList = ({ activeOrderId, setActiveOrderId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch order data from the backend API
    const fetchOrders = async () => {
      try {
        const response = await axios.get("https://your-backend-api.com/orders"); // Replace with actual API endpoint
        setOrders(response.data); // Assuming response.data is an array of orders
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="bg-gray-700/50 p-4 md:p-6 md:rounded-3xl w-full h-full mx-auto border border-gray-700">
      <div className="flex justify-between">
        <div className="text-white font-semibold text-xl mb-4">Filter by Partners</div>
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
              key={order.orderId}
              orderId={order.orderId} // Use orderId as Tracking Number
              truckPlate={order.truckPlate} // Pass truck plate
              origin={order.origin} // Pass origin
              destination={order.destination} // Pass destination
              checkpoints={order.checkpoints} // Pass checkpoints
              orderStatus={order.orderStatus} // Pass order status
              isActive={order.orderId === activeOrderId}
              onClick={() => setActiveOrderId(order.orderId)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default OrderList;

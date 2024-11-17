import React from "react";
import DropdownButton from "./dropdown";

const OrderList = ({ orders, activeOrderId, setActiveOrderId }) => {
  const [selectedFilter, setSelectedFilter] = React.useState("All Orders");

  const filteredOrders =
    selectedFilter === "All Orders"
      ? orders
      : orders.filter((order) => order.status === selectedFilter);

  return (
    <div className="bg-gray-700/50 p-4 md:p-6 md:rounded-3xl w-full h-full mx-auto border border-gray-700">
      <div className="flex justify-between">
        <div className="text-white font-semibold text-xl mb-4">
          Filter by Partners
        </div>
        <div className="flex justify-between mb-4">
          <DropdownButton setSelectedOption={setSelectedFilter} />
        </div>
      </div>

      {/* Order Cards */}
      <div className="group">
        {filteredOrders.length === 0 ? (
          <p className="text-gray-400">No orders available. Please add an order.</p>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.orderId}
              orderId={order.orderId}
              status={order.status}
              times={order.times}
              image={order.image}
              isActive={order.orderId === activeOrderId}
              onClick={() => setActiveOrderId(order.orderId)} // Update active order on click
            />
          ))
        )}
      </div>
    </div>
  );
};

// OrderCard component defined within the same file
const OrderCard = ({ orderId, status, times, image, isActive, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`border rounded-lg p-4 mb-4 cursor-pointer ${
        isActive ? "border-blue-500" : "border-gray-600"
      } hover:border-blue-500 transition-all`}
    >
      <div className="flex items-center space-x-4">
        <img src={image} alt="Order" className="w-16 h-16 object-cover rounded-md" />
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold text-white">{orderId}</h3>
          <p className="text-gray-400">Status: {status}</p>
          <div className="text-gray-500">
            <p>Checking Time: {times.checking}</p>
            <p>In Transit Time: {times.inTransit}</p>
            <p>Out for Delivery Time: {times.outForDelivery}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;

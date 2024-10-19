import React, { useState } from "react";
import DropdownButton from "./dropdown";

const OrderCard = ({ orderId, status, times, vehicleType }) => {
  // Determine status color
  const statusColors = {
    "In Transit": "text-green-400",
    Checking: "text-yellow-400",
    Completed: "text-blue-400",
  };

  const vehicleImages = {
    truck: "/path/to/truck-image.png", // Replace with the actual truck image path
    van: "/path/to/van-image.png", // Replace with the actual van image path
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 flex justify-between items-center mb-4">
      {/* Left Section */}
      <div className="flex flex-col space-y-2">
        <div className="text-white text-sm font-semibold">
          Order ID {orderId}{" "}
          <span className={`${statusColors[status]} ml-2`}>({status})</span>
        </div>
        <div className="space-y-1 text-gray-400 text-xs">
          <div>
            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
            Checking {times.checking}
          </div>
          <div>
            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
            In-Transit {times.inTransit}
          </div>
          <div>
            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
            Out for Delivery {times.outForDelivery}
          </div>
        </div>
      </div>
      {/* Right Section */}
      <div>
        <img
          src={vehicleImages[vehicleType]}
          alt="Vehicle"
          className="h-20 object-contain"
        />
      </div>
    </div>
  );
};

const OrderList = () => {
  const [selectedFilter, setSelectedFilter] = useState("All Orders");

  const orders = [
    {
      orderId: "ZZABLJF2Q",
      status: "In Transit",
      times: { checking: "11:30", inTransit: "03:00", outForDelivery: "04:00" },
      vehicleType: "truck",
    },
    {
      orderId: "7OCHAQXHA",
      status: "Checking",
      times: { checking: "02:45", inTransit: "04:00", outForDelivery: "05:20" },
      vehicleType: "truck",
    },
    {
      orderId: "8N016H2USD",
      status: "Completed",
      times: { checking: "08:50", inTransit: "05:00", outForDelivery: "06:30" },
      vehicleType: "van",
    },
    {
      orderId: "0BLX9XH22",
      status: "In Transit",
      times: { checking: "10:10", inTransit: "11:30", outForDelivery: "02:00" },
      vehicleType: "truck",
    },
    {
      orderId: "RJVIQSU66",
      status: "Checking",
      times: { checking: "01:20", inTransit: "02:45", outForDelivery: "03:00" },
      vehicleType: "truck",
    },
  ];

  const filteredOrders =
    selectedFilter === "All Orders"
      ? orders
      : orders.filter((order) => order.status === selectedFilter);

  return (
    <div className="bg-gray-800 p-6 rounded-3xl w-full h-full mx-auto border border-gray-400">
      <div className="flex justify-between">
        <div className="text-white font-semibold text-xl mb-4">
          Filter by Partners
        </div>
        <div className="flex justify-between mb-4">
          <DropdownButton setSelectedOption={setSelectedFilter} />
        </div>
      </div>
      <div className="bg-gray-700 p-3 rounded-md mb-4">
        <div className="flex space-x-4 overflow-x-auto">
          {/* Filters - Replace with real filters */}
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Enim pharetra null
          </button>
          <button className="bg-gray-800 text-white px-4 py-2 rounded-md">
            Lacinia mal
          </button>
          <button className="bg-gray-800 text-white px-4 py-2 rounded-md">
            Ornare ornare vivamus
          </button>
          <button className="bg-gray-800 text-white px-4 py-2 rounded-md">
            Ileque convallisar
          </button>
        </div>
      </div>

      {/* Order Cards */}
      {filteredOrders.map((order, index) => (
        <OrderCard
          key={index}
          orderId={order.orderId}
          status={order.status}
          times={order.times}
          vehicleType={order.vehicleType}
        />
      ))}
    </div>
  );
};

export default OrderList;

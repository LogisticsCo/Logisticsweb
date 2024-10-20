import React from "react";
import DropdownButton from "./dropdown";

const OrderCard = ({ orderId, status, times, image, isActive, onClick }) => {
  const statusColors = {
    "In Transit": "text-green-400",
    Checking: "text-yellow-400",
    Completed: "text-blue-400",
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-lg p-4 flex justify-between items-center mb-4 cursor-pointer transition-opacity duration-300 ease-in-out ${
        isActive ? "bg-blue-800 border-2 border-blue-500" : "bg-gray-900"
      } group-hover:opacity-70 hover:!opacity-100`} // Smooth transition
    >
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
      <div>
        <img src={image} alt="Vehicle" className="h-20 object-contain" />
      </div>
    </div>
  );
};

const OrderList = ({ activeOrderId, setActiveOrderId }) => {
  const [selectedFilter, setSelectedFilter] = React.useState("All Orders");

  const orders = [
    {
      orderId: "ZZABLJF2Q",
      status: "In Transit",
      times: { checking: "11:30", inTransit: "03:00", outForDelivery: "04:00" },
      vehicleType: "truck",
      image: "/truck1.png",
    },
    {
      orderId: "7OCHAQXHA",
      status: "Checking",
      times: { checking: "02:45", inTransit: "04:00", outForDelivery: "05:20" },
      vehicleType: "truck",
      image: "/truck2.png",
    },
    {
      orderId: "8N016H2USD",
      status: "Completed",
      times: { checking: "08:50", inTransit: "05:00", outForDelivery: "06:30" },
      vehicleType: "van",
      image: "/truck3.png",
    },
    {
      orderId: "0BLX9XH22",
      status: "In Transit",
      times: { checking: "10:10", inTransit: "11:30", outForDelivery: "02:00" },
      vehicleType: "truck",
      image: "/truck4.png",
    },
    {
      orderId: "RJVIQSU66",
      status: "Checking",
      times: { checking: "01:20", inTransit: "02:45", outForDelivery: "03:00" },
      vehicleType: "truck",
      image: "/truck5.png",
    },
    {
      orderId: "RJVIQSU67",
      status: "In Transit",
      times: { checking: "01:20", inTransit: "02:45", outForDelivery: "03:00" },
      vehicleType: "truck",
      image: "/truck2.png",
    },
  ];

  const filteredOrders =
    selectedFilter === "All Orders"
      ? orders
      : orders.filter((order) => order.status === selectedFilter);

  return (
    <div className="bg-gray-700/50 p-6 rounded-3xl w-full h-full mx-auto border border-gray-700">
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
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.orderId}
            orderId={order.orderId}
            status={order.status}
            times={order.times}
            image={order.image}
            isActive={order.orderId === activeOrderId}
            onClick={() => setActiveOrderId(order.orderId)} // Update active order on click
          />
        ))}
      </div>
    </div>
  );
};

export default OrderList;

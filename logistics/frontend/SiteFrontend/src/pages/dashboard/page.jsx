import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import OrderList from "./OrderList";
import MapSection from "./MapSection";

const Dashboard = () => {
  const [activeOrderId, setActiveOrderId] = useState("ZZABLJF2Q"); // Default active order ID

  return (
    <div className="flex min-h-screen bg-gray-800">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header />
        <div className="grid grid-cols-3 h-full">
          <div className="px-10 py-6 col-span-2">
            {/* Pass the activeOrderId and setActiveOrderId to OrderList */}
            <OrderList
              activeOrderId={activeOrderId}
              setActiveOrderId={setActiveOrderId}
            />
          </div>
          <div className="pr-10 py-6">
            {/* Pass the activeOrderId to MapSection */}
            <MapSection orderId={activeOrderId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

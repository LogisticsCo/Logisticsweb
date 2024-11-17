import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import OrderList from "./OrderList";
import MapSection from "./MapSection";

const Dashboard = () => {
  const [activeOrderId, setActiveOrderId] = useState("ZZABLJF2Q"); // Default active order ID

  return (
    <div className="flex min-h-screen bg-gray-800 w-full">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header />
        <div className="flex flex-col-reverse md:grid md:grid-cols-3 h-full">
          <div className="md:px-10 py-6 md:col-span-2">
            {/* Pass the activeOrderId and setActiveOrderId to OrderList */}
            <OrderList
              activeOrderId={activeOrderId}
              setActiveOrderId={setActiveOrderId}
            />
          </div>
          <div className="md:pr-10 py-6">
            {/* Pass the activeOrderId to MapSection */}
            <MapSection orderId={activeOrderId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

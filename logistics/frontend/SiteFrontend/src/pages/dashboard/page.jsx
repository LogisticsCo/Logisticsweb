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
        <div className="flex flex-col md:grid md:grid-cols-12 h-full">
          <div className="md:px-6 py-6 md:col-span-4 lg:col-span-3">
            {/* Pass the activeOrderId and setActiveOrderId to OrderList */}
            <OrderList
              activeOrderId={activeOrderId}
              setActiveOrderId={setActiveOrderId}
            />
          </div>
          <div className="md:px-6 py-6 md:col-span-8 lg:col-span-9">
            {/* Pass the activeOrderId to MapSection */}
            <MapSection orderId={activeOrderId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

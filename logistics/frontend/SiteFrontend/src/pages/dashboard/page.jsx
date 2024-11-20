import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import OrderList from "./OrderList";
import MapSection from "./MapSection";

const Dashboard = () => {
  const [activeOrder, setActiveOrder] = useState(null);
  const [activeOrderId, setActiveOrderId] = useState("");
  const { tracking_number, truck_plate, origin, status } = activeOrder || {};
  useEffect(() => {
    setActiveOrderId(activeOrderId);
  }, [activeOrderId]);
  return (
    <div className="flex min-h-screen bg-gray-800 w-full">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header />
        <div className="flex flex-col md:grid md:grid-cols-12 h-full">
          <div className="md:px-6 py-6 md:col-span-4 lg:col-span-3">
            {/* Pass the activeOrderId and setActiveOrderId to OrderList */}
            <OrderList
              activeOrder={activeOrder}
              activeOrderId={activeOrderId}
              setActiveOrder={setActiveOrder}
              setActiveOrderId={setActiveOrderId}
            />
          </div>
          <div className="md:px-6 py-6 md:col-span-8 lg:col-span-9">
            {/* Pass the activeOrderId to MapSection */}
            {activeOrderId && (
              <MapSection order={activeOrderId} statuss={status} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

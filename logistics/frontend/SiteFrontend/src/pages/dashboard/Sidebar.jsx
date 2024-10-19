import React, { useState } from "react";
import {
  FaHome,
  FaUser,
  FaPercent,
  FaComment,
  FaBox,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  // State to keep track of the active menu item
  const [activeItem, setActiveItem] = useState("home");

  // Sidebar items
  const items = [
    { id: "home", icon: <FaHome />, tooltip: "Dashboard" },
    { id: "profile", icon: <FaUser />, tooltip: "Profile" },
    { id: "discounts", icon: <FaPercent />, tooltip: "Discounts" },
    { id: "messages", icon: <FaComment />, tooltip: "Messages" },
    { id: "inventory", icon: <FaBox />, tooltip: "Inventory" },
  ];

  return (
    <div className="bg-gray-900 min-h-screen w-16 flex flex-col items-center py-4 space-y-4">
      {/* Logo Section */}
      <div className="bg-gray-800 p-2 rounded-lg mb-4 cursor-pointer">
        <img
          src="/path/to/logo.png"
          alt="Logo"
          className="h-8 w-8 object-contain"
        />
      </div>

      {/* Menu Items */}
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => setActiveItem(item.id)}
          className={`relative flex items-center justify-center w-10 h-10 cursor-pointer rounded-md 
            ${
              activeItem === item.id
                ? "bg-gray-700 text-white"
                : "text-gray-500 hover:bg-gray-800"
            }`}
        >
          {item.icon}
          {/* Active Indicator */}
          {activeItem === item.id && (
            <div className="absolute -left-1 w-2 h-2 bg-gray-900 rounded-full transform translate-x-1/2"></div>
          )}
        </div>
      ))}

      {/* Spacer */}
      <div className="flex-grow"></div>

      {/* Logout Button */}
      <div
        onClick={() => setActiveItem("logout")}
        className={`flex items-center justify-center w-10 h-10 cursor-pointer rounded-md 
          ${
            activeItem === "logout"
              ? "bg-gray-700 text-white"
              : "text-gray-500 hover:bg-gray-800"
          }`}
      >
        <FaSignOutAlt />
      </div>
    </div>
  );
};

export default Sidebar;

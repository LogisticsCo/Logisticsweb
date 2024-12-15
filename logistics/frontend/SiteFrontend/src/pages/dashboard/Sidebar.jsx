import React, { useState } from "react";
import {
  FaHome,
  FaUser,
  FaPercent,
  FaComment,
  FaBox,
  FaSignOutAlt,
} from "react-icons/fa";
import axios from "axios";

const Sidebar = () => {
  // State to keep track of the active menu item
  const [activeItem, setActiveItem] = useState("home");
  const [imgError, setImgError] = useState(false);

  // State to control modal visibility and form data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Sidebar items
  const items = [
    { id: "home", icon: <FaHome />, tooltip: "Dashboard" },
    { id: "inventory", icon: <FaBox />, tooltip: "Inventory" },
  ];

  const handleSignOut = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    window.location.href = '/'; // Redirect to home or login page
  };

  const handleInventoryClick = () => {
    setIsModalOpen(true);
    setActiveItem("inventory");
  };

  const handleSendEmail = async () => {
    try {
      const response = await axios.post("https://cklogisticsback.onrender.com/backend/send-email/", {
        orderNumber,
        email,
      });
      if (response.status === 200) {
        setMessage("Email sent successfully!");
        setOrderNumber("");
        setEmail("");
      }
    } catch (error) {
      setMessage("Error sending email. Please try again.");
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen w-16 flex flex-col items-center py-4 space-y-4">
      {/* Logo Section */}
      <div className="bg-gray-800 p-2 rounded-lg mb-4 cursor-pointer">
        {imgError ? (
          <span className="text-white text-lg font-bold">CK</span>
        ) : (
          <img
            src="/path/to/logo.png"
            alt="Logo"
            className="h-8 w-8 object-contain"
            onError={() => setImgError(true)} // Set imgError to true if the image fails to load
          />
        )}
      </div>

      {/* Menu Items */}
      {items.map((item) => (
        <div
          key={item.id}
          onClick={item.id === "inventory" ? handleInventoryClick : () => setActiveItem(item.id)}
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
        onClick={handleSignOut}
        className={`flex items-center justify-center w-10 h-10 cursor-pointer rounded-md 
          ${
            activeItem === "logout"
              ? "bg-gray-700 text-white"
              : "text-gray-500 hover:bg-gray-800"
          }`}
      >
        <FaSignOutAlt />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4">Send Email</h2>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Order Number</label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="Enter order number"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="Enter email address"
              />
            </div>
            <div className="mb-4 text-sm text-red-500">{message}</div>
            <div className="flex justify-between">
              <button
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                onClick={handleSendEmail}
              >
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

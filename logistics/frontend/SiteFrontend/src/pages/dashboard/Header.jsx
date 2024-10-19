import React from "react";
import { FaPlus } from "react-icons/fa";

const Header = () => {
  return (
    <div className="flex justify-between items-center p-4">
      <input
        type="text"
        placeholder="Search here"
        className="bg-gray-600 text-white rounded-full px-4 py-2 focus:outline-none w-1/3"
      />
      <div className="flex items-center">
        <button className="bg-blue-500 text-white rounded-lg px-4 py-2 flex items-center">
          <FaPlus className="mr-2" />
          Add New Truck
        </button>
        <img
          src="/profile2.png"
          alt="Profile"
          className="ml-4 rounded-full w-10 h-10"
        />
      </div>
    </div>
  );
};

export default Header;

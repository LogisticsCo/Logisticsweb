import React from "react";
import { FaPlus } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

const Header = () => {
  return (
    <div className="flex justify-between items-center p-4 px-10">
      <div className="relative w-80">
        <input
          type="text"
          placeholder="Search here"
          className="bg-gray-600 text-white rounded-lg px-4 py-2 pl-10 focus:outline-none w-full"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <FaSearch className="h-5 w-5" />
        </div>
      </div>
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

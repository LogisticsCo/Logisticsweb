import React, { useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";

const Header = () => {
  // State to manage modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to handle modal opening and closing
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <div className="flex justify-between items-center p-4 px-10 bg-gray-800">
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
          <button
            onClick={handleModalToggle}
            className="bg-blue-500 text-white rounded-lg px-4 py-2 flex items-center"
          >
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-500/50">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Add New Truck
            </h2>
            <form>
              {/* Truck Name Input */}
              <div className="mb-4">
                <label htmlFor="truckName" className="block text-gray-400 mb-2">
                  Truck Name
                </label>
                <input
                  type="text"
                  id="truckName"
                  name="truckName"
                  className="w-full border border-gray-600 bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  placeholder="Enter truck name"
                />
              </div>
              {/* Truck Capacity Input */}
              <div className="mb-4">
                <label htmlFor="capacity" className="block text-gray-400 mb-2">
                  Truck Capacity
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  className="w-full border border-gray-600 bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  placeholder="Enter capacity (in tons)"
                />
              </div>
              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleModalToggle}
                  className="bg-red-500 text-white rounded-md px-4 py-2 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded-md px-4 py-2"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

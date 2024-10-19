import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const DropdownButton = ({ setSelectedOption }) => {
  // State to manage dropdown visibility
  const [isOpen, setIsOpen] = useState(false);

  // State to store the selected option
  const [selectedOption, setSelectedOptionLocal] = useState("All Orders");

  // Options for the dropdown
  const options = [
    "All Orders",
    "In Transit",
    "Completed",
    "Checking",
    "Cancelled",
  ];

  // Handle option selection
  const handleSelect = (option) => {
    setSelectedOption(option); // Call the parent function
    setSelectedOptionLocal(option); // Update local state
    setIsOpen(false); // Close the dropdown after selection
  };

  return (
    <div className="relative inline-block">
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className=" bg-blue-600 text-white px-4 py-2 rounded-md flex justify-between items-center space-x-2 focus:outline-none"
      >
        <span>{selectedOption}</span>
        <FaChevronDown
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute mt-2 w-full bg-white rounded-md shadow-lg z-10">
          <ul className="py-1">
            {options.map((option, index) => (
              <li
                key={index}
                className={`mx-1 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer ${
                  selectedOption === option ? "bg-gray-100" : ""
                }`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownButton;

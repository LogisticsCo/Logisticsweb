import React, { useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";

const Header = ({ addOrder }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [truckDetails, setTruckDetails] = useState({
    truckName: "",
    truckPlate: "",
    origin: "",
    destination: "",
    checkpoints: [],
    capacity: "",
  });

  const [newCheckpoint, setNewCheckpoint] = useState(""); // State for new checkpoint input

  // Function to handle modal opening and closing
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTruckDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleCheckpointChange = (e) => {
    setNewCheckpoint(e.target.value); // Update checkpoint input
  };

  const handleAddCheckpoint = () => {
    if (newCheckpoint.trim() !== "") {
      setTruckDetails((prevDetails) => ({
        ...prevDetails,
        checkpoints: [...prevDetails.checkpoints, newCheckpoint],
      }));
      setNewCheckpoint(""); // Clear the input after adding
    }
  };

  const handleRemoveCheckpoint = (index) => {
    const updatedCheckpoints = truckDetails.checkpoints.filter(
      (checkpoint, idx) => idx !== index
    );
    setTruckDetails((prevDetails) => ({
      ...prevDetails,
      checkpoints: updatedCheckpoints,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newOrder = {
      ...truckDetails,
      orderId: Math.random().toString(36).substring(7), // Generate a random order ID
      status: "Checking",
      times: { checking: "00:00", inTransit: "", outForDelivery: "" },
      image: "/truck1.png", 
    };
    addOrder(newOrder);  // Call addOrder to pass the new order to Dashboard
    setIsModalOpen(false);  // Close the modal after saving
  };

  return (
    <>
      <div className="flex justify-between gap-5 flex-col-reverse md:flex-row items-center p-4 md:px-10 bg-gray-800">
        <div className="relative md:w-80">
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
            <h2 className="text-2xl font-semibold mb-4 text-white">Add New Truck</h2>
            <form onSubmit={handleSubmit}>
              {/* Truck Name Input */}
              <div className="mb-4">
                <label htmlFor="truckName" className="block text-gray-400 mb-2">
                  Truck Name
                </label>
                <input
                  type="text"
                  id="truckName"
                  name="truckName"
                  value={truckDetails.truckName}
                  onChange={handleChange}
                  className="w-full border border-gray-600 bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  placeholder="Enter truck name"
                />
              </div>

              {/* Truck Plate Input */}
              <div className="mb-4">
                <label htmlFor="truckPlate" className="block text-gray-400 mb-2">
                  Truck Plate
                </label>
                <input
                  type="text"
                  id="truckPlate"
                  name="truckPlate"
                  value={truckDetails.truckPlate}
                  onChange={handleChange}
                  className="w-full border border-gray-600 bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  placeholder="Enter truck plate"
                />
              </div>

              {/* Origin Input */}
              <div className="mb-4">
                <label htmlFor="origin" className="block text-gray-400 mb-2">
                  Origin
                </label>
                <input
                  type="text"
                  id="origin"
                  name="origin"
                  value={truckDetails.origin}
                  onChange={handleChange}
                  className="w-full border border-gray-600 bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  placeholder="Enter origin"
                />
              </div>

              {/* Destination Input */}
              <div className="mb-4">
                <label htmlFor="destination" className="block text-gray-400 mb-2">
                  Destination
                </label>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  value={truckDetails.destination}
                  onChange={handleChange}
                  className="w-full border border-gray-600 bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  placeholder="Enter destination"
                />
              </div>

              {/* Checkpoints Input */}
              <div className="mb-4">
                <label htmlFor="checkpoints" className="block text-gray-400 mb-2">
                  Checkpoints
                </label>
                <div className="flex flex-col">
                  {truckDetails.checkpoints.map((checkpoint, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-white">{checkpoint}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCheckpoint(index)}
                        className="bg-red-500 text-white rounded-md px-2 py-1 ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={newCheckpoint}
                    onChange={handleCheckpointChange}
                    className="w-full border border-gray-600 bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                    placeholder="Enter checkpoint"
                  />
                  <button
                    type="button"
                    onClick={handleAddCheckpoint}
                    className="bg-blue-500 text-white rounded-md px-4 py-2 ml-2"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Capacity Input */}
              <div className="mb-4">
                <label htmlFor="capacity" className="block text-gray-400 mb-2">
                  Capacity
                </label>
                <input
                  type="text"
                  id="capacity"
                  name="capacity"
                  value={truckDetails.capacity}
                  onChange={handleChange}
                  className="w-full border border-gray-600 bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  placeholder="Enter capacity"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleModalToggle}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Add Order
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

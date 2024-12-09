import React, { useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    truck_plate: "",
    origin: "",
    destination: "",
    checkpoints: [],
    status: "Checking",
  });

  const navigate = useNavigate();

  // Function to handle modal opening and closing
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle adding checkpoint
  const handleAddCheckpoint = () => {
    setFormData({
      ...formData,
      checkpoints: [...formData.checkpoints, ""],
    });
  };

  // Handle removing checkpoint
  const handleRemoveCheckpoint = (index) => {
    const newCheckpoints = [...formData.checkpoints];
    newCheckpoints.splice(index, 1);
    setFormData({
      ...formData,
      checkpoints: newCheckpoints,
    });
  };

  // Handle checkpoint change
  const handleCheckpointChange = (e, index) => {
    const { value } = e.target;
    const newCheckpoints = [...formData.checkpoints];
    newCheckpoints[index] = value;
    setFormData({
      ...formData,
      checkpoints: newCheckpoints,
    });
  };

  // Generate random tracking number with 3 letters and 3 numbers
  const generateTrackingNumber = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    let trackingNumber = "";
    for (let i = 0; i < 3; i++) {
      trackingNumber += letters.charAt(
        Math.floor(Math.random() * letters.length)
      );
    }
    for (let i = 0; i < 3; i++) {
      trackingNumber += numbers.charAt(
        Math.floor(Math.random() * numbers.length)
      );
    }
    return trackingNumber;
  };
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) throw new Error("Refresh token is missing");

      const response = await axios.post(
        "https://cklogistics-h9bxfpgsaqf3duab.canadacentral-01.azurewebsites.net/backend/token/refresh/",
        { refresh: refreshToken },
        { headers: { "Content-Type": "application/json" } }
      );

      const { access } = response.data;
      localStorage.setItem("accessToken", access); // Update accessToken
      return access;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trackingNumber = generateTrackingNumber();

    const dataToSend = {
      ...formData,
      tracking_number: trackingNumber,
    };
    console.log(dataToSend);
    setLoading(true);

    try {
      let accessToken = localStorage.getItem("accessToken");

      let response = await axios.post(
        "https://cklogistics-h9bxfpgsaqf3duab.canadacentral-01.azurewebsites.net/backend/create-order/",
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setLoading(false);
      handleModalToggle(); 
      window.location.reload();
    } catch (error) {
      if (error.response?.data?.code === "token_not_valid") {
        console.error("Token expired, refreshing...");
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
          try {
            const response = await axios.post(
              "https://cklogistics-h9bxfpgsaqf3duab.canadacentral-01.azurewebsites.net/backend/create-order/",
              dataToSend,
              {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                  "Content-Type": "application/json",
                },
              }
            );

            setLoading(false);
            handleModalToggle(); // Close the modal after successful submission
            return;
          } catch (retryError) {
            console.error("Error after refreshing token:", retryError);
          }
        } else {
          console.error("Failed to refresh token. Redirecting to login.");
          localStorage.clear();
          navigate("/login");
        }
      } else {
        console.error("Error saving truck data:", error);
      }

      setLoading(false);
    }
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
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Add New Truck
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Truck Plate Input */}
              <div className="mb-4">
                <label
                  htmlFor="truck_plate"
                  className="block text-gray-400 mb-2"
                >
                  Truck Plate
                </label>
                <input
                  type="text"
                  id="truck_plate"
                  name="truck_plate"
                  className="w-full border border-gray-600 bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  placeholder="Enter truck plate"
                  value={formData.truck_plate}
                  onChange={handleChange}
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
                  className="w-full border border-gray-600 bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  placeholder="Enter origin"
                  value={formData.origin}
                  onChange={handleChange}
                />
              </div>

              {/* Destination Input */}
              <div className="mb-4">
                <label
                  htmlFor="destination"
                  className="block text-gray-400 mb-2"
                >
                  Destination
                </label>
                <input
                  type="text"
                  id="destination"
                  name="destination"
                  className="w-full border border-gray-600 bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                  placeholder="Enter destination"
                  value={formData.destination}
                  onChange={handleChange}
                />
              </div>

              {/* Checkpoints */}
              <div className="mb-4">
                <label
                  htmlFor="checkpoints"
                  className="block text-gray-400 mb-2"
                >
                  Checkpoints
                </label>
                {formData.checkpoints.map((checkpoint, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={checkpoint}
                      onChange={(e) => handleCheckpointChange(e, index)}
                      className="w-full border border-gray-600 bg-gray-700 text-white rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                      placeholder={`Checkpoint ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCheckpoint(index)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddCheckpoint}
                  className="bg-green-500 text-white rounded-md px-4 py-2"
                >
                  Add Checkpoint
                </button>
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
                  disabled={loading}
                >
                  {loading ? (
                    <span className="animate-spin">Loading...</span>
                  ) : (
                    "Save"
                  )}
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

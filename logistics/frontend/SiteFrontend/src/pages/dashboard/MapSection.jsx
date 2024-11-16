import { initFlowbite } from "flowbite";
import React, { useEffect } from "react";
import { FaPhone, FaComment } from "react-icons/fa";

const MapSection = ({ orderId }) => {
  useEffect(() => {
    initFlowbite();
  });
  // Define a sample data structure to fetch relevant order details based on orderId
  const orderData = {
    ZZABLJF2Q: {
      status: "In Transit",
      image: "/truck1.png",
      driver: "/profile1.png",
    },
    "7OCHAQXHA": {
      status: "Checking",
      image: "/truck2.png",
      driver: "/profile2.png",
    },
    "8N016H2USD": {
      status: "Completed",
      image: "/truck3.png",
      driver: "/profile1.png",
    },
    "0BLX9XH22": {
      status: "In Transit",
      image: "/truck4.png",
      driver: "/profile1.png",
    },
    RJVIQSU66: {
      status: "Checking",
      image: "/truck5.png",
      driver: "/profile1.png",
    },
    RJVIQSU67: {
      status: "In Transit",
      image: "/truck3.png",
      driver: "/profile1.png",
    },
  };

  const activeOrder = orderData[orderId] || {
    status: "N/A",
    image: "/default-image.png",
    driver: "/default-image.png",
  };

  return (
    <div className="relative w-full min-h-screen md:h-full bg-gray-900 md:rounded-3xl overflow-hidden md:border border-gray-400/50">
      {/* Map Section (Placeholder for actual map integration) */}
      <div className="absolute inset-0">
        <div className="h-full w-full relative flex justify-center items-center">
          {/* Map Marker Placeholder */}
          <div className="absolute z-20 flex justify-center items-center">
            <div className="relative">
              {/* Animated blue border */}
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-ping"></div>

              {/* Profile image */}
              <button
                data-popover-target="popover-user-profile"
                data-popover-placement="top"
                type="button"
                className="bg-blue-500 rounded-full p-3"
              >
                <img
                  src={activeOrder.driver} // Use active order's image
                  alt="Driver"
                  className="w-10 rounded-full relative z-10" // Ensure image is above the animated border
                />
              </button>
              <div
                data-popover
                id="popover-user-profile"
                role="tooltip"
                class="absolute z-10 invisible inline-block w-64 text-sm transition-opacity duration-300 border rounded-lg shadow-sm opacity-0 text-gray-400 bg-gray-800 border-gray-600"
              >
                <div class="p-3">
                  <div class="flex items-center justify-between mb-2">
                    <a href="#">
                      <img
                        class="w-10 h-10 rounded-full"
                        src={activeOrder.driver}
                        alt="Jese Leos"
                      />
                    </a>
                    <div>
                      <button
                        type="button"
                        class="w-fit inline-flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                      >
                        <FaPhone className="mr-2" />
                        Call
                      </button>
                    </div>
                  </div>
                  <p class="text-base font-semibold leading-none text-white">
                    <a href="#">Jese Leos</a>
                  </p>
                  <p class="mb-3 text-sm font-normal">
                    <a href="#" class="hover:underline">
                      @jeseleos
                    </a>
                  </p>
                  <div className="py-3 mb-3">
                    <p class="mb-2 text-sm font-semibold text-white">
                      Select Geofence
                    </p>
                    <div class="flex items-center space-x-4">
                      <label class="text-gray-400">
                        <input
                          type="radio"
                          name="geofence"
                          value="radius"
                          class="mr-2"
                          checked
                        />
                        Radius
                      </label>
                      <label class="text-gray-400">
                        <input
                          type="radio"
                          name="geofence"
                          value="polygon"
                          class="mr-2"
                        />
                        Polygon
                      </label>
                    </div>
                  </div>

                  <ul class="flex text-sm">
                    <li class="me-2">
                      <a href="#" class="hover:underline">
                        <span class="font-semibold text-white">799</span>
                        <span> Trips Completed</span>
                      </a>
                    </li>
                  </ul>
                </div>
                <div data-popper-arrow></div>
              </div>
            </div>
          </div>

          <div className="relative w-full h-full">
            <iframe
              width="100%"
              height="100%"
              id="gmap_canvas"
              src="https://maps.google.com/maps?width=743&amp;height=400&amp;hl=en&amp;q=%20Nairobi+()&amp;t=&amp;z=12&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Top Section: Order ID and Actions */}
      <div
        style={{
          background:
            "linear-gradient(to bottom, rgba(31, 41, 55, 1), rgba(55, 65, 81, 0.9))",
        }}
        className="absolute top-0 left-0 right-0 p-4 md:p-6 flex flex-col justify-between items-center z-30"
      >
        <div className="flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center w-full">
          <div className="md:text-xs 2xl:text-sm font-semibold text-white">
            Order ID {orderId}
            <span className="text-green-400">({activeOrder.status})</span>
          </div>
          <div className="flex space-x-2">
            <button className="bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-2 flex items-center text-xs 2xl:text-sm text-white">
              <FaPhone className="mr-2" /> Call Driver
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 rounded-lg px-4 py-2 flex items-center text-xs 2xl:text-sm text-white">
              <FaComment className="mr-2" /> Chat with Driver
            </button>
          </div>
        </div>
        {/* Tabs (Shipping Info, Vehicle Info, etc.) */}
        <div className="w-full mt-4 overflow-x-auto scrollbar-hidden">
          <div className="flex mb-4 space-x-4 text-xs 2xl:text-sm">
            <button className="min-w-fit bg-gray-700 text-white rounded-full px-4 py-2 focus:outline-none">
              Shipping Info
            </button>
            <button className="min-w-fit bg-gray-800 text-gray-400 rounded-full px-4 py-2">
              Vehicle Info
            </button>
            <button className="min-w-fit bg-gray-800 text-gray-400 rounded-full px-4 py-2">
              Documents
            </button>
            <button className="min-w-fit bg-gray-800 text-gray-400 rounded-full px-4 py-2">
              Company
            </button>
            <button className="min-w-fit bg-gray-800 text-gray-400 rounded-full px-4 py-2">
              Billing
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Truck Capacity and Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-30">
        {/* Truck Capacity Section */}
        <div className="mb-6 bg-gray-800 p-4 rounded-lg flex items-center">
          <img
            src={activeOrder.image || "https://via.placeholder.com/100"} // Use active order's image
            alt="Truck"
            className="w-fit h-16 mr-4"
          />
          <div className="w-full">
            <div className="flex bg-gray-300 rounded-full h-4">
              <div
                className="bg-blue-500 rounded-full"
                style={{ width: "60%" }} // Adjust this percentage dynamically as needed
              ></div>
            </div>

            <div className="text-sm mt-2 text-gray-300">60% Full</div>
          </div>
        </div>

        {/* Truck Info (Weight, Space, Volume) */}
        <div className="grid grid-cols-4 gap-4 bg-gray-800 p-4 rounded-lg">
          <div className="text-sm">
            <div className="text-gray-400">Truck</div>
            <div className="text-white">Pack N’ Go SE012</div>
          </div>
          <div className="text-sm">
            <div className="text-gray-400">Weight</div>
            <div className="text-white">8,320 kg</div>
          </div>
          <div className="text-sm">
            <div className="text-gray-400">Space</div>
            <div className="text-white">60% / 100%</div>
          </div>
          <div className="text-sm">
            <div className="text-gray-400">Volume</div>
            <div className="text-white">24 m³</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSection;

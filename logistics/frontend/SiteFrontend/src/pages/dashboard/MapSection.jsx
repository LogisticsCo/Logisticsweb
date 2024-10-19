import React from "react";
import { FaPhone, FaComment } from "react-icons/fa";

const MapSection = () => {
  return (
    <div className="relative w-full h-full bg-gray-900 rounded-3xl overflow-hidden border border-gray-400/50">
      {/* Map Section (Placeholder for actual map integration) */}
      <div className="absolute inset-0">
        <div className="h-full w-full relative flex justify-center items-center">
          {/* Map Marker Placeholder */}
          <div className="absolute z-20 flex justify-center items-center">
            <div className="relative">
              {/* Animated blue border */}
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-ping"></div>

              {/* Profile image */}
              <div className="bg-blue-500 rounded-full p-3">
                <img
                  src="/profile1.png"
                  alt="Driver"
                  className="w-10 rounded-full relative z-10" // Ensure image is above the animated border
                />
              </div>
            </div>
          </div>

          <div class="relative w-full h-full">
            <iframe
              width="100%"
              height="100%"
              frameborder="0"
              marginheight="0"
              marginwidth="0"
              id="gmap_canvas"
              src="https://maps.google.com/maps?width=743&amp;height=400&amp;hl=en&amp;q=%20Nairobi+()&amp;t=&amp;z=12&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
              class="absolute top-0 left-0 w-full h-full"
            ></iframe>
            <div class="absolute top-0 left-0 w-full h-full bg-black opacity-50 pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Top Section: Order ID and Actions */}
      <div
        style={{
          background:
            "linear-gradient(to bottom, rgba(31, 41, 55, 1), rgba(55, 65, 81, 0.9))",
        }}
        className="absolute top-0 left-0 right-0 p-6 flex flex-col justify-between items-center z-30"
      >
        <div className="flex justify-between items-center w-full">
          <div className="text-xs 2xl:text-sm font-semibold text-white">
            Order ID ZZABLJF2Q
            <span className="text-green-400">(In Transit)</span>
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
            src="https://via.placeholder.com/100"
            alt="Truck"
            className="w-20 h-16 mr-4"
          />
          <div className="w-full">
            <div className="flex bg-gray-300 rounded-full h-4">
              <div
                className="bg-blue-500 rounded-full"
                style={{ width: "60%" }}
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

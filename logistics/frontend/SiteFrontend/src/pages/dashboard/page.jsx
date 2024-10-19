import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import OrderList from "./OrderList";
import MapSection from "./MapSection";

const Dashboard = () => {
  const [activeOrderId, setActiveOrderId] = useState("ZZABLJF2Q"); // Default active order ID

  return (
    <div className="flex min-h-screen bg-gray-800">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header />
        <div className="grid grid-cols-3 h-full">
          <div className="px-10 py-6 col-span-2">
            {/* Pass the activeOrderId and setActiveOrderId to OrderList */}
            <OrderList
              activeOrderId={activeOrderId}
              setActiveOrderId={setActiveOrderId}
            />
          </div>
          <div className="pr-10 py-6">
            {/* Pass the activeOrderId to MapSection */}
            <MapSection orderId={activeOrderId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// import Navbar from "./navbar/navbar";

// function Dashboard() {
//   return (
//     <main className="bg-gray-200 min-h-screen">
//       <Navbar />

//       <button
//         data-drawer-target="default-sidebar"
//         data-drawer-toggle="default-sidebar"
//         aria-controls="default-sidebar"
//         type="button"
//         class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
//       >
//         <span class="sr-only">Open sidebar</span>
//         <svg
//           class="w-6 h-6"
//           aria-hidden="true"
//           fill="currentColor"
//           viewBox="0 0 20 20"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             clip-rule="evenodd"
//             fill-rule="evenodd"
//             d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
//           ></path>
//         </svg>
//       </button>

//       <aside
//         id="default-sidebar"
//         class="pt-14 fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
//         aria-label="Sidebar"
//       >
//         <div class="h-full px-3 py-4 overflow-y-auto ">
//           <ul class="space-y-2 p-2 font-normal text-sm bg-white rounded-2xl">
//             <li>
//               <a
//                 href="#"
//                 class="flex items-center p-1 rounded-lg text-red-200 hover:bg-red-500 bg-red-500 group"
//               >
//                 <svg
//                   class="w-4 h-4 text-red-200 transition duration-75 group-hover:text-red-300"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="currentColor"
//                   viewBox="0 0 22 21"
//                 >
//                   <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
//                   <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
//                 </svg>
//                 <span class="ms-3">Dashboard</span>
//               </a>
//             </li>
//             <li>
//               <a
//                 href="#"
//                 class="flex items-center p-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
//               >
//                 <svg
//                   class="flex-shrink-0 w-4 h-4 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="currentColor"
//                   viewBox="0 0 18 18"
//                 >
//                   <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
//                 </svg>
//                 <span class="flex-1 ms-3 whitespace-nowrap">Shipment</span>
//               </a>
//             </li>
//             <li>
//               <a
//                 href="#"
//                 class="flex items-center p-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
//               >
//                 <svg
//                   class="flex-shrink-0 w-4 h-4 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
//                 </svg>
//                 <span class="flex-1 ms-3 whitespace-nowrap">Customer</span>
//               </a>
//             </li>
//             <li>
//               <a
//                 href="#"
//                 class="flex items-center p-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
//               >
//                 <svg
//                   class="flex-shrink-0 w-4 h-4 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="currentColor"
//                   viewBox="0 0 20 18"
//                 >
//                   <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
//                 </svg>
//                 <span class="flex-1 ms-3 whitespace-nowrap">Analysis</span>
//                 <span class="inline-flex items-center justify-center px-2 py-1 ms-3 text-xs font-normal text-red-200 bg-red-500 rounded-full dark:bg-gray-700 dark:text-gray-300">
//                   Pro
//                 </span>
//               </a>
//             </li>
//             <li>
//               <a
//                 href="#"
//                 class="flex items-center p-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
//               >
//                 <svg
//                   class="flex-shrink-0 w-4 h-4 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="currentColor"
//                   viewBox="0 0 18 20"
//                 >
//                   <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
//                 </svg>
//                 <span class="flex-1 ms-3 whitespace-nowrap">History</span>
//               </a>
//             </li>
//             <li>
//               <a
//                 href="#"
//                 class="flex items-center p-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
//               >
//                 <svg
//                   class="flex-shrink-0 w-4 h-4 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 18 16"
//                 >
//                   <path
//                     stroke="currentColor"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                     stroke-width="2"
//                     d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
//                   />
//                 </svg>
//                 <span class="flex-1 ms-3 whitespace-nowrap">Notifications</span>
//                 <span class="inline-flex items-center justify-center w-3 h-3 p-2 ms-3 text-xs font-normal text-red-200 bg-red-500 rounded-full dark:bg-blue-900 dark:text-blue-300">
//                   3
//                 </span>
//               </a>
//             </li>
//           </ul>
//           <div class="mt-4 space-y-2 p-2 w-full h-44 rounded-2xl bg-red-500"></div>
//         </div>
//       </aside>

//       <div class="p-4 sm:ml-64">
//         <div class="border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
//           <div class="relative flex items-center justify-center h-48 mb-4 overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-800">
//             <iframe
//               width="100%"
//               height="100%"
//               frameborder="0"
//               marginheight="0"
//               marginwidth="0"
//               id="gmap_canvas"
//               src="https://maps.google.com/maps?width=743&amp;height=400&amp;hl=en&amp;q=%20Nairobi+()&amp;t=&amp;z=12&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
//             ></iframe>
//             <div className="w-full h-full absolute bg-red-500/25"></div>
//           </div>
//           <div class="grid grid-cols-3 gap-4 mb-4">
//             <div class=" col-span-2 flex items-center justify-center rounded-2xl bg-gray-50 h-36 dark:bg-gray-800">
//               <p class="text-2xl text-gray-400 dark:text-gray-500">
//                 <svg
//                   class="w-3.5 h-3.5"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 18 18"
//                 >
//                   <path
//                     stroke="currentColor"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                     stroke-width="2"
//                     d="M9 1v16M1 9h16"
//                   />
//                 </svg>
//               </p>
//             </div>
//             <div class="flex items-center justify-center rounded-2xl bg-gray-50 h-36 dark:bg-gray-800">
//               <p class="text-2xl text-gray-400 dark:text-gray-500">
//                 <svg
//                   class="w-3.5 h-3.5"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 18 18"
//                 >
//                   <path
//                     stroke="currentColor"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                     stroke-width="2"
//                     d="M9 1v16M1 9h16"
//                   />
//                 </svg>
//               </p>
//             </div>
//           </div>
//           <div class="grid grid-cols-3 gap-4 mb-4">
//             <div class="flex items-center justify-center rounded-2xl bg-gray-50 h-28 dark:bg-gray-800">
//               <p class="text-2xl text-gray-400 dark:text-gray-500">
//                 <svg
//                   class="w-3.5 h-3.5"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 18 18"
//                 >
//                   <path
//                     stroke="currentColor"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                     stroke-width="2"
//                     d="M9 1v16M1 9h16"
//                   />
//                 </svg>
//               </p>
//             </div>
//             <div class="flex items-center justify-center rounded-2xl bg-gray-50 h-28 dark:bg-gray-800">
//               <p class="text-2xl text-gray-400 dark:text-gray-500">
//                 <svg
//                   class="w-3.5 h-3.5"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 18 18"
//                 >
//                   <path
//                     stroke="currentColor"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                     stroke-width="2"
//                     d="M9 1v16M1 9h16"
//                   />
//                 </svg>
//               </p>
//             </div>
//             <div class="flex items-center justify-center rounded-2xl bg-gray-50 h-28 dark:bg-gray-800">
//               <p class="text-2xl text-gray-400 dark:text-gray-500">
//                 <svg
//                   class="w-3.5 h-3.5"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 18 18"
//                 >
//                   <path
//                     stroke="currentColor"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                     stroke-width="2"
//                     d="M9 1v16M1 9h16"
//                   />
//                 </svg>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

// export default Dashboard;

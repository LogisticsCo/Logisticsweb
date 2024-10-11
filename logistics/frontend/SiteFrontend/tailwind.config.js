/** @type {import('tailwindcss').Config} */

const flowbite = require("flowbite-react/tailwind");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
    flowbite.content(),
  ],
  theme: {
    colors: {
    //   "ash-gray": "#A9B0A2",
    //   olive: "#5D6351FF",
    //   "black-olive": "#21261AFF",
    //   "ash-gray-2": "#B1B7AA",
    //   "giants-orange": "#FF6629",
    //   white: "#FEFEFF",
    //   earth: "#C98728",
    },
    backgroundImage: {
    //   "hero-pattern": "url('/bg/contour.svg')",
    },
  },
  plugins: [require("flowbite/plugin"), flowbite.plugin()],
};

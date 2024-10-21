function Signup() {
  return (
    <>
      {/* <!-- component --> */}
      <div class="bg-gray-900 flex justify-end items-center h-screen overflow-hidden relative">
        {/* <!-- Truck Image covering the whole screen --> */}
        <img
          src="/bgtruck2.jpeg"
          alt="Truck Background"
          class="absolute inset-0 object-cover w-full h-full z-0"
        />

        {/* <!-- Form container with glassmorphic effect, covering right half of the screen --> */}
        <div class="relative h-full w-full lg:w-1/2 bg-gray-800/50 backdrop-blur-lg z-10 flex justify-center items-center">
          <div class="p-8 lg:p-24 w-full">
            <h1 class="text-2xl font-semibold mb-4 text-gray-100">
              Register here<span className="text-7xl text-blue-400">.</span>
            </h1>
            <form action="#" method="POST">
              {/* <!-- Username Input --> */}
              <div class="mb-4">
                <label for="username" class="block text-gray-400 mb-4">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  class="text-gray-100 w-full border border-gray-500 rounded-md py-2 px-3 bg-gray-700 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                  autocomplete="off"
                  placeholder="Enter your username"
                />
              </div>
              {/* <!-- Password Input --> */}
              <div class="mb-4">
                <label for="password" class="block text-gray-400 mb-4">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  class="text-gray-100 w-full border border-gray-500 rounded-md py-2 px-3 bg-gray-700 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                  autocomplete="off"
                  placeholder="Enter your password"
                />
              </div>
              {/* <!-- Repeat Password Input --> */}
              <div class="mb-4">
                <label for="password" class="block text-gray-400 mb-4">
                  Repeat Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  class="text-gray-100 w-full border border-gray-500 rounded-md py-2 px-3 bg-gray-700 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                  autocomplete="off"
                  placeholder="Repeat your password"
                />
              </div>
              {/* <!-- Register Button --> */}
              <button
                type="submit"
                class="mt-10 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md py-2 px-4 w-full transition duration-300 ease-in-out"
              >
                Register
              </button>
            </form>
            {/* <!-- Sign in Link --> */}
            <div class="mt-6 text-gray-400">
              <span>Already have an account? </span>
              <a href="/login" class="text-blue-400 hover:underline">
                Sign in here
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;

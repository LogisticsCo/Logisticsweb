function Login() {
  return (
    <>
      {/* <!-- component --> */}
      <div class="bg-gray-800 flex justify-center items-center h-screen overflow-hidden">
        {/* <!-- Left: Image --> */}
        <div class="w-1/2 h-screen hidden lg:block">
          <img
            src="/bgtruck.jpeg"
            alt="Placeholder Image"
            class="object-cover w-full h-full"
          />
        </div>
        {/* <!-- Right: Login Form --> */}
        <div class="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
          <h1 class="text-2xl font-semibold mb-4 text-gray-300">
            Login here<span className="text-7xl text-blue-500">.</span>
          </h1>
          <form action="#" method="POST">
            {/* <!-- Username Input --> */}
            <div class="mb-4 bg-sky-100">
              <label for="username" class="block text-gray-400 mb-4">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                autocomplete="off"
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
                class="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                autocomplete="off"
              />
            </div>
            <div className="flex justify-between items-center mb-6 text-sm md:text-base">
              {/* <!-- Remember Me Checkbox --> */}
              <div class="flex items-center">
                <div class="flex items-center h-5">
                  <input
                    id="remember"
                    checked
                    type="checkbox"
                    value=""
                    class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                    required
                  />
                </div>
                <label
                  for="remember"
                  class="ms-1 md:ms-2 font-medium text-gray-400"
                >
                  Remember me
                </label>
              </div>
              {/* <!-- Forgot Password Link --> */}
              <div class="text-blue-500">
                <a href="#" class="hover:underline">
                  Forgot Password?
                </a>
              </div>
            </div>
            {/* <!-- Login Button --> */}
            <button
              type="submit"
              class="mt-10 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md py-2 px-4 w-full"
            >
              Login
            </button>
          </form>
          {/* <!-- Sign up  Link --> */}
          <div class="mt-6 text-gray-400">
            <span>Don’t have an account yet? </span>
            <a href="/register" class="text-white hover:underline">
              Sign up here
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

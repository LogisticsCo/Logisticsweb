function Signup() {
  return (
    <>
      {/* <!-- component --> */}
      <div class="bg-gray-800 flex justify-center items-center h-screen overflow-hidden">
        {/* <!-- Left: Image --> */}
        <div class="w-1/2 h-screen hidden lg:block">
          <img
            src="https://img.freepik.com/fotos-premium/imagen-fondo_910766-187.jpg?w=826"
            alt="Placeholder Image"
            class="object-cover w-full h-full"
          />
        </div>
        {/* <!-- Right: Login Form --> */}
        <div class="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
          <h1 class="text-2xl font-semibold mb-4 text-gray-300">
            Register here<span className="text-7xl text-blue-500">.</span>
          </h1>
          <form action="#" method="POST">
            {/* <!-- Username Input --> */}
            <div class="mb-4 bg-sky-100">
              <label for="username" class="block text-gray-500 mb-4">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                class="text-gray-900 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                autocomplete="off"
              />
            </div>
            {/* <!-- Password Input --> */}
            <div class="mb-4">
              <label for="password" class="block text-gray-500 mb-4">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                class="text-gray-900 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                autocomplete="off"
              />
            </div>
            {/* <!-- Repeat Password Input --> */}
            <div class="mb-4">
              <label for="password" class="block text-gray-500 mb-4">
                Repeat Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                class="text-gray-900 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                autocomplete="off"
              />
            </div>
            {/* <!-- Login Button --> */}
            <button
              type="submit"
              class="mt-10 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md py-2 px-4 w-full"
            >
              Register
            </button>
          </form>
          {/* <!-- Sign up  Link --> */}
          <div class="mt-6 text-gray-600">
            <span>Already have an account? </span>
            <a href="/login" class="text-white hover:underline">
              Sign in here
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;

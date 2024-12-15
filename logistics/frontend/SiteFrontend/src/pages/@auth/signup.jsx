import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    const data = {
      username,
      email,
      password,
    };

    try {
      const response = await fetch(
        "https://cklogisticsback.onrender.com/backend/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      console.log("Response Status:", response.status);
      console.log("Response Body:", result); // Log the full response

      if (response.ok) {
        alert("Registration successful");
        navigate("/login");
      } else {
        // Handle errors returned from the backend
        if (result.error) {
          setErrorMessage(result.error);
        } else if (result.message) {
          setErrorMessage(result.message);
        } else if (result.detail) {
          setErrorMessage(result.detail);
        } else {
          setErrorMessage("Registration failed. Please try again.");
        }
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <>
      {/* <!-- component --> */}
      <div class="bg-gray-900 flex justify-end items-center h-screen overflow-hidden relative">
        {/* <!-- Logo Text at the top left corner --> */}
        <div className="absolute top-4 left-4 text-white text-2xl font-bold z-10">
          CK Logistics
        </div>
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
            <form onSubmit={handleSubmit}>
              {/* <!-- Username Input --> */}
              <div class="mb-4">
                <label for="username" class="block text-gray-400 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  class="text-gray-100 w-full border border-gray-500 rounded-md py-2 px-3 bg-gray-700 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                  autocomplete="off"
                  placeholder="Enter your username"
                />
              </div>
              {/* <!-- email Input --> */}
              <div class="mb-4">
                <label for="email" class="block text-gray-400 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  class="text-gray-100 w-full border border-gray-500 rounded-md py-2 px-3 bg-gray-700 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your e-mail"
                />
              </div>
              {/* <!-- Password Input --> */}
              <div class="mb-4">
                <label for="password" class="block text-gray-400 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  class="text-gray-100 w-full border border-gray-500 rounded-md py-2 px-3 bg-gray-700 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                  autocomplete="off"
                  placeholder="Enter your password"
                />
              </div>
              {/* <!-- Repeat Password Input --> */}
              <div class="mb-4">
                <label for="password" class="block text-gray-400 mb-2">
                  Repeat Password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  name="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false); // State for Forgot Password modal
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState(""); // Message for forgot password status
  const [forgotError, setForgotError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        "https://cklogisticsco.onrender.com/backend/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const contentType = response.headers.get("Content-Type");
      const responseBody = await response.text();

      if (response.ok) {
        const { access, refresh } = JSON.parse(responseBody);
        localStorage.setItem("accessToken", access);
        localStorage.setItem("refreshToken", refresh);
        navigate("/dashboard");
      } else {
        let errorMessage = "Error logging in";
        if (contentType && contentType.includes("application/json")) {
          const result = JSON.parse(responseBody);
          errorMessage = result.error || errorMessage;
        }
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Error logging in");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotMessage("");
    setForgotError("");

    try {
      const response = await fetch(
        "https://cklogisticsco.onrender.com/backend/forgot-password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: forgotEmail }),
        }
      );

      if (response.ok) {
        setForgotMessage("A new password has been sent to your email.");
      } else {
        const result = await response.json();
        setForgotError(result.error || "Failed to reset password.");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setForgotError("Failed to reset password.");
    }
  };

  return (
    <>
      <div className="bg-gray-900 flex justify-end items-center h-screen overflow-hidden relative">
        {/* Background dim effect */}
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
        )}

        {/* Spinner during login */}
        {loading && (
          <div className="absolute z-20 flex justify-center items-center w-full h-full">
            <div className="w-16 h-16 border-4 border-t-blue-400 border-gray-200 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Logo Text at the top left corner */}
        <div className="absolute top-4 left-4 text-white text-2xl font-bold z-10">
          CK Logistics
        </div>

        {/* Truck Image covering the whole screen */}
        <img
          src="/bgtruck2.jpeg"
          alt="Truck Background"
          className="absolute inset-0 object-cover w-full h-full z-0"
        />

        {/* Form container with glassmorphic effect */}
        <div className="relative h-full w-full lg:w-1/2 bg-gray-800/50 backdrop-blur-lg z-10 flex justify-center items-center">
          <div className="p-8 lg:p-24 w-full">
            <h1 className="text-2xl font-semibold mb-4 text-gray-100">
              Login here<span className="text-7xl text-blue-400">.</span>
            </h1>
            <form onSubmit={handleSubmit}>
              {/* Username Input */}
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-400 mb-4">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="text-gray-100 w-full border border-gray-500 rounded-md py-2 px-3 bg-gray-700 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                  autoComplete="off"
                  placeholder="Enter your username"
                />
              </div>
              {/* Password Input */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-400 mb-4">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="text-gray-100 w-full border border-gray-500 rounded-md py-2 px-3 bg-gray-700 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                  autoComplete="off"
                  placeholder="Enter your password"
                />
              </div>
              <div className="flex justify-between items-center mb-6 text-sm md:text-base">
                {/* Remember Me Checkbox */}
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                  />
                  <label
                    htmlFor="remember"
                    className="ms-1 md:ms-2 font-medium text-gray-400"
                  >
                    Remember me
                  </label>
                </div>
                {/* Forgot Password Link */}
                <div className="text-blue-400">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
              {/* Login Button */}
              <button
                type="submit"
                className="mt-10 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md py-2 px-4 w-full transition duration-300 ease-in-out"
              >
                Login
              </button>
            </form>
            {/* Sign up Link */}
            <div className="mt-6 text-gray-400">
              <span>Don’t have an account yet? </span>
              <a href="/register" className="text-blue-400 hover:underline">
                Sign up here
              </a>
            </div>
            {/* Error Message */}
            {error && <p className="mt-4 text-red-500">{error}</p>}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
          <div className="bg-gray-800 p-6 rounded-lg w-1/3">
            <h2 className="text-white text-lg font-semibold mb-4">
              Reset Your Password
            </h2>
            <form onSubmit={handleForgotPasswordSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="forgot-email"
                  className="block text-gray-400 mb-2"
                >
                  Enter your registered email
                </label>
                <input
                  type="email"
                  id="forgot-email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="text-gray-100 w-full border border-gray-500 rounded-md py-2 px-3 bg-gray-700 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your email"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md py-2 px-4 w-full transition duration-300 ease-in-out"
              >
                Submit
              </button>
            </form>
            {forgotMessage && <p className="mt-4 text-green-500">{forgotMessage}</p>}
            {forgotError && <p className="mt-4 text-red-500">{forgotError}</p>}
            <button
              onClick={() => setShowForgotPassword(false)}
              className="mt-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-md py-2 px-4 w-full transition duration-300 ease-in-out"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;

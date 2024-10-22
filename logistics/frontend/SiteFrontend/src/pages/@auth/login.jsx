import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Submitted');

        try {
            console.log('Sending Request');
            const response = await fetch('https://cklogisticsco.onrender.com/backend/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            console.log('Response Status:', response.status);

            const contentType = response.headers.get('Content-Type');
            const responseBody = await response.text();

            if (response.ok) {
                const { access, refresh } = JSON.parse(responseBody);
                localStorage.setItem('accessToken', access);
                localStorage.setItem('refreshToken', refresh);
                navigate('/dashboard'); 
            } else {
                let errorMessage = 'Error logging in';

                if (contentType && contentType.includes('application/json')) {
                    const result = JSON.parse(responseBody);
                    errorMessage = result.error || errorMessage;
                }

                setError(errorMessage);
            }
        } catch (err) {
            console.error('Fetch Error:', err);
            setError('Error logging in');
        }
    };
  return (
    <>
      {/* <!-- component --> */}
      <div className="bg-gray-900 flex justify-end items-center h-screen overflow-hidden relative">
        {/* <!-- Logo Text at the top left corner --> */}
        <div className="absolute top-4 left-4 text-white text-2xl font-bold z-10">
          CK Logistics
        </div>

        {/* <!-- Truck Image covering the whole screen --> */}
        <img
          src="/bgtruck2.jpeg"
          alt="Truck Background"
          className="absolute inset-0 object-cover w-full h-full z-0"
        />

        {/* <!-- Form container with glassmorphic effect, covering right half of the screen --> */}
        <div className="relative h-full w-full lg:w-1/2 bg-gray-800/50 backdrop-blur-lg z-10 flex justify-center items-center">
          <div className="p-8 lg:p-24 w-full">
            <h1 className="text-2xl font-semibold mb-4 text-gray-100">
              Login here<span className="text-7xl text-blue-400">.</span>
            </h1>
            <form onSubmit={handleSubmit} >
              {/* <!-- Username Input --> */}
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
              {/* <!-- Password Input --> */}
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
                {/* <!-- Remember Me Checkbox --> */}
                <div className="flex items-center">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      checked
                      type="checkbox"
                      value=""
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                      required
                    />
                  </div>
                  <label
                    htmlFor="remember"
                    className="ms-1 md:ms-2 font-medium text-gray-400"
                  >
                    Remember me
                  </label>
                </div>
                {/* <!-- Forgot Password Link --> */}
                <div className="text-blue-400">
                  <a href="#" className="hover:underline">
                    Forgot Password?
                  </a>
                </div>
              </div>
              {/* <!-- Login Button --> */}
              <button
                type="submit"
                className="mt-10 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md py-2 px-4 w-full transition duration-300 ease-in-out"
              >
                Login
              </button>
            </form>
            {/* <!-- Sign up Link --> */}
            <div className="mt-6 text-gray-400">
              <span>Don’t have an account yet? </span>
              <a href="/register" className="text-blue-400 hover:underline">
                Sign up here
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

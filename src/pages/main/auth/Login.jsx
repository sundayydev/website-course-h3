import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Đăng nhập với:', { username, password, rememberMe });
  };

  return (
    <div className="bg-sky-100 flex justify-center items-center min-h-screen">
      {/* Login Form (Centered) */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-6 text-center text-pink-500">Login</h1>
        <form>
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autoComplete="off"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label className="block text-gray-800">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              autoComplete="off"
            />
          </div>

          {/* Remember Me Checkbox */}
          <div className="mb-4 flex items-center">
            <input type="checkbox" id="remember" className="mr-2" />
            <label htmlFor="remember" className="text-gray-900">
              Remember Me
            </label>
          </div>

          {/* Forgot Password Link */}
          <div className="mb-6 text-right">
            <a href="#" className="text-blue-500 hover:text-red-500 transition duration-300">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="button"
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-md py-2 px-4 w-full transition duration-300"
          >
            Login
          </button>
        </form>

        {/* OR Divider */}
        <div className="my-6 text-center text-gray-500">OR</div>

        {/* Google & Facebook Login */}
        <div className="flex flex-col gap-4">
          <button
            type="button"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-md py-2 px-4 w-full flex items-center justify-center transition duration-300"
          >
            <FcGoogle className="w-6 h-6 mr-2" />
            Continue with Google
          </button>

          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full flex items-center justify-center transition duration-300"
          >
            <FaFacebook className="w-6 h-6 mr-2" />
            Continue with Facebook
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <a href="#" className="text-blue-500 hover:text-green-500 transition duration-300">
            Sign up Here
          </a>
        </div>
      </div>
    </div>
  );
}

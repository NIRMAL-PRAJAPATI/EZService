import React, { useState } from 'react';
import { Mail, Lock, LogIn, UserPlus, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../config/axios-config'; 

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    api.post('/provider/login', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      console.log('Login successful:', response.data);

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.provider))
      navigate('/provider/dashboard')
    }).catch((error) => {
      alert('Login error:', error.response.data.message);
      console.error(error);
    });

    console.log('Login data:', formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-center mb-6">Login as Provider</h2>
        <form onSubmit={handleSubmit} className="space-y-2">

          {/* Email */}
          <div>
            <label className="block text-indigo-600 tracking-wide">Email</label>
            <div className="flex items-center border border-gray-300 hover:border-indigo-500 rounded-sm px-3 py-3">
              <Mail className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="user@example.com"
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-indigo-600 tracking-wide">Password</label>
            <div className="flex items-center border border-gray-300 hover:border-indigo-500 rounded-sm px-3 py-3">
              <Lock className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="User@123"
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full flex items-center mt-4 justify-center gap-2 bg-indigo-500 text-white py-3 rounded-sm hover:bg-indigo-600 transition"
          >Login
            <LogIn className="w-4 h-4 mt-0.5" />
          </button>
        </form>

        {/* Divider */}
        <div className="my-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">OR</span>
            </div>
          </div>
        </div>

        {/* Sign in as Provider */}
        {/* <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
          >
            <User className="w-4 h-4" />
            Sign in as Customer
          </Link>
        </div> */}

        {/* Link to Register */}
        <p className="mt-2 text-center tracking-wide text-sm text-gray-600 flex justify-center gap-1">
          Don't have an account?{' '}
          <Link
            to="/provider/register"
            className="text-blue-600 hover:underline flex items-center justify-center gap-1"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

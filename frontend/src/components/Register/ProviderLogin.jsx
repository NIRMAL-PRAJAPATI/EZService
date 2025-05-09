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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <div className="flex items-center border rounded-md px-3 py-2">
              <Mail className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <div className="flex items-center border rounded-md px-3 py-2">
              <Lock className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full outline-none"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            <LogIn className="w-4 h-4" />
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="my-4 text-center text-gray-500 text-sm">or</div>

        {/* Sign in as Provider */}
        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
          >
            <User className="w-4 h-4" />
            Sign in as Customer
          </Link>
        </div>

        {/* Link to Register */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/provider/register"
            className="text-blue-600 hover:underline flex items-center justify-center gap-1"
          >
            <UserPlus className="w-4 h-4" />
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

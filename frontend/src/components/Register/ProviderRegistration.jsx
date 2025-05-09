import React, { useState } from 'react';
import {
  User, Mail, Phone, Lock, MapPin, ArrowLeft, ArrowRight,
  Check, BriefcaseBusiness, Car, Dumbbell, LibraryBig,
  PartyPopper, Plug, ScanHeart, Wrench,
  Home
} from 'lucide-react';
import { Link } from 'react-router-dom';

const RegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    confirmpassword: '',
    address: '',
    city: '',
    state: '',
    country: ''
  });
  const [errors, setErrors] = useState({});

  const steps = ['fullname', 'email', 'phone', 'password', 'address'];
  const totalSteps = steps.length;

  const validateStep = () => {
    const field = steps[currentStep];
    const value = formData[field];
    let error = '';

    switch (field) {
      case 'fullname':
        error = value.trim().length >= 3 ? '' : 'Enter at least 3 characters';
        break;
      case 'email':
        error = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email';
        break;
      case 'phone':
        error = /^\+?[0-9]{10,15}$/.test(value) ? '' : 'Invalid phone';
        break;
      case 'password':
        error = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(value)
          ? '' : 'Must be 8+ chars, include number & special char';
        if (formData.password !== formData.confirmpassword) {
          error = 'Passwords do not match';
        }
        break;
      case 'address':
        error = formData.address ? '' : 'Address is required';
        break;
      default:
        break;
    }

    setErrors({ ...errors, [field]: error });
    return !error;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const renderStep = () => {
    switch (steps[currentStep]) {
      case 'fullname':
        return (
          <>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <User className="w-5 h-5" /> Full Name
            </label>
            <input
              id="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              placeholder="Your name"
            />
            {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname}</p>}
          </>
        );
      case 'email':
        return (
          <>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Mail className="w-5 h-5" /> Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              placeholder="Email address"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </>
        );
      case 'phone':
        return (
          <>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Phone className="w-5 h-5" /> Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              placeholder="Phone number"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </>
        );
      case 'password':
        return (
          <>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Lock className="w-5 h-5" /> Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              placeholder="Password"
            />
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mt-4">
              <Lock className="w-5 h-5" /> Confirm Password
            </label>
            <input
              id="confirmpassword"
              type="password"
              value={formData.confirmpassword}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              placeholder="Confirm Password"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </>
        );
      case 'address':
        return (
          <>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <MapPin className="w-5 h-5" /> Address
            </label>
            <textarea
              id="address"
              rows="3"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              placeholder="Street address"
            />
            <div className="grid grid-cols-3 gap-4 mt-4">
              {['city', 'state', 'country'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
                  <input
                    id={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-md"
                    placeholder={field}
                  />
                </div>
              ))}
            </div>
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      {/* Decorative Icons */}
      <div className="text-gray-300 absolute inset-0 -z-10 overflow-hidden">
        <Plug className="absolute top-24 left-60 rotate-[330deg]" />
        <LibraryBig className="absolute top-[30vh] right-20" />
        <Car className="absolute top-[50vh] left-[30vw] rotate-[330deg]" />
        <Wrench className="absolute top-[80vh] right-60 rotate-[10deg]" />
        <BriefcaseBusiness className="absolute top-24 right-[25vw] rotate-[330deg]" />
        <Dumbbell className="absolute top-[90vh] left-20 rotate-[330deg]" />
        <ScanHeart className="absolute top-[35vh] left-10 rotate-[330deg]" />
        <PartyPopper className="absolute top-[40vh] right-[35%] rotate-[330deg]" />
      </div>

      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg z-10">
        <h2 className="text-3xl font-bold text-center mb-6">Create Your Account</h2>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2 rounded mb-6 overflow-hidden">
          <div
            className="bg-blue-600 h-2 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          ></div>
        </div>

        {/* Form Step */}
        <form className="space-y-4">
          {renderStep()}
        </form>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {currentStep > 0 ? (
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < totalSteps - 1 ? (
            <button
              onClick={handleNext}
              className="ml-auto flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => alert('Registration complete!')}
              className="ml-auto flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Complete
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
        {/* Provider Sign-in Button */}
          <div className="mt-6 text-center">
            <Link
              to="/provider/login"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
            >
              <User className="w-4 h-4" />
              Sign in as Provider
            </Link>
          </div>
          
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
          </div>

      </div>
    </div>
  );
};

export default RegistrationForm;

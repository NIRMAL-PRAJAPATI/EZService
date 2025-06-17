import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../config/axios-config';

function MobileVarification() {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();

  const location = useLocation();
  const { formData } = location.state || {};
  const [formDataState, setFormDataState] = useState(formData || {});
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [OTPTimer, setOTPTimer] = useState(30);
  const [isCounting, setIsCounting] = useState(false);
  const [buttonText, setButtonText] = useState("Get OTP");

  const [isOTPVerified, setIsOTPVerified] = useState(false);

  // Timer for OTP
  useEffect(() => {
    let interval;
    if (isCounting && OTPTimer > 0) {
      interval = setInterval(() => {
        setOTPTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsCounting(false);
            setButtonText("Resend OTP");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCounting, OTPTimer]);

  const handleChange = (e) => {
    const updatedMobile = e.target.value;
    setFormDataState(prev => ({
      ...prev,
      mobile: updatedMobile,
    }));
  };
      console.log(formDataState);

  const sendOTP = async () => {
    try {
      console.log(formDataState.mobile);
      const existanceCheck = await api.post('customer/existancecheck', {mobile:  formDataState.mobile });

      if(existanceCheck) {
      await api.post(`/otp/send-otp`, { phone: `+91${formDataState.mobile}` });
      setOTPTimer(30);
      setIsCounting(true);
      }
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.response?.data?.errorMessage || "Failed to send OTP.");
    }
  };

  const verifyOTP = async (data) => {
    try {
      await api.post(`/otp/verify-otp`, {
        phone: `+91${formDataState.mobile}`,
        code: data.otp
      });
      setIsOTPVerified(true);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.response?.data?.errorMessage || "OTP verification failed.");
    }
  };

  const registerUser = async (data) => {
    try {
      const registrationData = {
        ...formDataState,
        password: data.password,
        confirmpassword: data.confirmpassword
      };

      console.log(registrationData);
      console.log(formDataState.mobile + data.password);
      await api.post(`/customer/register`, registrationData);
      const loginResponse = await api.post('/customer/login', {
        mobile: formDataState.mobile,
        password: data.password
      });

      console.log(loginResponse);

      localStorage.setItem('token', loginResponse.data.token);
      const location = loginResponse.data.data.city + ", " + loginResponse.data.data.state + ", " + loginResponse.data.data.country + ", " + loginResponse.data.data.pincode;
      localStorage.setItem('location', location);

      navigate('/');
    } catch (error) {
      setErrorMessage(error.response?.data?.errorMessage || "Registration failed.");
    }
  };

  // Decide which action to perform on submit
  const onSubmit = (data) => {
    if (!isOTPVerified) {
      verifyOTP(data);
    } else {
      registerUser(data);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-5">
        <h1 className="text-3xl font-extrabold text-center mb-8">Mobile Verification</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Mobile Number */}
          <div className="mb-4 relative">
            <label className="absolute left-3 -top-3 bg-white px-1 text-sm font-medium text-indigo-500">Mobile No.</label>
            <input
              type="text"
              name="mobile"
              value={formDataState.mobile}
              onChange={handleChange}
              className="block w-full pl-4 pr-3 py-3 text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* OTP and Button */}
          <div className="grid grid-cols-3 gap-2">
            <div className="mb-4 relative col-span-2">
              <label className="absolute left-3 -top-3 bg-white px-1 text-sm font-medium text-indigo-500">Enter OTP</label>
              <input
                type="number"
                name="otp"
                {...register("otp", { required: "OTP is required" })}
                className="block w-full pl-4 pr-3 py-3 text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="button"
              className={`border-none rounded-sm h-12 cursor-pointer ${isCounting ? "bg-indigo-100 text-dark" : "text-white bg-indigo-500 hover:bg-indigo-600"}`}
              onClick={isCounting ? null : sendOTP}
              disabled={isCounting}
            >
              {isCounting ? `00 : ${OTPTimer}` : buttonText}
            </button>
          </div>

          <p className="text-red-600 -mt-2 mb-1 text-sm">{errorMessage}</p>

          {/* Password Section */}
          {isOTPVerified && (
            <div id="passwordSetter">
              <p className="my-3 text-gray-500 text-sm">Set profile password</p>

              <div className="mb-4 relative">
                <label className="absolute left-3 -top-3 bg-white px-1 text-sm font-medium text-indigo-500">Password</label>
                <input
                  type="password"
                  name="password"
                  className="block w-full pl-4 pr-3 py-3 text-lg md:text-sm text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                      message: "Password must be strong (8+ characters, one special char, uppercase, number)"
                    }
                  })}
                />
                {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
              </div>

              <div className="mb-4 relative">
                <label className="absolute left-3 -top-3 bg-white px-1 text-sm font-medium text-indigo-500">Confirm Password</label>
                <input
                  type="password"
                  name="confirmpassword"
                  className="block w-full pl-4 pr-3 py-3 text-lg md:text-sm text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  {...register("confirmpassword", {
                    required: "Confirm Password is required",
                    validate: value => value === watch('password') || "Passwords do not match"
                  })}
                />
                {errors.confirmpassword && <p className="text-red-600 text-sm">{errors.confirmpassword.message}</p>}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-3 px-4 rounded-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isOTPVerified ? "Register" : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MobileVarification;

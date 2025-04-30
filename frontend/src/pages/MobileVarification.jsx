import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

 function MobileVarification() {
  const { handleSubmit } = useForm();

  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");

  const { formData } = location.state || {};
  console.log(formData);
  const navigate = useNavigate();

  const api = "http://localhost:3000";

  const [OTPTimer, setOTPTimer] = useState(6);
  const [isCounting, setIsCounting] = useState(false);
  const [buttonText, setButtonText] = useState("send OTP");

  useEffect(() => {
    let interval;

    if (isCounting && OTPTimer > 0) {
      interval = setInterval(() => {
        setOTPTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsCounting(false);
            setButtonText("resend OTP")
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCounting, OTPTimer]);

  const sendOTP = async () => {
    setOTPTimer(6)
    setIsCounting(true);
  }

  const onRegister = async () => {
    await axios.post(`${api}/customer/register`, formData).then(response => {
      navigate('/');
    }).catch((error) => {
      if(error.response) {
        setErrorMessage(error.response.data.errorMessage);
      } else {
        setErrorMessage("");
      }
    })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-5">
      <h1 className="text-3xl font-extrabold text-center mb-8">Mobile Varification</h1>

<form onSubmit={handleSubmit(onRegister)}>
  <div className="mb-4 relative">
    <label className="absolute left-3 -top-3 bg-white px-1 text-sm font-medium text-indigo-500">Mobile No.</label>
    <input
      type="mobile"
      name="mobile"
      value={formData.mobile}
      className="block w-full pl-4 pr-3 py-3 text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
  <div className="grid grid-cols-3 gap-2">
  <div className="mb-4 relative col-span-2">
    <label className="absolute left-3 -top-3 bg-white px-1 text-sm font-medium text-indigo-500">Enter OTP</label>
    <input
      type="mobile"
      name="mobile"
      className="block w-full pl-4 pr-3 py-3 text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
  <button type="button" className="border-none text-white rounded-sm h-12 bg-indigo-500 hover:bg-indigo-600" onClick={handleSubmit(sendOTP)}>{isCounting ? `0 : `+OTPTimer : buttonText}</button>
  </div>
  <p className="text-red-600 -mt-2 mb-1 text-sm">{errorMessage}</p>
  <button
    type="submit"
    className="w-full bg-indigo-500 text-white py-3 px-4 rounded-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Verify</button>
</form>

{/* <div className="mt-4 text-center">
  <p className="text-sm">
    Already have an account?{" "}
    <a href="/login" className="text-indigo-500 hover:text-indigo-600">
      Log in
    </a>
  </p>
</div> */}
        </div>
        </div>
  )
}

export default MobileVarification;
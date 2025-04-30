import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

 function MobileVarification() {
  const { handleSubmit, register } = useForm();

  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");

  const { formData } = location.state || {};
  const navigate = useNavigate();

  const api = "http://localhost:3000";

  const [OTPTimer, setOTPTimer] = useState(20);
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
    console.log("i am running" + formData.mobile)
    await axios.post(`${api}/otp/send-otp`, {phone: `+91${formData.mobile}`}).then(response => {
    setOTPTimer(20)
    setIsCounting(true);
    console.log("i am running")
    }).catch((error) => {
    console.log("i am running")
      setErrorMessage(error.response.data.errorMessage)
    })
  }

  const verifyOTP = async (data) => {
    console.log(formData.mobile + data.otp)
    await axios.post(`${api}/otp/verify-otp`, {
      phone: `+91${formData.mobile}`,
      code: data.otp
    }).then(response => {
      console.log("verified")
      axios.post(`${api}/customer/register`, formData).then(response => {
        console.log("registered")
        navigate('/');
      }).catch((error) => {
        if(error.response) {
          console.log("problem in register");
          setErrorMessage(error.response.data.errorMessage);
        } else {
          setErrorMessage("");
        }
      })
    }).catch((error) => {
      console.log("problem in verification")
      setErrorMessage(error.response.data.errorMessage);
    })
  }
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-5">
      <h1 className="text-3xl font-extrabold text-center mb-8">Mobile Varification</h1>

<form onSubmit={handleSubmit(verifyOTP)}>
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
      type="number"
      name="otp"
      {...register("otp", {required: "OTP is required"})}
      className="block w-full pl-4 pr-3 py-3 text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
  <button type="button" className="border-none text-white rounded-sm h-12 bg-indigo-500 hover:bg-indigo-600" onClick={sendOTP}>{isCounting ? `0 : `+OTPTimer : buttonText}</button>
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
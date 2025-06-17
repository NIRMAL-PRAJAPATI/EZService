import axios, { formToJSON } from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../config/axios-config'

function MobileVarification() {
  const { handleSubmit, register, setValue } = useForm();

  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");

  const { formData } = location.state || {};
  
const [formDataState, setFormDataState] = useState(formData || {});
  const navigate = useNavigate();

  // fetch("https://ipapi.co/json/")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data.city)
  //     })
  //     .catch((err) => console.error("IP fetch error:", err));

  const handleChange = (e) => {
  const updatedMobile = e.target.value;

  setFormDataState((prev) => ({
    ...prev,
    mobile: updatedMobile,
  }));
};

  const [OTPTimer, setOTPTimer] = useState(30);
  const [isCounting, setIsCounting] = useState(false);
  const [buttonText, setButtonText] = useState("Get OTP");

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
    console.log("i am running" + formDataState.mobile)
    await api.post(`/otp/send-otp`, { phone: `+91${formDataState.mobile}` }).then(response => {
      setOTPTimer(20)
      setIsCounting(true);
      console.log("i am running")
    }).catch((error) => {
      console.log("i am running")
      setErrorMessage(error.response.data.errorMessage)
    })
  }

  const verifyOTP = async (data) => {
    console.log(formDataState.mobile + data.otp + " password is : " +formDataState.password)
    await api.post(`/otp/verify-otp`, {
      phone: `+91${formDataState.mobile}`,
      code: data.otp
    }).then(response => {
      console.log("verified")
      api.post(`/customer/register`, formDataState).then(response => {
        console.log("registered")
        api.post('/customer/login', {mobile: formDataState.mobile, password: formDataState.password}, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then((response) => {
                    console.log("success login", response.data);
                    localStorage.setItem('token', response.data.token)
                    const location = response.data.data.city + ", " + response.data.data.state + ", " + response.data.data.country + ", " + response.data.data.pincode;
                    localStorage.setItem('location', location)
                    navigate('/')
                }).catch((error) => {
                    console.error(error);
                    setErrorMessage(error.response.data.message);
        
                });
      }).catch((error) => {
        if (error.response) {
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
              value={formDataState.mobile}
              onChange={handleChange}
              className="block w-full pl-4 pr-3 py-3 text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
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
            <button type="button" className={`border-none rounded-sm h-12 cursor-pointer ${isCounting ? "bg-indigo-100 text-dark" : "text-white bg-indigo-500 hover:bg-indigo-600"}`} onClick={isCounting ? null : sendOTP} disabled={isCounting}>{isCounting ? `00 : ` + OTPTimer : buttonText}</button>
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
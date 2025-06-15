import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function LRAlert() {
  const [tokenCheck, setTokenCheck] = useState(false);
  useEffect(() => {
      const token = localStorage.getItem("token");
      setTokenCheck(token);
    }, []);
  return (
    <section className="bg-white text-black">
      {!tokenCheck ?
      (<div className="py-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          Ready to Get Started?
        </h2>
        <p className="text-md mb-5 text-gray-700">
          Join thousands of satisfied customers and service providers on our
          platform
        </p>
        <div className="flex  gap-1 justify-center tracking-wide">
          <Link to="/login" className='px-5 py-2 sm:px-8 bg-indigo-500 text-white border font-medium rounded-sm hover:bg-indigo-500/90'>
            LogIn
          </Link>
          <Link to="/register" className="px-5 py-2 sm:px-8 bg-transparent border-2 border-indigo-500 text-indigo-500 font-medium rounded-sm hover:bg-gray-200/50">
            Register
          </Link>
        </div>
      </div>) : (<div></div>)}
    </section>
  )
}

export default LRAlert
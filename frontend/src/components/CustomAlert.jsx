import React from 'react';

const AlertPage = ({ title, description, buttonText, status, onClose }) => {
    console.log(status);

  return (
    <div className={`w-full h-full left-0 fixed top-0 z-100 bg-white/30 flex items-center ${!status ? "hidden" : "block"}`}>
        <div className='mx-auto bg-gray-100 p-5 sm:px-10 sm:py-7 shadow-md'>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-800">{description}</p>
      <button onClick={onClose} className='px-5 border py-1 text-lg mt-5 rounded-sm bg-indigo-500 text-white cursor-pointer'>{buttonText}</button>
      </div>
    </div>
  );
};

export default AlertPage;

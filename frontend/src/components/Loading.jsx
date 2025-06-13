import React from "react";
import resources from "../resource";

const Loading = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <style>{`
        @keyframes pulseAndSpin {
          10% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          40% {
            transform: scale(1.5) rotate(180deg);
            opacity: 0;
          }
          100% {
            transform: scale(1) rotate(360deg);
            opacity: 1;
          }
        }
        .loading-animation {
          animation: pulseAndSpin 1.5s infinite ease-in-out;
        }
      `}</style>

      <img
        src={resources.Logo.src}
        alt="Loading logo"
        className="w-12 h-12 loading-animation"
      />

      <p className="mt-1 text-gray-700 tracking-wide font-medium text-sm font-sans">
        Loading...
      </p>
    </div>
  );
};

export default Loading;

import React from "react";

export default function ProfileNav() {
  return (
    <div className="bg-white px-5 mb-5 py-3 rounded-sm overflow-x-scroll sm:overflow-x-hidden flex gap-2">
      <p>
        <a href="#" className="text-gray-600 hover:text-primary mr-2">
          profile
        </a>
        /
      </p>
      <p>
        <a href="/"
          className="text-gray-600 hover:text-primary mr-2"
        >order
        </a>
        /
      </p>
      <p>
        <a href="#" className="text-gray-600 hover:text-primary mr-2">
          notification
        </a>
        /
      </p>
      <p>
        <a href="/"
          className="text-gray-600 hover:text-primary mr-2"
        >complaint
        </a>
        /
      </p>
    </div>
  );
}

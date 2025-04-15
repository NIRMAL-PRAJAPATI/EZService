import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp , UserRound , AlignRight} from "lucide-react";
import resources from "../resource";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-white shadow-sm top-0 left-0 w-full z-50">
      <div className="mx-auto py-3 px-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <img
              src={resources.Logo.src}
              className="h-6 w-6 mr-2"
              alt="Logo"
            />
            <span className="font-bold text-xl">EZService</span>
          </div>

          {/* Hamburger Icon */}
          <AlignRight className="md:hidden h-8 w-8 text-gray-800 hover:text-primary cursor-pointer" onClick={toggleMenu} id="navMenuBtn"/>

          {/* Navigation Menu */}
          <div
            id="navMenuDiv"
            className={`md:flex items-center justify-between absolute md:w-full md:relative z-10 top-14 md:top-0 w-[70vw] sm:w-[50vw] ${
              menuOpen ? "right-0" : "right-[100vw]"
            } md:right-0 bg-white text-left md:bg-transparent p-6 md:p-0 z-20 border md:border-none transition-all duration-300`}
          >
            <div></div>
            {/* Links */}
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 tracking-wide md:space-y-0">
              <a href="/" className="text-primary">
                Home
              </a>
              <a
                href="/explore"
                className="text-gray-600 hover:text-indigo-400"
              >
                Explore
              </a>
              <a
                href="/services"
                className="text-gray-600 hover:text-indigo-400"
              >
                Services
              </a>

              {/* Templates Dropdown */}
              <div
                id="templateNavBtn"
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <a className="text-gray-600 hover:text-indigo-400 flex items-center cursor-pointer">
                  Templates
                  {dropdownOpen ? (
                    <ChevronUp className="h-5 w-5 ml-2 mt-[2px] transition duration-150" />
                  ) : (
                    <ChevronDown className="h-5 w-5 ml-2 mt-[2px] transition duration-150" />
                  )}
                </a>

                <ul
                  id="templateContainer"
                  className={`px-5 w-max py-3 absolute bg-white space-y-2 text-gray-600 -ml-10 pt-4 ${
                    dropdownOpen ? "block" : "hidden"
                  }`}
                >
                  <li className="hover:text-indigo-400 cursor-pointer">
                    Home Renovation
                  </li>
                  <li className="hover:text-indigo-400 cursor-pointer">
                    Wedding Requisites
                  </li>
                  <li className="hover:text-indigo-400 cursor-pointer">
                    Home Appliances
                  </li>
                  <li className="hover:text-indigo-400 cursor-pointer">
                    Beauty & Spa
                  </li>
                  <li className="hover:text-indigo-400 cursor-pointer">
                    Party Things
                  </li>
                </ul>
              </div>

              <a
                href="service_ranking.html"
                className="text-gray-600 hover:text-indigo-400"
              >
                Ranking
              </a>
              <a
                href="complaint.html"
                className="text-gray-600 hover:text-indigo-400"
              >
                Complaint
              </a>
              <Link
                to="/about"
                className="text-gray-600 hover:text-indigo-400"
              >
                About
              </Link>
            </div>

            {/* Account Button */}
            <div className="flex md:space-x-1 mt-4 md:mt-0">
              <a
                href="/profile"
                className="px-4 py-2 bg-indigo-500 text-white  hover:bg-indigo-500/90 rounded flex"
              >
                <UserRound className="h-5 w-5 mt-[2px] transition duration-150" />
                Account
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

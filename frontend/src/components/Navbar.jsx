import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp , UserRound , AlignRight, LucideShoppingCart, LucideShoppingBag} from "lucide-react";
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
    <nav className="bg-white shadow-sm top-0 left-0 w-full z-50 text-black border-none">
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
            } md:right-0 bg-white text-left md:bg-transparent p-6 md:p-0 z-20 border-none transition-all duration-100`}
          >
            <div></div>
            {/* Links */}
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 tracking-wide md:space-y-0">
              <Link to="/" className="text-indigo-600 font-semibold">
                Home
              </Link>
              <Link
                to="/explore"
                className="text-gray-600 hover:text-black"
              >
                Explore
              </Link>
              <Link
                to="/services"
                className="text-gray-600 hover:text-black"
              >
                Services
              </Link>

              {/* Templates Dropdown */}
              <div
                id="templateNavBtn"
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <Link className="text-gray-600 hover:text-black flex items-center cursor-pointer">
                  Templates
                  {dropdownOpen ? (
                    <ChevronUp className="h-5 w-5 mt-[2px] transition duration-150" />
                  ) : (
                    <ChevronDown className="h-5 w-5 mt-[2px] transition duration-150" />
                  )}
                </Link>

                <ul
                  id="templateContainer"
                  className={`px-5 w-max py-3 absolute bg-white space-y-2 text-gray-600 -ml-10 pt-4 ${
                    dropdownOpen ? "block" : "hidden"
                  }`}
                >
                  <li className="hover:text-black cursor-pointer">
                    Home Renovation
                  </li>
                  <li className="hover:text-black cursor-pointer">
                    Wedding Requisites
                  </li>
                  <li className="hover:text-black cursor-pointer">
                    Home Appliances
                  </li>
                  <li className="hover:text-black cursor-pointer">
                    Beauty & Spa
                  </li>
                  <li className="hover:text-black cursor-pointer">
                    Party Things
                  </li>
                </ul>
              </div>

              <Link
                to="/rankings"
                className="text-gray-600 hover:text-black"
              >
                Ranking
              </Link>
              <Link
              
                to="/complaint"
                className="text-gray-600 hover:text-black"
              >
                Complaint
              </Link>
              <Link
                to="/about"
                className="text-gray-600 hover:text-black"
              >
                About
              </Link>
            </div>

            {/* Account Button */}
            <div className="flex md:space-x-1 mt-4 md:mt-0">
            <Link
                to="/profile"
                className="p-2 text-gray-700"
              >
                <LucideShoppingBag className="h-5 w-5 transition duration-150" />
              </Link>
              <Link
                to="/profile"
                className="p-2 text-gray-700"
              >
                <UserRound className="h-5 w-5 transition duration-150" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

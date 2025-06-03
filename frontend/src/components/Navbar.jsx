import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp , UserRound , AlignRight, LucideShoppingCart, LucideShoppingBag, Heart, Search, X, SearchIcon, ArrowUpRightFromCircle} from "lucide-react";
import resources from "../resource";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchBoxOpen, setSearchBoxOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const toggleSearchBox = () => {
    setSearchBoxOpen(!searchBoxOpen);
    console.log("hdfvh")
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-white shadow-sm top-0 left-0 w-full z-50 text-black border-b border-gray-200">
      <div className="mx-auto py-2 px-4">
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
            className={`md:flex items-center justify-between absolute md:w-full md:relative z-10 top-14 md:top-0 w-[70vw] sm:w-[50vw] ${
              menuOpen ? "right-0" : "right-[100vw]"
            } md:right-0 bg-white text-left md:bg-transparent p-6 md:p-0 z-20 border-none transition-all duration-100`}
          >
            <div></div>
            {/* Links */}
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 tracking-wide md:space-y-0">
              <Link onClick={toggleMenu} to="/" className="text-indigo-600 font-semibold">
                Home
              </Link>
              <Link onClick={toggleMenu}
                to="/explore"
                className="text-gray-600 hover:text-black"
              >
                Explore
              </Link>
              <Link onClick={toggleMenu}
                to="/services"
                className="text-gray-600 hover:text-black"
              >
                Services
              </Link>

              {/* Templates Dropdown */}
              <div
                id="templateNavBtn"
                className="relative"
                onClick={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <Link className="text-gray-600 hover:text-black flex items-center cursor-pointer" to="/templates">
                  Templates
                  {/* {dropdownOpen ? (
                    <ChevronUp className="h-5 w-5 mt-[2px] transition duration-150" />
                  ) : (
                    <ChevronDown className="h-5 w-5 mt-[2px] transition duration-150" />
                  )} */}
                </Link>

                {/* <ul
                  className={`px-5 w-max py-3 absolute bg-white space-y-2 text-gray-600 -ml-10 pt-4 ${
                    dropdownOpen ? "block" : "hidden"
                  }`}
                >
                  <li><Link className="hover:text-black cursor-pointer" to="/errorpage" onClick={toggleMenu}>
                    Home Renovation
                  </Link></li>
                  <li><Link className="hover:text-black cursor-pointer" to="/errorpage" onClick={toggleMenu}>
                    Wedding Requisites
                  </Link></li>
                  <li><Link className="hover:text-black cursor-pointer" to="/errorpage" onClick={toggleMenu}>
                    Home Appliances
                  </Link></li>
                  <li><Link className="hover:text-black cursor-pointer" to="/errorpage" onClick={toggleMenu}>
                    Beauty & Spa
                  </Link></li>
                  <li><Link className="hover:text-black cursor-pointer" to="/errorpage" onClick={toggleMenu}>
                    Party Things
                  </Link></li>
                </ul> */}
              </div>
              <Link onClick={toggleMenu}
                to="/rankings"
                className="text-gray-600 hover:text-black"
              >
                Rankings
              </Link>
              {/* <Link onClick={toggleMenu}
                to="/complaint"
                className="text-gray-600 hover:text-black"
              >
                Complaint
              </Link> */}
              {/* <Link onClick={toggleMenu}
                to="/about"
                className="text-gray-600 hover:text-black"
              >
                About
              </Link> */}
            </div>

            {/* Account Button */}
            <div className="flex md:space-x-1 mt-4 md:mt-0">
              <Link onClick={toggleSearchBox}
                className="py-2 px-4 text-gray-700 border border-gray-300 rounded flex"
              >
                <Search className="h-5 w-5 transition duration-150" />
                <span className="-mt-0.5 ml-1">Search</span>
              </Link>
            {/* <Link onClick={toggleMenu}
                to="/order"
                className="p-2 text-gray-700"
              >
                <Heart className="h-5 w-5 transition duration-150" />
              </Link> */}
            <Link onClick={toggleMenu}
                to="/order"
                className="px-2 pt-2.5 text-gray-700"
              >
                <LucideShoppingBag className="h-5 w-5 transition duration-150" />
              </Link>
              <Link onClick={toggleMenu}
                to="/profile"
                className="px-2 pt-2.5 text-gray-700"
              >
                <UserRound className="h-5 w-5 transition duration-150" />
              </Link>
            </div>
          </div>
        </div>

        {/* searchBox */}
        <div className={`h-full w-full bg-black/50 fixed top-0 flex justify-center left-0 md:p-5 z-20 ${searchBoxOpen ? `block` : `hidden`}`}>
          <div className="max-w-7xl grid grid-cols-7 bg-white h-full w-full shadow-lg">
            {/* recomandation box */}
            <div className="hidden sm:block col-span-2 bg-gray-100 p-5 space-y-3 overflow-y-scroll h-full relative">
              <div className="gap-1 flex flex-wrap">
            <button
            type="submit"
            className="flex cursor-pointer text-sm py-1.5 px-3 bg-white rounded-sm hover:border-indigo-500 border border-gray-200 truncate"            
            >Plumber</button>
              </div>

              <hr className="text-gray-300"></hr>

              <div className="gap-1 flex flex-wrap">
                <button
            type="submit"
            className="flex cursor-pointer text-sm py-1.5 px-3 bg-white rounded-sm hover:border-indigo-500 border border-gray-200 truncate"            
            >Ananta Services</button>
              </div>
            </div>
            {/* search container */}
            <div className="col-span-7 sm:col-span-5 p-1">
              <X className="ml-auto align-right m-1 border rounded-xs border-gray-500 cursor-pointer" onClick={toggleSearchBox}></X>
              <div className="px-2 mx-auto text-black">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Search for services . . ."
                                className="w-full px-4 py-2 bg-transparent border border-gray-400 text-gray-800 rounded-sm focus:outline-none"
                              />
                              <button className="text-gray-400 border border-indigo-500 px-4 rounded-sm text-white bg-indigo-500">
                                Search
                              </button>
                            </div>
                          </div>
                          <div className="overflow-y-scroll h-[85%] relative p-2 space-y-2">
                            <div className="flex justify-between p-3 bg-gray-50 rounded-sm text-gray-900 font-semibold cursor-pointer">
                              <p>Plumbing Services</p>
                              <ArrowUpRightFromCircle className="h-5 w-5 text-indigo-700"></ArrowUpRightFromCircle>
                            </div>
                            <div>
                            <ul className="p-2 text-gray-900">
                              <li className="py-1.5 pt-3 border-b border-gray-200">Ananta Plumbing Services</li>
                            </ul>
                            </div>
                          </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

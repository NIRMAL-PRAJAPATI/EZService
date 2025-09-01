import { AlignRight, Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import resources from "../../resource";
import { useState } from "react";

const DashboardHeader = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navLinks = [
    { id: "Dashboard", to: "/provider/dashboard" },
    { id: "Profile", to: "/provider/profile" },
    { id: "Orders", to: "/provider/orders" },
    { id: "Services", to: "/provider/services" },
    { id: "Instant Requests", to: "/provider/instant-requests" },
    { id: "Complaints", to: "/provider/complaints" }
  ];

    const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img src={resources.Logo.src} className="h-6 w-6 mr-2" alt="Logo" />
              <span className="text-xl font-bold -mt-0.5">EZService</span>
            </div>
            <div className={`flex flex-col md:flex-row space-x-5 ml-7 md:items-center justify-between absolute md:w-full md:relative z-10 top-12 md:top-0 w-[70vw] sm:w-[50vw] ${
              menuOpen ? "right-0" : "right-[100vw]"
            } md:right-0 bg-white text-left md:bg-transparent p-6 md:p-0 z-20 border-none transition-all duration-100 gap-1`}>
              {navLinks.map(({ id, to }) => (
                <Link
                  key={id}
                  to={to}
                  className={`text-sm tracking-wide ${
                    currentPath === to
                      ? "text-indigo-600 font-medium"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {id}
                </Link>
              ))}
            </div>
          </div>
          
        <AlignRight className="md:hidden h-8 w-8 text-gray-800 mt-3 hover:text-primary cursor-pointer" onClick={toggleMenu} id="navMenuBtn"/>
        </div>
      </div>
    </nav>
  );
};

export default DashboardHeader;

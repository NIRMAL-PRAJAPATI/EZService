import { Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import resources from "../../resource";

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

  return (
    <nav className="bg-white shadow-md fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img src={resources.Logo.src} className="h-6 w-6 mr-2" alt="Logo" />
              <span className="text-xl font-bold">EZService</span>
            </div>
            <div className="hidden sm:flex sm:ml-6 flex-row sm:space-x-4 items-center">
              {navLinks.map(({ id, to }) => (
                <Link
                  key={id}
                  to={to}
                  className={`text-sm ${
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
        </div>
      </div>
    </nav>
  );
};

export default DashboardHeader;

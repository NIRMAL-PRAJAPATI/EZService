import { Mail, Phone } from "lucide-react";
import React from "react";
import resources from "../resource";
const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div>
            <img
              src={resources.Logo.src}
              className="h-8 w-8 mr-2 md:mt-2 mb-3"
              alt="Logo"
            />
              <h3 className="text-lg font-semibold ">About Us</h3>
              <p className="text-gray-400">
                Connecting skilled service providers with customers looking for
                quality services.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-500 hover:text-indigo-500">
                    Investors
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-indigo-500">
                    Career
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-indigo-500">
                    Market
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-indigo-500">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-500 hover:text-indigo-500">
                    Find Services
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-indigo-500">
                    Become a Provider
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-indigo-500">
                    How It Works
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-500 hover:text-indigo-500">
                    Home Services
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-indigo-500">
                    Professional Services
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-indigo-500">
                    Health &amp; Fitness
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-indigo-500">
                    Education
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 mt-1" />support@ezservice.com
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 mt-1" />+1 (555) 123-4567
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 ServiceHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
}

export default Footer;
import React from "react";
const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-5">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-gray-400">
                Connecting skilled service providers with customers looking for
                quality services.
              </p>
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
                <li>
                  <a href="#" className="text-gray-500 hover:text-indigo-500">
                    Contact Us
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
                  <i data-lucide="mail" className="h-5 w-5" />
                  support@servicehub.com
                </li>
                <li className="flex items-center gap-2">
                  <i data-lucide="phone" className="h-5 w-5" />
                  +1 (555) 123-4567
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
import React from "react";
import { Star } from "lucide-react";

const UserReview = () => {
    return (
        <div>
        <section id="testimonials" className="bg-gray-50 mt-5 mb-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-5">
            <h2 className="text-3xl font-bold text-indigo-500-700">
              What Our Clients Say
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our satisfied clients
              have to say about our services.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-5 rounded-lg shadow-md border hover:border-indigo-500">
              <div className="flex items-center mb-2">
                <div className="text-indigo-500">
                  <Star className=" ml-2 mt-[2px] transition duration-150 h-5 w-5 fill-indigo-500 inline-block" />
                  <Star className=" ml-2 mt-[2px] transition duration-150 h-5 w-5 fill-indigo-500 inline-block" />
                  <Star className=" ml-2 mt-[2px] transition duration-150 h-5 w-5 fill-indigo-500 inline-block" />
                  <Star className=" ml-2 mt-[2px] transition duration-150 h-5 w-5 fill-indigo-200 inline-block" />
                  <Star className=" ml-2 mt-[2px] transition duration-150 h-5 w-5 inline-block" />
                </div>
              </div>
              <p className="text-gray-600 mb-2 text-sm">
                "TrustServe Pro transformed our business operations. Their strategic
                consulting helped us increase efficiency by 35% and grow our revenue
                significantly. Highly recommended!"
              </p>
              <div className="ml-2">
                <h4 className="font-semibold">Sarah Johnson</h4>
                <p className="text-gray-500 text-[12px] -mt-1">
                  Ahmedabad, Gujarat, India
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* login & signin Section */}
      <hr />
      <section className="bg-white p-10">
        <div className="py-10 px-5 text-center border-indigo-500 border-dashed border-2 rounded-md">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Ready to Get Started?
          </h2>
          <p className="text-md mb-5 text-gray-700">
            Join thousands of satisfied customers and service providers on our
            platform
          </p>
          <div className="flex  gap-1 justify-center">
            <a
              href="login.html"
              className="px-5 py-2 sm:px-8 sm:py-3 bg-indigo-500 text-white border font-medium rounded-md hover:bg-indigo-500/90"
            >
              LogIn
            </a>
            <a
              href="registration.html"
              className="px-5 py-2 sm:px-8 sm:py-3 bg-transparent border-2 border-indigo-500 font-medium rounded-md hover:bg-white/10"
            >
              Sign Up
            </a>
          </div>
        </div>
      </section>
      </div>
    );
};

export default UserReview;
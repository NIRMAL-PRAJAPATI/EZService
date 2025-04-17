import React from "react";
import { Star } from "lucide-react";

const UserReview = () => {
    return (
        <div>
        <section id="testimonials" className="bg-gray-50 mt-5 mb-10 text-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-5">
            <h2 className="text-3xl font-bold text-indigo-500">
              What Our Clients Say
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our satisfied clients
              have to say about our services.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 hover:border-indigo-500">
              <div className="flex items-center mb-2">
                <div className="text-indigo-500">
                  <Star className=" ml-2 mt-[2px] transition duration-150 h-5 w-5 fill-indigo-500 inline-block" />
                  <Star className=" ml-2 mt-[2px] transition duration-150 h-5 w-5 fill-indigo-500 inline-block" />
                  <Star className=" ml-2 mt-[2px] transition duration-150 h-5 w-5 fill-indigo-500 inline-block" />
                  <Star className=" ml-2 mt-[2px] transition duration-150 h-5 w-5 fill-indigo-500 inline-block" />
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
      
      </div>
    );
};

export default UserReview;
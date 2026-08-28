import React from "react";
import { Star, UserCheck } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Aarav Sharma",
    location: "Ahmedabad, Gujarat",
    service: "AC Repair & Servicing",
    rating: 5,
    review:
      "Booked an emergency AC repair in the afternoon. The technician arrived within 25 minutes, diagnosed the capacitor issue immediately, and fixed it at a very reasonable price. Phenomenal service!",
  },
  {
    name: "Pooja Patel",
    location: "Mumbai, Maharashtra",
    service: "Plumbing Service",
    rating: 5,
    review:
      "I had an urgent kitchen pipe leakage. Used the Instant Service feature and got 2 quotes within 60 seconds. The plumber was extremely polite and professional. Highly recommend EZService!",
  },
  {
    name: "Rohan Mehta",
    location: "Bengaluru, Karnataka",
    service: "Electrical Wiring & Setup",
    rating: 5,
    review:
      "Transparent visiting charges with no hidden surprises. The electrician followed all safety protocols and did a clean, thorough job. The whole booking process was effortless.",
  },
];

const UserReview = () => {
  return (
    <section id="testimonials" className="py-14 bg-gray-50 text-gray-900">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-2">
            <Star className="w-3 h-3 fill-indigo-600" />
            <span>4.9 / 5.0 Rating from 10,000+ Customers</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 text-sm">
            Real feedback from verified homeowners and businesses across India
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 text-indigo-500 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-indigo-500" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 text-sm leading-relaxed mb-6 font-normal">
                  "{item.review}"
                </p>
              </div>

              {/* Author & Service */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{item.name}</h4>
                  <p className="text-gray-500 text-xs">{item.location}</p>
                </div>
                <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {item.service}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserReview;
import React from 'react';
import { Link } from 'react-router-dom';
import { Plug, Car, LibraryBig, Wrench, PartyPopper } from 'lucide-react';

function LRAlert() {
  return (
    <section className="py-12 bg-white text-gray-900 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl border border-indigo-950">
          {/* Subtle decorative floating icons */}
          <div className="text-gray-700/30 overflow-hidden pointer-events-none select-none">
            <Plug className="absolute top-6 left-12 rotate-[330deg] w-7 h-7" />
            <LibraryBig className="absolute top-10 right-14 w-7 h-7" />
            <Car className="absolute bottom-6 left-[20vw] rotate-[330deg] w-7 h-7" />
            <Wrench className="absolute bottom-8 right-24 rotate-[10deg] w-7 h-7" />
            <PartyPopper className="absolute top-1/2 right-[15%] w-7 h-7" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/20 px-3 py-1 rounded-full mb-3">
              Join EZService Today
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Ready to Experience Seamless Home Services?
            </h2>
            <p className="text-sm sm:text-base text-gray-300 mb-8 leading-relaxed">
              Sign in to book trusted service professionals in seconds, track orders live, and enjoy transparent pricing.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/login"
                className="px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-md shadow-md transition duration-150"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-7 py-3 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-md border border-white/20 transition duration-150"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LRAlert;
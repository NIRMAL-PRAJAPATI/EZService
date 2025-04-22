import { BriefcaseBusiness, Car, Dumbbell, LibraryBig, PartyPopper, Plug, ScanHeart, Wrench } from 'lucide-react'
import React from 'react'
import resources from '../resource'

function ErrorPage() {
  return (
    <div className='h-[90vh]'>
        <div className="text-gray-300 overflow-hidden">
        <Plug className="absolute top-24 left-60 rotate-[330deg] z-0"
        />
        <LibraryBig className="absolute top-[30vh] right-20 z-0" />
        <Car className="absolute top-[50vh] left-[30vw] rotate-[330deg] z-0"
        />
        <Wrench className="absolute top-[80vh] right-60 rotate-[10deg] z-0"
        />
        <BriefcaseBusiness className="absolute top-24 right-[25vw] rotate-[330deg] z-0"
        />
        <Dumbbell className="absolute top-[90vh] left-20 rotate-[330deg] z-0"
        />
        <ScanHeart className="absolute top-[35vh] left-10 rotate-[330deg] z-0"
        />
        <PartyPopper className="absolute top-[40vh] right-[35%] rotate-[330deg] z-0"
        />
      </div>
      <div className="text-center mt-30">
        <h1 className="font-extrabold text-8xl text-indigo-500">
          404{" "}
          <img
            src={resources.Error.src}
            alt="Error Image"
            className="mx-auto mb-4 h-25 w-25 -mt-16 mr-10 sm:mr-40 lg:mr-80"
          />
        </h1>
        <h1 className="text-3xl font-bold mb-2 -mt-10">Page not found!</h1>
        <p className="text-gray-600 mb-4">
          The page you're looking for might have been removed or is temporarily
          unavailable.
        </p>
        <a
          href="/"
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-500/90"
        >
          Go Back Home
        </a>
      </div>
    </div>
  )
}

export default ErrorPage
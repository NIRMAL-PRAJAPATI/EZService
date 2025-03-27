import { Plug, LibraryBig, Car, Wrench, BriefcaseBusiness, Dumbbell, ScanHeart, PartyPopper } from "lucide-react";
import { Link } from "react-router-dom";
import errorImage from "/vite.svg";

const ErrorPage = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Background Icons */}
      <div className="text-gray-400 overflow-hidden">
        <Plug className="absolute top-24 left-60 rotate-[330deg] z-0" />
        <LibraryBig className="absolute top-[30vh] right-20 z-0" />
        <Car className="absolute top-[50vh] left-[30vw] rotate-[330deg] z-0" />
        <Wrench className="absolute top-[80vh] right-60 rotate-[10deg] z-0" />
        <BriefcaseBusiness className="absolute top-24 right-[25vw] rotate-[330deg] z-0" />
        <Dumbbell className="absolute top-[90vh] left-20 rotate-[330deg] z-0" />
        <ScanHeart className="absolute top-[35vh] left-10 rotate-[330deg] z-0" />
        <PartyPopper className="absolute top-[40vh] right-[35%] rotate-[330deg] z-0" />
      </div>
      
      {/* Error Message */}
      <div className="text-center z-10">
        <h1 className="font-extrabold text-8xl text-primary flex items-center justify-center">
            404 <img src={errorImage} alt="Error" className="h-20 w-20 -mt-16 ml-4" />
        </h1>
        <h2 className="text-3xl font-bold mb-2 -mt-5">Page not found!</h2>
        <p className="text-gray-600 mb-4">The page you're looking for might have been removed or is temporarily unavailable.</p>
        <Link to="/"> <div className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90">Go Back Home </div></Link>
      </div>
    </div>
  );
};

export default ErrorPage;

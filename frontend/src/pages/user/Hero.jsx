import {
  Star,
  Search,
  MapPin,
  Tag,
  BadgeCheck,
  BriefcaseBusiness,
  ChevronDown,
  UserRound,
  Plug,
  LibraryBig,
  Car,
  Wrench,
  Dumbbell,
  HeartIcon as ScanHeart,
  PartyPopper,
  AlignRight,
  Mail,
  Phone,
} from "lucide-react"

function Hero() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed bg-gray-100/50 w-full min-h-screen hidden items-center justify-center z-50">
        <div>
          <img
            src="/frontend/public/img/ezservice logo.png"
            alt="Loading logo"
            className="w-16 h-16 loading-animation"
          />
          <p className="tracking-wide" style={{ fontFamily: "Verdana, Geneva, Tahoma, sans-serif" }}>
            loading...
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="mx-auto py-3 px-4">
          <div className="flex items-center z-10 justify-between">
            <div className="flex items-center">
              <img src="/frontend/public/img/ezservice logo.png" className="h-6 w-6 mr-2" alt="EZService Logo" />
              <span className="font-bold text-xl">EZService</span>
            </div>
            <AlignRight id="navMenuBtn" className="md:hidden h-8 w-8 text-gray-800 hover:text-primary" />
            <div
              id="navMenuDiv"
              className="md:flex items-center justify-between absolute md:w-full md:relative z-10 top-14 md:top-0 w-[70vw] sm:w-[50vw] right-[100vw] md:right-0 bg-white md:bg-transparent p-6 md:p-0 z-20 border md:border-none"
            >
              <div></div>
              <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 tracking-wide md:space-y-0">
                <a href="#" className="text-primary">
                  Home
                </a>
                <a href="explore.html" className="text-gray-600 hover:text-gray-900">
                  Explore
                </a>
                <a href="services.html" className="text-gray-600 hover:text-gray-900">
                  Services
                </a>
                <div id="templateNavBtn">
                  <a className="text-gray-600 hover:text-gray-900 flex">
                    Templates
                    <ChevronDown id="containerArrow" className="h-5 w-5 mt-1 transition duration-150" />
                  </a>
                  <ul
                    id="templateContainer"
                    className="px-5 py-3 absolute bg-white space-y-2 text-gray-600 -ml-10 pt-4 hidden"
                  >
                    <li className="hover:text-gray-900 cursor-pointer">Home Renovation</li>
                    <li className="hover:text-gray-900 cursor-pointer">Wedding Requisites</li>
                    <li className="hover:text-gray-900 cursor-pointer">Home Appliances</li>
                    <li className="hover:text-gray-900 cursor-pointer">Beauty & Spa</li>
                    <li className="hover:text-gray-900 cursor-pointer">Party Things</li>
                  </ul>
                </div>
                <a href="service_ranking.html" className="text-gray-600 hover:text-gray-900">
                  Ranking
                </a>
                <a href="complaint.html" className="text-gray-600 hover:text-gray-900">
                  Complaint
                </a>
                <a href="about.html" className="text-gray-600 hover:text-gray-900">
                  About
                </a>
              </div>
              <div className="flex md:space-x-1 mt-4 md:mt-0">
                {/* <a href="login.html" className="md:px-4 mr-3 md:mr-0 py-2 text-primary hover:bg-green-50 rounded">Login</a>
                <a href="registration.html" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">Sign&nbsp;Up</a> */}
                <a
                  href="user_profile.html"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 flex"
                >
                  <UserRound className="h-4 w-4 mt-1 mr-1" />
                  Account
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20">
        {/* icons */}
        <div className="text-gray-600 overflow-hidden">
          <Plug className="absolute top-24 left-60 rotate-[330deg] z-0" />
          <LibraryBig className="absolute top-[300px] right-20 z-0" />
          <Car className="absolute top-[400px] left-[30vw] rotate-[330deg] z-0" />
          <Wrench className="absolute top-[500px] right-60 rotate-[10deg] z-0" />
          <BriefcaseBusiness className="absolute top-24 right-[25vw] rotate-[330deg] z-0" />
          <Dumbbell className="absolute top-[500px] left-20 rotate-[330deg] z-0" />
          <ScanHeart className="absolute top-[300px] left-10 rotate-[330deg] z-0" />
          <PartyPopper className="absolute top-[350px] right-[35%] rotate-[330deg] z-0" />
        </div>

        <div className="container mx-auto px-4 z-10 relative z-0">
          <div className="max-w-6xl mx-auto text-center">
            <div className="text-[12px]">
              <p>
                <span className="bg-green-50 text-primary font-bold px-2 rounded-full">New</span> You can also talk to
                your service provider
              </p>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-3">
              <p className="flex lg:block flex-col">
                Find Services Like{" "}
                <span>
                  <span id="text" className="text-primary"></span>
                  <span>&nbsp;</span>
                </span>
              </p>
              <p>at Your Fingertips</p>
            </h1>
            <p className="text-md md:text-md tracking-wide mb-8 text-white/50">
              Connect with trusted service providers in your area and do your work quickly and efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <a
                href="/frontend/views/common/error.html"
                className="px-6 py-3 bg-primary text-white font-medium rounded"
              >
                Find Services
              </a>
              <a
                href="/frontend/views/provider/index.html"
                className="px-6 py-3 bg-transparent border-2 border-primary text-white font-medium rounded hover:bg-white/10"
              >
                Become a Provider
              </a>
            </div>
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search for services..."
                  className="w-full px-4 py-3 text-gray-900 bg-transparent border-b border-gray-500 focus:border-white focus:outline-none text-white"
                />
                <button className="text-gray-400 focus:text-white">
                  <Search className="text-xl mt-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-100">
        <div className="px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Popular Categories</h2>
          <div className="overflow-x-auto">
            <div className="flex space-x-2 w-max">
              <button
                type="submit"
                className="w-[200px] p-5 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow hover:border-primary border"
              >
                Plumbing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Top Performed Service Providers</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Service Card 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOG_n0AljJC0H2H6DfzV7AyYBrPXCZyVDqCQ&s"
                alt="Home Cleaning"
                className="w-full h-40 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold -mb-1">Expo Cleaning Service</h3>
                    <p className="text-gray-600">Home Cleaning</p>
                  </div>
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">₹2000</span>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Star className="h-4 w-4 text-primary fill-primary" />
                  <span className="font-medium">4.8</span>
                  <span className="text-gray-600 text-[12px]">(156 reviews)</span>
                </div>
                <div className="flex items-center gap-2 my-1 text-sm">
                  <MapPin className="h-4 w-4 text-gray-600" />
                  <span>Ahmedabad, Gujarat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* city section */}
      <section className="bg-gray-100 py-5">
        <div className="sm:p-6 mb-4">
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Explore City Services</h2>
            <span className="ml-2 mt-1 px-2 py-0.5 text-xs font-semibold text-white bg-primary rounded">NEW</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-0">
            {/* Mumbai Card */}
            <div className="bg-white border hover:border-primary rounded-lg overflow-hidden">
              <div className="flex">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Mumbai_03-2016_31_Gateway_of_India.jpg/1200px-Mumbai_03-2016_31_Gateway_of_India.jpg"
                  alt="Gateway of India, Mumbai"
                  className="w-24 h-24 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg">MUMBAI</h3>
                  <a href="#" className="text-blue-500 flex items-center mt-1">
                    Explore
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* sponsered service list */}
      <section className="container px-5 sm:mx-auto my-10">
        <h1 className="text-3xl font-bold mb-3">Sponsored</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Service Provider Card 1 */}
          <div className="service-card bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
                alt="Plumbing service"
                className="w-full h-48 object-cover"
              />
              <div className="flex absolute top-2 right-2 bg-primary/70 text-white text-xs font-bold px-2 py-1 rounded">
                <BadgeCheck className="h-4 w-4 mr-1" />
                Verfied
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Quick Fix Plumbing</h3>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Tag className="h-3 w-3 mr-1" />
                    Plumbing
                  </p>
                </div>
                <div className="bg-primary/10 text-primary font-medium px-2.5 py-0.5 rounded flex items-center">
                  ₹500
                </div>
              </div>

              <div className="mt-2 space-y-1">
                <div className="flex items-center text-sm mb-3">
                  <span className="text-gray-700">Pipe repairs, Installations, Drain cleaning</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 text-primary mr-2" />
                  <span className="text-gray-700">Downtown, Westside, North Hills</span>
                </div>
                <div className="flex items-center text-sm">
                  <BriefcaseBusiness className="h-4 w-4 text-primary mr-2" />
                  <span className="text-gray-700">5+ Years Experiance</span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <img
                  src="https://images.unsplash.com/photo-1585704032915-c3400ca199e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Work sample"
                  className="w-16 h-16 object-cover rounded-md"
                />
                <img
                  src="https://images.unsplash.com/photo-1542013936693-884638332954?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Work sample"
                  className="w-16 h-16 object-cover rounded-md"
                />
                <img
                  src="https://images.unsplash.com/photo-1615266508040-7c47f7339963?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Work sample"
                  className="w-16 h-16 object-cover rounded-md"
                />
              </div>
              <a href="success.html">
                <button className="w-full bg-primary rounded py-2 mt-3 text-white tracking-wide">Visit Profile</button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* template section */}
      <section className="bg-white py-12">
        <div className="mx-4 md:mx-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Explore Template Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Wedding Requisites Section */}
            <div className="bg-gray-50 rounded-lg border p-4">
              <h2 className="text-xl font-bold text-gray-900">Wedding Requisites</h2>
              <p className="text-gray-500 -mt-1 mb-4 text-sm">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Labore, unde.
              </p>

              <div className="grid grid-cols-3 gap-4">
                {/* Banquet Halls */}
                <div className="flex flex-col items-center">
                  <div className="rounded-lg overflow-hidden mb-2 w-full">
                    <img
                      src="https://image.wedmegood.com/resized/720X/uploads/member/25616/1727946389_234217240.jpg?crop=6,84,1010,568"
                      alt="Banquet Halls"
                      className="w-full h-28 object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-center">Banquet Halls</span>
                </div>

                {/* Bridal Requisite */}
                <div className="flex flex-col items-center">
                  <div className="rounded-lg overflow-hidden mb-2 w-full">
                    <img
                      src="https://img.weddingbazaar.com/shaadisaga_production/photos/pictures/001/887/534/new_medium/pinterest.jpg?1598019283"
                      alt="Bridal Requisite"
                      className="w-full h-28 object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-center">Bridal Requisite</span>
                </div>

                {/* Caterers */}
                <div className="flex flex-col items-center">
                  <div className="rounded-lg overflow-hidden mb-2 w-full">
                    <img
                      src="https://www.shaadibaraati.com/vendors-profile/f79f778a75e54a9cfedc3400d4e3752e.jpg"
                      alt="Caterers"
                      className="w-full h-28 object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-center">Caterers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* customer review */}
      <section id="testimonials" className="bg-gray-50 mt-5 mb-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-5">
            <h2 className="text-3xl font-bold text-primary-700">What Our Clients Say</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our satisfied clients have to say about our services.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-5 rounded-lg shadow-md border hover:border-primary">
              <div className="flex items-center mb-2">
                <div className="text-primary">
                  <Star className="h-5 w-5 fill-primary inline-block" />
                  <Star className="h-5 w-5 fill-primary inline-block" />
                  <Star className="h-5 w-5 fill-primary inline-block" />
                  <Star className="h-5 w-5 fill-primary inline-block" />
                  <Star className="h-5 w-5 inline-block" />
                </div>
              </div>
              <p className="text-gray-600 mb-2 text-sm">
                "TrustServe Pro transformed our business operations. Their strategic consulting helped us increase
                efficiency by 35% and grow our revenue significantly. Highly recommended!"
              </p>
              <div className="ml-2">
                <h4 className="font-semibold">Sarah Johnson</h4>
                <p className="text-gray-500 text-[12px] -mt-1">Ahmedabad, Gujarat, India</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* login & signin Section */}
      <hr />
      <section className="bg-white p-10">
        <div className="py-10 px-5 text-center border-primary border-dashed border-2 rounded-md">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Ready to Get Started?</h2>
          <p className="text-md mb-5 text-gray-700">
            Join thousands of satisfied customers and service providers on our platform
          </p>
          <div className="flex gap-1 justify-center">
            <a
              href="login.html"
              className="px-5 py-2 sm:px-8 sm:py-3 bg-primary text-white border font-medium rounded-md hover:bg-primary/90"
            >
              LogIn
            </a>
            <a
              href="registration.html"
              className="px-5 py-2 sm:px-8 sm:py-3 bg-transparent border-2 border-primary font-medium rounded-md hover:bg-white/10"
            >
              Sign Up
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-12 pb-5">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-gray-400">
                Connecting skilled service providers with customers looking for quality services.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-500 hover:text-primary">
                    Find Services
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-primary">
                    Become a Provider
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-primary">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-primary">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-500 hover:text-primary">
                    Home Services
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-primary">
                    Professional Services
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-primary">
                    Health & Fitness
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-primary">
                    Education
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  support@servicehub.com
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  +1 (555) 123-4567
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ServiceHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Hero

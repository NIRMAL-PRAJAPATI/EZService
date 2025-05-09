import { useEffect, useState } from "react"
import { ArrowDown, ArrowUp, Bell, ChevronRight, DotSquareIcon, Facebook, Instagram, ListOrdered, PercentIcon, Star, StarsIcon, Twitter, UserCheck2Icon } from "lucide-react"
import resources from "../resource"
import authApi from "../config/auth-config"
import { Link } from "react-router-dom"

function Dashboard() {
  const [isOnline, setIsOnline] = useState(true)
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalServices: 0,
    averageRating: 0,
    totalEarnings: 0,
    completedOrders: 0,
    pendingOrders: 0,
    lastMonthOrders: 0,
    currentMonthOrders: 0,
    totalReviews: 0,
    satisfactionChange: 0,
    repeatCustomers: 0,
    repeatCustomersChange: 0,
    customer_satisfation: 0,
    latestReview: {
      comment: "",
      rating: 0,
      created: "",
      customerName: ""
    }
  })

  const csGreet = [
  "Something didn’t click — let’s aim to turn this around!",       // Rating 1
  "Room for improvement — every great service starts with feedback!", // Rating 2
  "You're halfway there — refine the experience and shine!",        // Rating 3
  "Great work! Just a little more to reach perfection!",            // Rating 4
  "Outstanding! Customers love your service!"                       // Rating 5
];


  useEffect(()=>
    {
    authApi.get("provider/stats")
    .then((response) => {
      setStats(response.data)
    })
    .catch((error) => {
      console.error("Error fetching provider stats:", error)
    })},[])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <div className="flex items-center gap-2">
            <img src={resources.Logo.src} alt="EZService Logo" className="object-contain w-10 h-10" />
            <h1 className="text-xl font-bold text-gray-800">EZService</h1>
          </div>

          <nav className="hidden md:flex">
            <ul className="flex items-center space-x-8">
              {[{id:"Dashboard",to:"/provider/dashboard"}, {id:"Profile",to:"/provider/profile"}, {id:"Orders",to:"/provider/orders"}, {id:"Services",to:"/provider/services"}, {id:"Complaints",to:"/provider/complaints"}].map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.to}
                    className={`py-5 border-b-2 ${
                      item.id === "Dashboard"
                        ? "border-emerald-500 text-emerald-600 font-medium"
                        : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                    }`}
                  >
                    {item.id}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <span className="sr-only">Notifications</span>
              <div className="relative">
                <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                <Bell className="text-gray-600" size={20} />
              </div>
            </button>
            <div className="w-8 h-8 overflow-hidden rounded-full bg-emerald-100">
              <img src="https://via.placeholder.com/32" alt="User Avatar" className="object-cover w-full h-full" />
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 mx-auto">
        {/* Service Status */}
        <div className="p-4 mb-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isOnline ? "bg-emerald-500" : "bg-gray-400"}`}></div>
            <span className="font-medium text-gray-800">Instant Service Status: {isOnline ? "Online" : "Offline"}</span>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className="px-3 py-1 ml-auto text-sm text-white rounded-full bg-emerald-500 hover:bg-emerald-600"
            >
              {isOnline ? "Go Offline" : "Go Online"}
            </button>
          </div>
        </div>

        {/* Overview */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-gray-800">Overview</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Visitors */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
              <p className="mt-2 text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
              <a
                href="#"
                className="inline-flex items-center mt-4 text-sm font-medium text-gray-600 hover:text-emerald-600"
              >
                View all orders
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* Total Orders */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Total Services</h3>
              <p className="mt-2 text-3xl font-bold text-gray-800">{stats.totalServices}</p>
              <a
                href="#"
                className="inline-flex items-center mt-4 text-sm font-medium text-gray-600 hover:text-emerald-600"
              >
                View all services
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* Rating */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Rating</h3>
              <div className="flex items-center mt-2">
                <p className="text-3xl font-bold text-gray-800">{parseFloat(stats.averageRating).toFixed(2)}</p>
                <span className="text-lg text-gray-500">/5</span>
              </div>
              <a
                href="#"
                className="inline-flex items-center mt-4 text-sm font-medium text-gray-600 hover:text-emerald-600"
              >
                View reviews
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>

            {/* Earnings */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Earnings (This Month)</h3>
              <p className="mt-2 text-3xl font-bold text-gray-800">{stats.totalEarnings}</p>
              <a
                href="#"
                className="inline-flex items-center mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                View earnings
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-gray-800">Performance Metrics</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Orders */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Orders</h3>
              <p className="mt-2 text-3xl font-bold text-gray-800">{stats.lastMonthOrders == 0 && stats.currentMonthOrders > stats.lastMonthOrders? "100%": stats.currentMonthOrders == 0? "0%": ((stats.currentMonthOrders*100)/stats.lastMonthOrders)+"%"}</p>
              <div className="flex items-center mt-2">
                <ListOrdered className="w-4 h-4 mr-1 text-black" />
                <span className="text-sm font-medium text-black">{stats.lastMonthOrders} last month, {stats.currentMonthOrders} this month</span>
              </div>
            </div>

            {/* Completion Rate */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
              <p className="mt-2 text-3xl font-bold text-gray-800">{stats.totalOrders == 0? "No Orders" :(stats.completedOrders*100/stats.totalOrders)+"%"}</p>
              <div className="flex items-center mt-2">
                <DotSquareIcon className="w-4 h-4 mr-1 text-black" />
                <span className="text-sm font-medium text-black">{stats.completedOrders} completed, {stats.pendingOrders} pending</span>
              </div>
            </div>

            {/* Customer Satisfaction */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Customer Satisfaction</h3>
              <p className="mt-2 text-3xl font-bold text-gray-800">{stats.customer_satisfation}/5.0</p>
              <div className="flex items-center mt-2">
                <StarsIcon className="w-4 h-4 mr-1 text-black" />
                <span className="text-sm font-medium text-black">{csGreet[Math.floor(stats.customer_satisfation || 6)]}</span>
              </div>
            </div>

            {/* Repeat Customers */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">Repeat Customers</h3>
              <p className="mt-2 text-3xl font-bold text-gray-800">{stats.repeatCustomers}</p>
              <div className="flex items-center mt-2">
                <UserCheck2Icon className="w-4 h-4 mr-1 " />
                <span className="text-sm font-medium ">{stats.repeatCustomers == 0? "No RepeatingDeliver excellence - loyalty will follow!": `Loyal customers alert — ${stats.repeatCustomers}% returned!`}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Reviews */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Reviews</h2>
            <a href="#" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
              View all
            </a>
          </div>
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-800 capitalize">{stats.latestReview.customerName}</h3>
                  <p className="mt-1 text-gray-600">
                    {stats.latestReview.comment}
                  </p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <span>{stats.latestReview.serviceName}</span>
                    <span className="mx-2">•</span>
                    <span>{stats.latestReview.created}</span>
                  </div>
                </div>
                <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 text-sm font-medium text-gray-600">{parseFloat(stats.latestReview.rating).toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 mt-12 text-center text-gray-500 border-t">
        <div className="container px-4 mx-auto">
          <p>© 2023 ServicePro, Inc. All rights reserved.</p>
          <div className="flex items-center justify-center mt-4 space-x-4">
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <Facebook className="w-5 h-5" />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <Instagram className="w-5 h-5" />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600">
              <Twitter className="w-5 h-5" />
              <span className="sr-only">Twitter</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard;
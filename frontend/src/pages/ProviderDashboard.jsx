import { useEffect, useState } from "react";
import {
  ArrowDown, ArrowUp, Bell, IndianRupee, DotSquareIcon,
  Facebook, Instagram, ListOrdered, Star,
  Telescope, Twitter, ShoppingCart
} from "lucide-react";
import authApi from "../config/auth-config";
import resources from "../resource";
import { Link } from "react-router-dom";
import DashboardHeader from "../components/provider/Header";
import Loading from "../components/Loading"

const iconMap = {
  telescope: Telescope,
  "shopping-cart": ShoppingCart,
  star: Star,
  "indian-rupee": IndianRupee
};

function Dashboard() {
  const [isOnline, setIsOnline] = useState(true);
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
      customerName: "",
      serviceName: ""
    }
  });

  const csGreet = [
    "Something didn’t click — let’s aim to turn this around!",
    "Room for improvement — every great service starts with feedback!",
    "You're halfway there — refine the experience and shine!",
    "Great work! Just a little more to reach perfection!",
    "Outstanding! Customers love your service!"
  ];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi.get("provider/stats")
      .then((response) => {setStats(response.data)
        setLoading(false);
        console.log(response.data)
      })
      .catch((error) => {console.error("Error fetching stats:", error)
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navigation */}
      <DashboardHeader />

      {/* Main Content */}
      {loading ? <Loading /> : 
      
      <main className="max-w-7xl mx-auto py-4 px-3 sm:px-6 lg:px-8 pt-20 z-0">
        {/* Status Bar */}
        <div className="bg-white shadow rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center">
            <span className={`h-3 w-3 ${isOnline ? "bg-green-400" : "bg-gray-400"} rounded-full mx-2`}></span>
            <span className="text-sm font-medium">Instant Service Status: {isOnline ? "Online" : "Offline"}</span>
          </div>
          <div>
            <button
              onClick={() => setIsOnline(!isOnline)}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              {isOnline ? "Go Offline" : "Go Online"}
            </button>
          </div>
        </div>

        {/* Overview */}
        <section className="mt-3">
          <h2 className="text-lg leading-6 font-medium text-gray-900 px-4 sm:px-0">Overview</h2>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardCard icon="telescope" title="Total Visitors" value={stats.totalReviews} />
            <DashboardCard icon="shopping-cart" title="Total Orders" value={stats.totalOrders} />
            <DashboardCard icon="star" title="Rating" value={`${parseFloat(stats.averageRating).toFixed(1)}/5`} />
            <DashboardCard icon="indian-rupee" title="Earnings (This Month)" value={stats.totalEarnings} />
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="mt-8">
          <h2 className="text-lg leading-6 font-medium text-gray-900 px-4 sm:px-0">Performance Metrics</h2>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricBar title="Orders" percent={calculatePercentage(stats.lastMonthOrders, stats.currentMonthOrders)} message={`${stats.lastMonthOrders} last month, ${stats.currentMonthOrders} this month`} />
            <MetricBar title="Completion Rate" percent={calculatePercentage(stats.totalOrders, stats.completedOrders)} message={`${stats.completedOrders} completed, ${stats.pendingOrders} pending`} />
            <MetricBar title="Customer Satisfaction" percent={stats.customer_satisfation * 20} message={csGreet[Math.floor(stats.customer_satisfation || 0)]} />
            <MetricBar title="Repeat Customers" percent={stats.repeatCustomers} message={`${stats.repeatCustomers} repeat customers`} ispercentage={false} />
          </div>
        </section>

        {/* Reviews */}
        {stats.totalReviews > 0 &&
        
        <section className="mt-8">
          <div className="flex items-center justify-between px-4 sm:px-0">
            <h2 className="text-lg font-medium text-gray-900">Recent Reviews</h2>
            <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              View all
            </a>
          </div>
          <div className="mt-2 bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              <li>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {stats.latestReview.customerName}
                        </p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < Math.round(stats.latestReview.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                          <p className="ml-2 text-sm text-gray-500">
                            {parseFloat(stats.latestReview.rating).toFixed(1)}
                          </p>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{stats.latestReview.comment}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>{stats.latestReview.serviceName || "Service"} • {stats.latestReview.created}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </section>
        }
      </main>
      }

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center space-x-6 md:order-2">
              <a href="#" className="text-gray-400 hover:text-gray-500"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-gray-500"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="text-gray-400 hover:text-gray-500"><Twitter className="h-5 w-5" /></a>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-gray-400">
                &copy; 2023 ServicePro, Inc. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DashboardCard({ icon, title, value }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-4 flex items-center">
        <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
          {renderLucideIcon(icon)}
        </div>
        <div className="ml-5 flex-1">
          <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
          <dd className="mt-1 text-2xl font-bold text-gray-900">{value}</dd>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-4">
        <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          View details
        </a>
      </div>
    </div>
  );
}

function MetricBar({ title, percent, message, ispercentage = true }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      <div className="mt-2 flex justify-between items-baseline">
        <div className="text-2xl font-semibold text-indigo-600">{percent}{ispercentage? "%":''}</div>
        <div className={`text-xs flex items-center`}>
          {message}
        </div>
      </div>
      <div className="mt-2 bg-gray-200 h-1 rounded">
        <div
          className="h-1 bg-indigo-500 rounded"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function calculatePercentage(base, current) {
  if (base === 0 && current > 0) return 100;
  if (base === 0 || current === 0) return 0;
  return Math.min(100, Math.round((current * 100) / base));
}

function renderLucideIcon(name) {
  const IconComponent = iconMap[name];
  return IconComponent ? <IconComponent className="w-5 h-5 text-white" /> : null;
}

export default Dashboard;

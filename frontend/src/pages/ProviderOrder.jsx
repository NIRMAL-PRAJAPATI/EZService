import { FileDigit, MapPin, Calendar } from 'lucide-react';
import DashboardHeader from '../components/provider/Header';
import { useEffect, useState } from 'react';
import authApi from '../config/auth-config';
import Loading from '../components/Loading';

function OrderItem({ order }) {
  return (
    <li>
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <p className="font-bold text-primary tracking-wide text-xl capitalize">
              {order.customerName}
            </p>
          </div>
          <div className="ml-2 flex-shrink-0 flex">
            <p className="text-sm text-gray-500">
              {order.serviceType}
            </p>
          </div>
        </div>
        <div className="mt-2 sm:flex sm:justify-between">
          <div className="sm:flex">
            <p className="flex items-center text-sm text-gray-500 font-medium">
              <FileDigit className="flex-shrink-0 mr-1.5 h-5 w-5 text-primary/60" />
              <span>Order No: #{order.orderNo}</span>
            </p>
            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
              <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-primary/60" />
              <span className="w-full sm:w-[25vw] truncate">{order.address}</span>
            </p>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
            <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-primary/60" />
            <p>{order.serviceTime}</p>
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-3 font-semibold">
          Issue: <span className="font-normal">{order.issue}</span>
        </p>
        <div className="mt-2 flex justify-end space-x-2">
          <button className="inline-flex items-center px-4 py-2 border border-primary font-medium rounded text-primary">
            Decline
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent font-medium rounded text-white bg-indigo-500">
            Accept order
          </button>
        </div>
      </div>
    </li>
  );
}

function OrderList({ orders }) {
  return (
    <div className="mt-5">
      <h2 className="text-lg leading-6 font-medium text-gray-900">Orders</h2>
      <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {orders.map((order) => (
            <OrderItem key={order.orderNo} order={order} />
          ))}
        </ul>
      </div>
    </div>
  );
}



function ProviderOrder() {
  const [ordersData, setOrdersData] = useState([]);
  const [filter, setFilter] = useState("All");
  const filteredOrders =
    filter === "All"
      ? ordersData
      : ordersData.filter((order) => order.status === filter);

  const statusFilters = ["All", "pending", "fulfilled", "cancelled", "declined"];
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    authApi
      .get("/provider/orders")
      .then((response) => {
        const orders = response.data.orders.map((order) => ({
          orderNo: order.order_id,
          customerName: order.CustomerInfo.name,
          serviceType: order.Service.name,
          address: order.location,
          serviceTime: order.updated,
          issue: order.issue,
          status: order.status
        }));
        setLoading(false);
        setOrdersData(orders);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  },[])

  return (
    <>
    <DashboardHeader />
    <div className="bg-white shadow overflow-hidden sm:rounded-md max-w-7xl mx-auto pt-20">
    <div className="px-4 py-5 sm:px-6">
        <div className="flex space-x-2">
          {statusFilters.map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={
                "px-4 py-2 rounded-md text-sm font-medium border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      </div>
      
    <main className="max-w-7xl mx-auto z-0">
      {loading ? <Loading />: <OrderList orders={filteredOrders} />}
    </main>
    </>
  );
}

export default ProviderOrder;
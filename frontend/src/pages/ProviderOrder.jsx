import { FileDigit, MapPin, Calendar } from 'lucide-react';
import DashboardHeader from '../components/provider/Header';
import { useEffect, useState } from 'react';
import authApi from '../config/auth-config';
import Loading from '../components/Loading';

function OrderItem({ order, onStatusUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false);
  
  console.log("Order in OrderItem:", order);
  
  const handleStatusUpdate = (status) => {
    setIsUpdating(true);
    authApi.put(`/orders/${order.orderNo}/status`, { status })
      .then(response => {
        console.log(`Order ${order.orderNo} status updated to ${status}`);
        // Call the parent component's update handler
        onStatusUpdate(order.orderNo, status);
      })
      .catch(error => {
        console.error(`Error ${status === 'accepted' ? 'accepting' : 'declining'} order:`, error);
        alert(`Failed to ${status === 'accepted' ? 'accept' : 'decline'} order. Please try again.`);
      })
      .finally(() => {
        setIsUpdating(false);
      });
  };
  
  // Render status badge
  const renderStatusBadge = () => {
    const status = order.status || "PENDING";
    
    switch(status.toUpperCase()) {
      case 'pending':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'accepted':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Accepted</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Declined</span>;
      case 'fulfilled':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Completed</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };
  
  return (
    <li>
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <p className="font-bold text-primary tracking-wide text-xl capitalize">
              {order.customerName}
            </p>
          </div>
          <div className="ml-2 flex-shrink-0 flex items-center space-x-2">
            {renderStatusBadge()}
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
        {(!order.status || order.status === 'PENDING' || order.status.toUpperCase() === 'PENDING') && (
          <div className="mt-2 flex justify-end space-x-2">
            <button 
              onClick={() => handleStatusUpdate('rejected')}
              disabled={isUpdating}
              className="inline-flex items-center px-4 py-2 border border-red-500 font-medium rounded text-red-500 hover:bg-red-50 disabled:opacity-50"
            >
              {isUpdating ? 'Processing...' : 'Decline'}
            </button>
            <button 
              onClick={() => handleStatusUpdate('accepted')}
              disabled={isUpdating}
              className="inline-flex items-center px-4 py-2 border border-transparent font-medium rounded text-white bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50"
            >
              {isUpdating ? 'Processing...' : 'Accept order'}
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

function OrderList({ orders, onStatusUpdate }) {
  return (
    <div className="mt-5">
      <h2 className="text-lg leading-6 font-medium text-gray-900">Orders</h2>
      <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
        {orders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No orders found</div>
        ) : (
          <ul role="list" className="divide-y divide-gray-200">
            {orders.map((order) => (
              <OrderItem 
                key={order.orderNo} 
                order={order} 
                onStatusUpdate={onStatusUpdate} 
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}



function ProviderOrder() {
  const [ordersData, setOrdersData] = useState([]);
  const [filter, setFilter] = useState("All");
  console.log("Orders data:", ordersData);
  const filteredOrders =
    filter === "All"
      ? ordersData
      : ordersData.filter((order) => {
          const orderStatus = (order.status || "").toUpperCase();
          return orderStatus === filter;
        });

  const statusFilters = ["All", "PENDING", "ACCEPTED", "REJECTED", "FULFILLED"];
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    
    // Try both possible API endpoints
    authApi
      .get("/orders/provider")
      .then((response) => {
        console.log("API response from /orders/provider:", response.data);
        processOrdersData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching from /orders/provider:", error);
        
        // Try alternative endpoint
        authApi
          .get("/provider/orders")
          .then((response) => {
            console.log("API response from /provider/orders:", response.data);
            
            // Check if response has orders property
            const ordersData = response.data.orders || response.data;
            processOrdersData(ordersData);
          })
          .catch((secondError) => {
            console.error("Error fetching from /provider/orders:", secondError);
            setLoading(false);
          });
      });
  };
  
  const processOrdersData = (data) => {
    try {
      const orders = data.map((order) => ({
        orderNo: order.order_id,
        customerName: order.CustomerInfo?.name || "Customer",
        serviceType: order.Service?.name || "Service",
        address: order.location || "",
        serviceTime: order.date ? new Date(order.date).toLocaleDateString() : "Not specified",
        issue: order.issue || "No issue specified",
        status: order.status || "PENDING"
      }));
      
      console.log("Processed orders:", orders);
      setOrdersData(orders);
    } catch (err) {
      console.error("Error processing orders data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  
  const handleStatusUpdate = (orderId, newStatus) => {
    // Update the local state to reflect the status change
    setOrdersData(prevOrders => 
      prevOrders.map(order => 
        order.orderNo === orderId 
          ? { ...order, status: newStatus } 
          : order
      )
    );
    
    // Reload data after a short delay to ensure backend has updated
    setTimeout(() => {
      fetchOrders();
    }, 500);
  };

  return (
    <>
    <DashboardHeader />
    <div className="bg-white shadow overflow-hidden sm:rounded-md max-w-7xl mx-auto pt-20">
    <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            {statusFilters.map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={
                  filter === status
                    ? "px-4 py-2 rounded-md text-sm font-medium border bg-indigo-50 text-indigo-700 border-indigo-300"
                    : "px-4 py-2 rounded-md text-sm font-medium border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }
              >
                {status === "All" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
          <button 
            onClick={fetchOrders}
            disabled={loading}
            className="px-4 py-2 rounded-md text-sm font-medium border bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh Orders"}
          </button>
        </div>
      </div>
      </div>
      
    <main className="max-w-7xl mx-auto z-0">
      {loading ? <Loading /> : <OrderList orders={filteredOrders} onStatusUpdate={handleStatusUpdate} />}
    </main>
    </>
  );
}

export default ProviderOrder;
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Calendar, FileText, DollarSign, Phone, Mail, Package, IndianRupee, TimerResetIcon, Wrench } from 'lucide-react';
import DashboardHeader from '../components/provider/Header';
import authApi from '../config/auth-config';
import Loading from '../components/Loading';

function ProviderOrderView() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await authApi.get(`/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    try {
      setUpdating(true);
      await authApi.put(`/orders/${orderId}/status`, { status });
      await fetchOrderDetails();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    
    return (
      <span className={`px-3 pt-4 -mt-4 pb-1.5 text-sm font-semibold rounded-b-md bg-indigo-500 tracking-wide text-white`}>
        {status}
      </span>
    );
  };

  if (loading) return <><DashboardHeader /><Loading /></>;

  if (!order) {
    return (
      <>
        <DashboardHeader />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
            <button 
              onClick={() => navigate('/provider/orders')}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader />
      <div className='bg-gray-50 px-2'>
      <div className="max-w-7xl mx-auto py-8 text-gray-900">
        {/* Header */}
        <div className="mb-4">
          <div className="flex justify-between items-center mt-10">
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            {getStatusBadge(order.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-3">
          {/* Main Order Information */}
          <div className="lg:col-span-2 space-y-2 md:space-y-3">
            {/* Order Summary */}
            <div className="bg-white border border-gray-200 rounded-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-indigo-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium">#{order.order_id}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <TimerResetIcon className="h-5 w-5 text-indigo-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Service Date</p>
                    <p className="font-medium">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <IndianRupee className="h-5 w-5 text-indigo-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Estimated Charge <span className='text-[11px]'>(INR)</span></p>
                    <p className="font-medium">{order.estimated_charge || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-indigo-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Order Created</p>
                    <p className="font-medium">{new Date(order.created).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-white border border-gray-200 rounded-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Service Details</h2>
              {order.Service && (
                <div className="flex items-start space-x-4 mb-2">
                  {order.Service.cover_image && (
                    <img 
                      src={order.Service.cover_image} 
                      alt={order.Service.name}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Wrench className="h-5 w-5 text-indigo-500 mr-2" />
                      <h3 className="text-lg font-medium">{order.Service.name}</h3>
                    </div>
                    <p className="text-gray-600 text-sm">{order.Service.description}</p>
                    {/* <div className="mt-2 flex space-x-4 text-sm font-bold text-gray-500">
                      <span>Visiting Charge: ₹{order.Service.visiting_charge}</span>
                      {order.Service.instant_visiting_charge && (
                        <span>Instant Charge: ₹{order.Service.instant_visiting_charge}</span>
                      )}
                    </div> */}
                  </div>
                </div>
              )}
              <h2 className="-mb-1 font-semibold text-gray-900">Issue: </h2>
              <p className="text-gray-700">{order.issue || 'No issue description provided'}</p>
            </div>

            {/* Location */}
            <div className="bg-white border border-gray-200 rounded-md p-6">
              <div className='flex'>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Service Location</h2>
              <span className='text-xs mt-2 ml-1 text-gray-500'>(the location you need to provide the service)</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-indigo-500 mr-3 mt-1" />
                <p className="text-gray-700">{order.location || 'Location not specified'}</p>
              </div>
            </div>
          </div>

          {/* Customer Information & Actions */}
          <div className="space-y-6">
            {/* Customer Details */}
            <div className="bg-white border border-gray-200 rounded-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Customer Information</h2>
              {order.CustomerInfo && (
                <div className="space-y-2">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-indigo-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{order.CustomerInfo.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-indigo-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{order.CustomerInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-indigo-500 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Mobile</p>
                      <p className="font-medium">{order.CustomerInfo.mobile}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {order.status === 'PENDING' && (
              <div className="bg-white border border-gray-200 rounded-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
                <div className="space-y-3">
                  <button 
                    onClick={() => handleStatusUpdate('CONFIRMED')}
                    disabled={updating}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {updating ? 'Processing...' : 'Accept Order'}
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate('CANCELLED')}
                    disabled={updating}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    {updating ? 'Processing...' : 'Decline Order'}
                  </button>
                </div>
              </div>
            )}

            {order.status === 'CONFIRMED' && (
                <button 
                  onClick={() => handleStatusUpdate('COMPLETED')}
                  disabled={updating}
                  className="w-full -mt-2 px-4 py-3 bg-indigo-500 text-white rounded-sm hover:bg-indigo-600 disabled:opacity-50"
                >
                  {updating ? 'Processing...' : 'Mark as Completed'}
                </button>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default ProviderOrderView;
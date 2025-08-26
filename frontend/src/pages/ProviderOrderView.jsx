import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Calendar, FileText, DollarSign, Phone, Mail, Package } from 'lucide-react';
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
    const statusMap = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CONFIRMED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'COMPLETED': 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusMap[status] || 'bg-gray-100 text-gray-800'}`}>
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/provider/orders')}
            className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </button>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            {getStatusBadge(order.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium">#{order.order_id}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Service Date</p>
                    <p className="font-medium">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Estimated Charge</p>
                    <p className="font-medium">₹{order.estimated_charge || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Order Created</p>
                    <p className="font-medium">{new Date(order.created).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Details</h2>
              {order.Service && (
                <div className="flex items-start space-x-4">
                  {order.Service.cover_image && (
                    <img 
                      src={order.Service.cover_image} 
                      alt={order.Service.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <Package className="h-5 w-5 text-gray-400 mr-2" />
                      <h3 className="text-lg font-medium">{order.Service.name}</h3>
                    </div>
                    <p className="text-gray-600 text-sm">{order.Service.description}</p>
                    <div className="mt-2 flex space-x-4 text-sm text-gray-500">
                      <span>Visiting Charge: ₹{order.Service.visiting_charge}</span>
                      {order.Service.instant_visiting_charge && (
                        <span>Instant Charge: ₹{order.Service.instant_visiting_charge}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Issue Description */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Issue Description</h2>
              <p className="text-gray-700">{order.issue || 'No issue description provided'}</p>
            </div>

            {/* Location */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Location</h2>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                <p className="text-gray-700">{order.location || 'Location not specified'}</p>
              </div>
            </div>
          </div>

          {/* Customer Information & Actions */}
          <div className="space-y-6">
            {/* Customer Details */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
              {order.CustomerInfo && (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{order.CustomerInfo.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{order.CustomerInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
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
              <div className="bg-white shadow rounded-lg p-6">
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
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Mark as Complete</h2>
                <button 
                  onClick={() => handleStatusUpdate('COMPLETED')}
                  disabled={updating}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {updating ? 'Processing...' : 'Mark as Completed'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProviderOrderView;
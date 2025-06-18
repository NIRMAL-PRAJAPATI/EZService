import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import authApi from '../config/auth-config';
import Navbar from '../components/Navbar';

const BookInstantOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Get data from location state
  const { provider, service, requestDetails } = location.state || {};
  
  // If no data was passed, redirect to instant service page
  useEffect(() => {
    if (!provider || !service || !requestDetails) {
      navigate('/instant-service');
    }
  }, [provider, service, requestDetails, navigate]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Create order
    authApi.post('/orders', {
      service_id: service.id,
      provider_id: provider.id,
      location: requestDetails.address,
      issue: requestDetails.description,
      date: new Date().toISOString(),
      estimated_charge: service.price || 1200,
      status: 'pending'
    })
      .then(response => {
        setLoading(false);
        setSuccess(true);
        
        // Redirect to order details after 2 seconds
        setTimeout(() => {
          navigate(`/order/${response.data.order_id}`);
        }, 2000);
      })
      .catch(error => {
        console.error('Error creating order:', error);
        setError('Failed to create order. Please try again.');
        setLoading(false);
      });
  };
  
  if (!provider || !service || !requestDetails) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto pt-20 px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Confirm Your Booking</h1>
        
        {success ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Booking Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your service has been booked successfully. Redirecting to order details...
            </p>
            <div className="flex justify-center">
              <Loader2 className="animate-spin h-6 w-6 text-indigo-600" />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <div className="mb-6 p-4 border border-gray-200 rounded-md">
              <h2 className="text-xl font-semibold mb-4">Service Provider</h2>
              <div className="flex items-center">
                <img 
                  src={provider.avatar || "https://via.placeholder.com/60"} 
                  alt={provider.name} 
                  className="h-14 w-14 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-medium text-lg">{provider.name}</h3>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★★★★☆</span>
                    <span className="text-sm text-gray-500 ml-1">{provider.rating}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Service Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-500 text-sm">Service Type</p>
                  <p className="font-medium">{service.name}</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-500 text-sm">Price</p>
                  <p className="font-medium">₹{service.price || 1200}</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-md flex items-start">
                  <MapPin className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-sm">Address</p>
                    <p className="font-medium">{requestDetails.address}</p>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-md flex items-start">
                  <Clock className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-sm">Estimated Arrival</p>
                    <p className="font-medium">{provider.estimatedArrival || '15-20 minutes'}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-gray-500 text-sm">Issue Description</p>
                <p className="font-medium">{requestDetails.description}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
              <div className="p-4 border border-gray-200 rounded-md">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Service Charge</span>
                  <span>₹{service.price || 1200}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Platform Fee</span>
                  <span>₹50</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>₹{(service.price || 1200) + 50}</span>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cash" 
                      defaultChecked 
                      className="h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2">Cash on Delivery</span>
                  </label>
                  
                  <label className="flex items-center opacity-50 cursor-not-allowed">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="online" 
                      disabled 
                      className="h-4 w-4"
                    />
                    <span className="ml-2">Online Payment (Coming Soon)</span>
                  </label>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Confirm Booking
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default BookInstantOrder;
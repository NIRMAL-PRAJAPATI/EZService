import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Send, AlertCircle, Loader2 } from 'lucide-react';
import authApi from '../config/auth-config';
import { io } from 'socket.io-client';
import Navbar from '../components/Navbar';

const InstantService = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    address: '',
    serviceType: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [offerAttempts, setOfferAttempts] = useState({});
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const socket = useRef(null);

  // Fetch service types and identify user on component mount
  useEffect(() => {
    // Initialize socket connection when component mounts
    socket.current = io('http://localhost:3000');
    console.log('Socket initialized on InstantService page');
    
    // Get user ID from local storage or auth context
    const token = localStorage.getItem('token');
    let userId = null;
    
    if (token) {
      try {
        // Extract user ID from token (simplified - use your actual token parsing logic)
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        userId = tokenData.id;
        
        // Identify as customer to socket server
        socket.current.emit('identify', {
          userType: 'customer',
          userId: userId
        });
      } catch (e) {
        console.error('Error parsing token:', e);
      }
    }
    
    authApi.get('/category/names')
      .then(response => {
        setServiceTypes(response.data);
      })
      .catch(error => {
        console.error('Error fetching service types:', error);
      });
      
    // Socket event listeners
    socket.current.on('connect', () => {
      console.log('Connected to socket server');
    });
    
    socket.current.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    socket.current.on('serviceOffer', (offer) => {
      console.log('Received service offer:', offer);
      
      // Check if this provider has reached max attempts for this service on this request
      if (currentRequestId && offer.provider?.id && offer.service?.id) {
        const providerId = offer.provider.id;
        const serviceId = offer.service.id;
        const attemptKey = `${providerId}_${serviceId}`;
        const requestAttempts = offerAttempts[currentRequestId] || {};
        const providerServiceAttempts = requestAttempts[attemptKey] || 0;

        console.log(attemptKey)
        console.log(providerServiceAttempts)
        console.log(requestAttempts)

        
        if (providerServiceAttempts >= 3) {
          // Provider has reached max attempts for this service, ignore this offer
          console.log(`Provider ${providerId} has reached max attempts for service ${serviceId} on request ${currentRequestId}`);
          
          // Notify provider they've reached max attempts
          socket.current.emit('offerRejected', {
            providerId,
            serviceId,
            requestId: currentRequestId,
            reason: 'MAX_ATTEMPTS_REACHED'
          });
          
          return;
        }
      }
      
      // Add offer to the list
      setOffers(prev => [...prev, offer]);
    });
    
    // Clean up function to disconnect socket when component unmounts
    return () => {
      if (socket.current) {
        console.log('Disconnecting socket on leaving InstantService page');
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, []);
  
  // Debug offers and ensure popup shows
  useEffect(() => {
    console.log('Current offers:', offers);
  }, [offers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Validate form
    if (!formData.address || !formData.serviceType || !formData.description) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }
    
    // Create service request
    authApi.post('/service-requests', formData)
      .then(response => {
        setLoading(false);
        setSearching(true);
        
        // Set current request ID
        const requestId = response.data.id;
        setCurrentRequestId(requestId);
        
        // Reset offer attempts for this request
        setOfferAttempts(prev => ({
          ...prev,
          [requestId]: {}
        }));
        
        // Emit socket event for new service request
        socket.current.emit('newServiceRequest', {
          requestId,
          ...formData,
        });
        
      })
      .catch(error => {
        console.error('Error creating service request:', error);
        setError('Failed to create service request. Please try again.');
        setLoading(false);
      });
  };

  const handleAcceptOffer = (offer) => {
    setSelectedOffer(offer);
    setShowConfirmation(true);
  };
  
  const handleConfirmOrder = () => {
    setConfirmLoading(true);
    
    // Create order object
    const orderData = {
      service_id: selectedOffer.service.id,
      provider_id: selectedOffer.provider.id,
      location: formData.address,
      issue: formData.description,
      date: new Date().toISOString(),
      estimated_charge: selectedOffer.price,
      status: 'CONFIRMED',
      request_id: currentRequestId
    };
    
    // Create order via API
    authApi.post('/orders', orderData)
      .then(response => {
        console.log('Order created successfully:', response.data);
        
        // Notify provider that offer was accepted
        socket.current.emit('offerAccepted', { 
          offerId: selectedOffer.id,
          providerId: selectedOffer.provider.id,
          requestId: currentRequestId
        });
        
        // Navigate to order details page
        navigate(`/orders/${response.data.order_id}/view`);
      })
      .catch(error => {
        console.error('Error creating order:', error);
        setError('Failed to create order. Please try again.');
        setConfirmLoading(false);
      });
  };

  const handleDeclineOffer = (offerId, providerId, serviceId) => {
    // Remove the offer from the list
    setOffers(prev => prev.filter(offer => offer.id !== offerId));
    
    // Track offer attempts for the current request and service
    if (currentRequestId && serviceId) {
      // Create a unique key for this provider+service combination
      const attemptKey = `${providerId}_${serviceId}`;
      const requestAttempts = offerAttempts[currentRequestId] || {};
      const providerServiceAttempts = requestAttempts[attemptKey] || 0;
      
      if (providerServiceAttempts >= 2) {
        // This is the 3rd attempt for this service, notify provider they've reached the limit
        socket.current.emit('offerDeclined', { 
          offerId, 
          providerId,
          serviceId,
          requestId: currentRequestId,
          maxAttemptsReached: true 
        });
      } else {
        // Update attempts count for this provider+service combination
        setOfferAttempts(prev => ({
          ...prev,
          [currentRequestId]: {
            ...prev[currentRequestId],
            [attemptKey]: providerServiceAttempts + 1
          }
        }));
        
        // Notify provider that offer was declined
        socket.current.emit('offerDeclined', { 
          offerId, 
          providerId,
          serviceId,
          requestId: currentRequestId,
          attemptsRemaining: 2 - providerServiceAttempts 
        });
      }
    } else {
      // Fallback if no current request ID or service ID
      socket.current.emit('offerDeclined', { offerId, providerId });
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto pt-20 px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Book an Instant Service</h1>
        
        {!searching ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a service type</option>
                  {serviceTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Your Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your full address"
                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Describe Your Issue <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Please describe your issue in detail"
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Submit Request
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="mb-8">
              <div className="radar-animation mx-auto">
                <div className="radar-circle"></div>
                <div className="radar-sweep"></div>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">Finding Service Providers...</h2>
            <p className="text-gray-600 mb-6">
              We're connecting you with available service providers in your area.
              This usually takes 1-3 minutes.
            </p>
            
            <div className="flex items-center justify-center">
              <Clock className="h-5 w-5 text-indigo-600 mr-2" />
              <span className="text-sm text-gray-500">Request sent at {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        )}
        
        {/* Offer popup */}
        {offers.length > 0 && !showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Service Offer Received!</h3>
              
              <div className="mb-4 p-4 border border-gray-200 rounded-md">
                <div className="flex items-center mb-2">
                  <img 
                    src={offers[0].provider?.avatar || "https://via.placeholder.com/40"} 
                    alt="Provider" 
                    className="h-10 w-10 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-medium">{offers[0].provider?.name || "Service Provider"}</h4>
                    <div className="flex items-center">
                      <span className="text-yellow-500">★★★★☆</span>
                      <span className="text-sm text-gray-500 ml-1">{offers[0].provider?.rating || "4.0"}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Service:</span> {offers[0].service?.name || "Instant Service"}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Price:</span> ₹{offers[0].price || "0"}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Estimated Arrival:</span> {offers[0].estimatedArrival || "Unknown"}
                </p>
                
                {currentRequestId && offers[0].provider?.id && offers[0].service?.id && (
                  <p className="text-xs text-gray-500 mt-2">
                    Offer {(offerAttempts[currentRequestId]?.[`${offers[0].provider.id}_${offers[0].service.id}`] || 0) + 1}/3
                  </p>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => handleDeclineOffer(offers[0].id, offers[0].provider?.id, offers[0].service?.id)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Decline
                </button>
                <button
                  onClick={() => handleAcceptOffer(offers[0])}
                  className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Order confirmation popup */}
        {showConfirmation && selectedOffer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Confirm Your Order</h3>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Service Details</h4>
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="flex items-center mb-3">
                    <img 
                      src={selectedOffer.provider?.avatar || "https://via.placeholder.com/40"} 
                      alt="Provider" 
                      className="h-12 w-12 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium">{selectedOffer.provider?.name || "Service Provider"}</p>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★★★★☆</span>
                        <span className="text-sm text-gray-500 ml-1">{selectedOffer.provider?.rating || "4.0"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Service:</span> {selectedOffer.service?.name || "Instant Service"}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Price:</span> ₹{selectedOffer.price || "0"}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Estimated Arrival:</span> {selectedOffer.estimatedArrival || "Unknown"}
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Order Summary</h4>
                <div className="p-4 bg-gray-50 rounded-md">
                  <p className="text-gray-700 mb-2">
                    <span className="font-medium">Address:</span> {formData.address}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Issue:</span> {formData.description}
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="p-3 border-t border-b border-gray-200">
                  <div className="flex justify-between font-medium">
                    <span>Total Amount:</span>
                    <span>₹{selectedOffer.price || "0"}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Payment will be collected after service completion</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmOrder}
                  disabled={confirmLoading}
                  className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {confirmLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2 inline" />
                      Processing...
                    </>
                  ) : (
                    'Confirm Order'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .radar-animation {
          position: relative;
          width: 200px;
          height: 200px;
        }
        
        .radar-circle {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid #4f46e5;
        }
        
        .radar-sweep {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(90deg, rgba(79, 70, 229, 0.3) 50%, transparent 50%);
          animation: rotate 3s infinite linear;
          transform-origin: center;
        }
        
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
};

export default InstantService;
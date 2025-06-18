import { useState, useEffect } from 'react';
import { Bell, Clock, MapPin, AlertCircle, Send, Loader2, X } from 'lucide-react';
import { io } from 'socket.io-client';
import authApi from '../config/auth-config';
import DashboardHeader from '../components/provider/Header';

// Initialize socket connection
const socket = io('http://localhost:3000');

const ProviderInstantRequests = () => {
  const [activeRequests, setActiveRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [offerData, setOfferData] = useState({
    price: '',
    estimatedArrival: '15-20 minutes'
  });
  const [offerAttempts, setOfferAttempts] = useState({});
  const [loading, setLoading] = useState(false);
  const [providerInfo, setProviderInfo] = useState(null);
  const [error, setError] = useState('');

  // Fetch provider info on component mount
  useEffect(() => {
    authApi.get('/provider/profile')
      .then(response => {
        setProviderInfo(response.data);
        
        // Identify as provider to socket server
        if (response.data && response.data.id) {
          socket.emit('identify', {
            userType: 'provider',
            userId: response.data.id
          });
        }
      })
      .catch(error => {
        console.error('Error fetching provider info:', error);
      });
      
    // Fetch active service requests
    authApi.get('/service-requests/active')
      .then(response => {
        setActiveRequests(response.data);
      })
      .catch(error => {
        console.error('Error fetching active requests:', error);
      });
      
    // Socket event listeners
    socket.on('connect', () => {
      console.log('Provider connected to socket server');
    });
    
    socket.on('newServiceRequest', (requestData) => {
      console.log('New service request received:', requestData);
      
      // Add to active requests
      setActiveRequests(prev => [requestData, ...prev]);
      
      // Add notification
      addNotification('New service request received!');
    });
    
    socket.on('offerAccepted', (data) => {
      console.log('Offer accepted:', data);
      addNotification('Your offer was accepted! Check your orders.');
    });
    
    socket.on('offerDeclined', (data) => {
      console.log('Offer declined:', data);
      
      // Track offer attempts
      setOfferAttempts(prev => {
        const requestId = data.requestId;
        const attempts = prev[requestId] ? prev[requestId] + 1 : 1;
        
        if (attempts < 3) {
          addNotification(`Your offer was declined. You can make ${3 - attempts} more offers.`);
        } else {
          addNotification('Your offer was declined. Maximum offer attempts reached.');
        }
        
        return { ...prev, [requestId]: attempts };
      });
    });
    
    return () => {
      socket.off('connect');
      socket.off('newServiceRequest');
      socket.off('offerAccepted');
      socket.off('offerDeclined');
    };
  }, []);
  
  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
      read: false,
      timestamp: new Date()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Play notification sound
    const audio = new Audio('/notification.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
  };
  
  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const handleRequestSelect = (request) => {
    setSelectedRequest(request);
    
    // Check if maximum offer attempts reached
    const attempts = offerAttempts[request.id] || 0;
    if (attempts >= 3) {
      addNotification('Maximum offer attempts reached for this request.');
      return;
    }
    
    // Fetch service details to get default price
    authApi.get(`/services/${request.serviceType}`)
      .then(response => {
        const serviceData = response.data;
        // Use instant_visiting_charge as default price
        const defaultPrice = serviceData.instant_visiting_charge || 1200;
        
        setOfferData({
          price: defaultPrice.toString(),
          estimatedArrival: '15-20 minutes'
        });
        
        setShowOfferForm(true);
      })
      .catch(error => {
        console.error('Error fetching service details:', error);
        // Fallback to empty price if service details can't be fetched
        setOfferData({
          price: '',
          estimatedArrival: '15-20 minutes'
        });
        setShowOfferForm(true);
      });
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOfferData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmitOffer = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!offerData.price) {
      setError('Please enter a price');
      setLoading(false);
      return;
    }
    
    // Create offer object
    const offer = {
      id: Math.random().toString(36).substring(7),
      provider: {
        id: providerInfo?.id,
        name: providerInfo?.name,
        avatar: providerInfo?.avatar,
        rating: providerInfo?.rating || 4.0
      },
      service: {
        id: selectedRequest.serviceType,
        name: 'Instant Service'
      },
      price: parseFloat(offerData.price),
      estimatedArrival: offerData.estimatedArrival
    };
    
    // Track offer attempt
    setOfferAttempts(prev => {
      const requestId = selectedRequest.id;
      const attempts = prev[requestId] ? prev[requestId] + 1 : 1;
      return { ...prev, [requestId]: attempts };
    });
    
    // Emit offer to customer
    socket.emit('serviceOffer', {
      requestId: selectedRequest.id,
      offer: {
        ...offer,
        requestId: selectedRequest.id
      }
    });
    
    // Reset form
    setLoading(false);
    setShowOfferForm(false);
    setSelectedRequest(null);
    setOfferData({
      price: '',
      estimatedArrival: '15-20 minutes'
    });
    
    // Add to notifications
    addNotification('Offer sent successfully!');
  };
  
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <DashboardHeader />
      <div className="max-w-7xl mx-auto pt-20 px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Instant Service Requests</h1>
          
          <div className="relative">
            <button className="p-2 bg-gray-100 rounded-full relative">
              <Bell className="h-6 w-6 text-gray-700" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
            
            {notifications.length > 0 && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 max-h-96 overflow-y-auto">
                <div className="p-3 border-b border-gray-200">
                  <h3 className="font-medium">Notifications</h3>
                </div>
                <div>
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-3 border-b border-gray-100 cursor-pointer ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeRequests.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No active service requests at the moment.</p>
              <p className="text-sm text-gray-400 mt-2">New requests will appear here automatically.</p>
            </div>
          ) : (
            activeRequests.map((request, index) => (
              <div key={request.id || index} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-indigo-500">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium">Service Request</h3>
                  <div className="flex items-center space-x-2">
                    {offerAttempts[request.id] && (
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {offerAttempts[request.id]}/3 offers
                      </span>
                    )}
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      New
                    </span>
                  </div>
                </div>
                
                <div className="mb-3 flex items-start">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{request.address}</p>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm font-medium mb-1">Issue Description:</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                    {request.description}
                  </p>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    {request.created ? new Date(request.created).toLocaleTimeString() : 'Just now'}
                  </span>
                </div>
                
                <button
                  onClick={() => handleRequestSelect(request)}
                  disabled={(offerAttempts[request.id] || 0) >= 3}
                  className={`w-full py-2 rounded-md transition-colors ${
                    (offerAttempts[request.id] || 0) >= 3
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {(offerAttempts[request.id] || 0) >= 3 ? 'Max Offers Reached' : 'Send Offer'}
                </button>
              </div>
            ))
          )}
        </div>
        
        {/* Offer Form Modal */}
        {showOfferForm && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Send Service Offer</h3>
                <button onClick={() => setShowOfferForm(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium mb-1">Customer Request:</p>
                <p className="text-sm">{selectedRequest.description}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{selectedRequest.address}</span>
                </div>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>{error}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmitOffer}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Your Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={offerData.price}
                    onChange={handleInputChange}
                    placeholder="Enter your price"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  
                  <div className="mt-2 flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setOfferData(prev => ({ ...prev, price: (parseInt(offerData.price) - 100).toString() }))}
                      className="flex-1 py-1 px-2 bg-gray-100 text-gray-700 text-sm rounded border border-gray-300 hover:bg-gray-200"
                    >
                      -₹100
                    </button>
                    <button
                      type="button"
                      onClick={() => setOfferData(prev => ({ ...prev, price: offerData.price }))}
                      className="flex-1 py-1 px-2 bg-indigo-100 text-indigo-700 text-sm rounded border border-indigo-300 hover:bg-indigo-200"
                    >
                      Default
                    </button>
                    <button
                      type="button"
                      onClick={() => setOfferData(prev => ({ ...prev, price: (parseInt(offerData.price) + 100).toString() }))}
                      className="flex-1 py-1 px-2 bg-gray-100 text-gray-700 text-sm rounded border border-gray-300 hover:bg-gray-200"
                    >
                      +₹100
                    </button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">
                    Estimated Arrival Time
                  </label>
                  <select
                    name="estimatedArrival"
                    value={offerData.estimatedArrival}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="5-10 minutes">5-10 minutes</option>
                    <option value="15-20 minutes">15-20 minutes</option>
                    <option value="30-45 minutes">30-45 minutes</option>
                    <option value="1 hour">1 hour</option>
                  </select>
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
                      Send Offer
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProviderInstantRequests;
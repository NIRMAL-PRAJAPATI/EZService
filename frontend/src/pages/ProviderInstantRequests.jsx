import { useState, useEffect, useRef } from 'react';
import { Bell, Clock, MapPin, AlertCircle, Send, Loader2, X } from 'lucide-react';
import { io } from 'socket.io-client';
import authApi from '../config/auth-config';
import DashboardHeader from '../components/provider/Header';
import api from '../config/axios-config';

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
  const [showNotifications, setShowNotifications] = useState(false);
  const socket = useRef(null);
 

  // Fetch provider info on component mount
  useEffect(() => {
    // Initialize socket connection when component mounts
    socket.current = io("https://ezservice.duckdns.org");
    console.log('Socket initialized on ProviderInstantRequests page');
    
    authApi.get('/provider/profile')
      .then(response => {
        setProviderInfo(response.data);
        
        // Identify as provider to socket server
        if (response.data && response.data.id && socket.current) {
          socket.current.emit('identify', {
            userType: 'provider',
            userId: response.data.id
          });
        }
      })
      .catch(error => {
        console.error('Error fetching provider info:', error);
      });
      
    authApi.get('/provider/services')
      .then(async (response) => {
        const services_ = await response.data.map(service => service.id)
        if (socket.current) {
          socket.current.emit('providerJoin', services_)
        }
      })

    // Fetch active service requests
    authApi.get('/service-requests/active')
      .then(response => {
        setActiveRequests(response.data);
      })
      .catch(error => {
        console.error('Error fetching active requests:', error);
      });
      
    // Socket event listeners
    if (socket.current) {
      socket.current.on('connect', () => {
        console.log('Provider connected to socket server');
      });
      
      socket.current.on('newServiceRequest', (requestData) => {
        console.log('New service request received:', requestData);
        
        // Add to active requests
        setActiveRequests(prev => [requestData, ...prev]);
        
        // Add notification
        addNotification('New service request received!');
      });
      
      socket.current.on('offerAccepted', (data) => {
        console.log('Offer accepted:', data);
        setActiveRequests(prev => prev.filter(request => request.id !== data.requestId))
        addNotification('Your offer was accepted! Check your orders.');
        
      });
      
      socket.current.on('offerDeclined', (data) => {
        console.log('Offer declined:', data);
        
        // Track offer attempts per service
        setOfferAttempts(prev => {
          const requestId = data.requestId;
          const serviceId = data.serviceId;
          
          if (!requestId || !serviceId) {
            return prev;
          }
          
          // Create a unique key for this request+service combination
          const attemptKey = `${requestId}_${serviceId}`;
          const attempts = prev[attemptKey] ? prev[attemptKey] + 1 : 1;
          
          if (attempts < 3) {
            addNotification(`Your offer was declined. You can make ${3 - attempts} more offers for this service.`);
          } else {
            addNotification('Your offer was declined. Maximum offer attempts reached for this service.');
          }
          
          return { ...prev, [attemptKey]: attempts };
        });
      });
    }
    
    // Clean up function to disconnect socket when component unmounts
    return () => {
      if (socket.current) {
        console.log('Disconnecting socket on leaving ProviderInstantRequests page');
        socket.current.off('connect');
        socket.current.off('newServiceRequest');
        socket.current.off('offerAccepted');
        socket.current.off('offerDeclined');
        socket.current.disconnect();
        socket.current = null;
      }
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
  
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  
  const handleRequestSelect = (request) => {
    setSelectedRequest(request);
    
    // Check if maximum offer attempts reached for this service
    const serviceId = request.serviceType;
    const attemptKey = `${request.id}_${serviceId}`;
    const attempts = offerAttempts[attemptKey] || 0;
    
    if (attempts >= 3) {
      addNotification('Maximum offer attempts reached for this service request.');
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
    
    // Track offer attempt per service
    setOfferAttempts(prev => {
      const requestId = selectedRequest.id;
      const serviceId = selectedRequest.serviceType;
      const attemptKey = `${requestId}_${serviceId}`;
      const attempts = prev[attemptKey] ? prev[attemptKey] + 1 : 1;
      return { ...prev, [attemptKey]: attempts };
    });
    
    // Emit offer to customer
    if (socket.current) {
      socket.current.emit('serviceOffer', {
        requestId: selectedRequest.id,
        offer: {
          ...offer,
          requestId: selectedRequest.id
        }
      });
    }
    
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
      <div className="max-w-7xl mx-auto pt-18 px-4 py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold -mt-3">Instant Service Requests</h1>
          
          <div className="relative">
            <button 
              className="p-2 bg-gray-100 rounded-full relative mb-2"
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) {
                  markAllNotificationsAsRead();
                }
              }}
            >
              <Bell className="h-6 w-6 text-gray-700" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
            
            {showNotifications && notifications.length > 0 && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 max-h-96 overflow-y-auto">
                <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-medium">Notifications</h3>
                  <button 
                    onClick={() => setNotifications([])}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    Clear All
                  </button>
                </div>
                <div>
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-3 border-b border-gray-100 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
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
              <div key={request.id || index} className="bg-white rounded-sm shadow-md p-4 border border-gray-300 overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                  <div className='-mt-2'>
                    <p className='text-xs text-gray-500'>send by: </p>
                  <h3 className="font-medium -mt-1">Nirmal Prajapati</h3>
                  </div>
                  <div className="flex items-center space-x-2 -mt-2">
                    {request.id && request.serviceType && offerAttempts[`${request.id}_${request.serviceType}`] && (
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {offerAttempts[`${request.id}_${request.serviceType}`]}/3 offers
                      </span>
                    )}
                    <span className="tracking-wider bg-indigo-100 px-2 py-1 rounded-bl-lg -mt-3 -mr-4 font-semibold text-indigo-800 text-xs">
                      New
                    </span>
                  </div>
                </div>
                
                <div className="mb-3 flex items-start">
                  <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{request.address}</p>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm font-medium mb-1">Issue Description:</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                    {request.description}
                  </p>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    {request.created ? new Date(request.created).toLocaleTimeString() : 'Just now'}
                  </span>
                </div>
                
                <button
                  onClick={() => handleRequestSelect(request)}
                  disabled={(offerAttempts[`${request.id}_${request.serviceType}`] || 0) >= 3}
                  className={`w-full py-2 rounded-sm transition-colors ${
                    (offerAttempts[`${request.id}_${request.serviceType}`] || 0) >= 3
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-500 text-white hover:bg-indigo-600'
                  }`}
                >
                  {(offerAttempts[`${request.id}_${request.serviceType}`] || 0) >= 3 ? 'Max Offers Reached' : 'Send Offer'}
                </button>
              </div>
            ))
          )}
        </div>
        
        {/* Offer Form Modal */}
        {showOfferForm && selectedRequest && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 h-full">
            <div className="bg-white rounded-sm shadow-xl p-6 w-full max-w-lg overflow-y-auto max-h-[95vh]">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">Send Service Offer</h3>
                <button onClick={() => setShowOfferForm(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-7 w-7 -mr-2 -mt-3" />
                </button>
              </div>
              
                <p className="text-sm font-medium mb-1 tracking-wide">To: Requester Name</p>
              <table className="w-full text-sm text-left text-gray-700 border border-gray-300">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <th className="px-2 py-1.5 font-medium text-gray-900 bg-gray-100 w-1/4">Service&nbsp;for</th>
                      <td className="px-2 py-1.5">Service name</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="px-2 py-1.5 font-medium text-gray-900 bg-gray-100">Address</th>
                      <td className="px-2 py-1.5">{selectedRequest.address}</td>
                    </tr>
                    <tr>
                      <th className="px-2 py-1.5 font-medium text-gray-900 bg-gray-100">Issue</th>
                      <td className="px-2 py-1.5">{selectedRequest.description}</td>
                    </tr>
                  </tbody>
                </table>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>{error}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmitOffer}>
                <div className="my-4">
                  <label className="block text-sm font-medium mb-1">
                    Your Visiting Charge <span className="text-red-500">*</span>
                  </label>
                  <div className='flex border border-gray-300 rounded'>
                    <p className='py-1.5 px-4 bg-gray-100 text-xl text-indigo-500 font-bold'>₹</p>
                  <input
                    type="number"
                    name="price"
                    value={offerData.price}
                    onChange={handleInputChange}
                    placeholder="Enter your price"
                    className="w-full ml-2 outline-none rounded-md focus:outline-none"
                    required
                  />
                  </div>
                  
                  <div className="mt-2 flex space-x-1.5 font-semibold tracking-wide">
                    <button
                      type="button"
                      onClick={() => setOfferData(prev => ({ ...prev, price: (parseInt(offerData.price) - 100).toString() }))}
                      className="flex-1 py-2 px-2 bg-gray-100 text-gray-700 text-sm rounded border border-gray-300 hover:bg-gray-200"
                    >
                      -₹100
                    </button>
                    <button
                      type="button"
                      onClick={() => setOfferData(prev => ({ ...prev, price: (parseInt(offerData.price) - 100).toString() }))}
                      className="flex-1 py-2 px-2 bg-gray-100 text-gray-700 text-sm rounded border border-gray-300 hover:bg-gray-200"
                    >
                      -₹50
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
                      className="flex-1 py-2 px-2 bg-gray-100 text-gray-700 text-sm rounded border border-gray-300 hover:bg-gray-200"
                    >
                      +₹50
                    </button>
                    <button
                      type="button"
                      onClick={() => setOfferData(prev => ({ ...prev, price: (parseInt(offerData.price) + 100).toString() }))}
                      className="flex-1 py-2 px-2 bg-gray-100 text-gray-700 text-sm rounded border border-gray-300 hover:bg-gray-200"
                    >
                      +₹100
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Estimated Arrival Time
                  </label>
                  <select
                    name="estimatedArrival"
                    value={offerData.estimatedArrival}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="5-10 minutes">5-10 minutes</option>
                    <option value="15-20 minutes">15-20 minutes</option>
                    <option value="30-45 minutes">30-45 minutes</option>
                    <option value="1 hour">1 hour</option>
                  </select>
                </div>

                <div className='text-sm flex gap-2 my-4'>
                  <input type='checkbox' name='confirm'></input>
                  <label>I confirm that all details have been verified and the request is ready to be submitted</label>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Offer Request
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
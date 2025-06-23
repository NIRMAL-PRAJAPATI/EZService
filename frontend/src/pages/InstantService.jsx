import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Send, AlertCircle, Loader2, Info, MapPinned, Plug, Car, LibraryBig, PartyPopper, Wrench, ArrowDownFromLine } from 'lucide-react';
import authApi from '../config/auth-config';
import { io } from 'socket.io-client';
import Lottie from 'lottie-react';
import providerFindAnimation from '../assets/animation2.json';

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
    socket.current = io('http://ec2-43-204-112-76.ap-south-1.compute.amazonaws.com');
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
        if (socket.current) {
          socket.current.emit('newServiceRequest', {
            requestId,
            ...formData,
          });
        }
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
        if (socket.current) {
          socket.current.emit('offerAccepted', {
            offerId: selectedOffer.id,
            providerId: selectedOffer.provider.id,
            requestId: currentRequestId
          });
        }

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
    if (currentRequestId && serviceId && socket.current) {
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
    } else if (socket.current) {
      // Fallback if no current request ID or service ID
      socket.current.emit('offerDeclined', { offerId, providerId });
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className="max-w-4xl mx-auto px-4 py-3">
        {!searching ? (
          <div className="bg-white rounded-lg">
            <h1 className="text-3xl font-bold text-center mb-8">Find an Instant Service</h1>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className='tracking-wide'>
              <div className="mb-4 relative">
                <label className="absolute left-3 flex -top-3 bg-white px-1 text-sm font-medium text-indigo-500"><Wrench className="mr-1" size={18} />Select Service Type</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="block w-full pl-3 pr-3 py-3 text-lg md:text-sm text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required>
                  <option value="">Select a service type</option>
                  {serviceTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4 relative">
                <label className="absolute left-3 flex -top-3 bg-white px-1 text-sm font-medium text-indigo-500"><MapPin className="mr-1" size={18} />Residential Address</label>
                <textarea
                  rows={3}
                  placeholder="Enter your address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="block w-full pl-4 pr-3 py-3 text-lg md:text-sm text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required
                />
              </div>

              <div className='sm:flex gap-2'>
                <div className="mb-4 relative w-full">
                  <label className="absolute left-3 -top-3 bg-white px-1 text-sm font-medium text-indigo-500">City / Town</label>
                  <input
                    type="text"
                    name="country"
                    className="block w-full pl-4 pr-3 py-3 text-lg md:text-sm text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="mb-4 relative w-full">
                  <label className="absolute left-3 -top-3 bg-white px-1 text-sm font-medium text-indigo-500">State</label>
                  <input
                    type="text"
                    name="state"
                    className="block w-full pl-4 pr-3 py-3 text-lg md:text-sm text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="mb-4 relative w-full">
                  <label className="absolute left-3 -top-3 bg-white px-1 text-sm font-medium text-indigo-500">Country</label>
                  <input
                    type="text"
                    name="country"
                    className="block w-full pl-4 pr-3 py-3 text-lg md:text-sm text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="mb-4 relative">
                <label className="absolute left-3 flex -top-3 bg-white px-1 text-sm font-medium text-indigo-500"><Info className="mr-1" size={18} />Describe Your Issue</label>
                <textarea
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder='You want to find the service for your issue, like "AC not cooling" or "plumbing issue"'
                  className="block w-full pl-4 pr-3 py-3 text-lg md:text-sm text-gray-800 border border-gray-300 rounded-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-500 text-white py-3 px-4 rounded-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center"
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
            <section className="text-gray-800 py-5 px-auto">
              <h5 className='font-bold'>How process goes</h5>
              <ul className='list-disc pl-3 space-y-2 mt-2 text-sm'>
                <li className=''><span className='font-semibold'>Tell Us What You Need - </span>Choose a service, enter your address, and describe your issue.</li>
                <li className=''><span className='font-semibold'>We Find Nearby Experts - </span>Our system searches for available service providers in your area.</li>
                <li className=''><span className='font-semibold'>Wait for Provider Acceptance - </span>A nearby provider reviews your request and accepts the job.</li>
                <li className=''><span className='font-semibold'>You Confirm the Provider - </span>Once a provider accepts, you review their details and confirm.
                </li>
                <li className=''><span className='font-semibold'>Service Request Placed! - </span>Your request is confirmed, the provider will be come as soon as possible!</li>
              </ul>
            </section>

          </div>
        ) : (
          <div className="text-center">
            <div className="absolute inset-0 z-0 h-full w-full sm:items-center sm:justify-center overflow-hidden left-0 right-0 mx-auto bottom-0 z-0">

              <div className="text-gray-500 overflow-hidden z-0 opacity-40 hidden md:block">
                <Plug className="absolute top-24 left-60 rotate-[330deg] z-0" />
                <Car className="absolute top-[400px] left-[30vw] rotate-[330deg] z-0" />
                <LibraryBig className="absolute top-[500px] right-20 z-0" />
                <Wrench className="absolute top-[500px] left-40 rotate-[10deg] z-0" />
                <PartyPopper className="absolute top-[150px] right-[20%] z-0" />
              </div>

              <Lottie animationData={providerFindAnimation} loop={true} className='opacity-100 sm:opacity-30' />
            </div>

            <div className='relative z-50 tracking-wide'>
              <MapPinned className='text-indigo-500 mt-1 mr-2 h-10 w-full justify-center items-center' />
              <h2 className="text-2xl sm:text-4xl text-gray-800 font-bold mb-4">Finding Service Providers...</h2>
              <p className="text-gray-700 mb-6 text-lg">
                We're connecting you with available service providers in your area.
                This usually takes 1-3 minutes.
              </p>

              <div className="flex items-center justify-center mb-6">
                <Clock className="h-5 w-5 text-indigo-600 mr-2" />
                <span className="text-gray-600">Request sent at {new Date().toLocaleTimeString()}</span>
              </div>

              <button
                onClick={() => {
                  // Disconnect socket
                  if (socket.current) {
                    socket.current.disconnect();
                    socket.current = null;
                  }
                  // Redirect to home page
                  navigate('/');
                }}
                className="px-6 py-3 bg-red-50 border border-red-500 text-red-600 hover:text-white tracking-wide rounded-md hover:bg-red-500 transition-colors z-30"
              >
                Stop Find Request
              </button>
            </div>
          </div>
        )}

        {/* Offer popup */}
        {offers.length > 0 && !showConfirmation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-sm shadow-xl p-6 w-full max-w-md m-1">
              
              <div className='flex justify-between'>
              <h3 className="text-xl font-semibold mb-2">Service Offer Received!</h3>{currentRequestId && offers[0].provider?.id && offers[0].service?.id && (
                  <p className="text-xs text-gray-500 mt-2 ml-4">
                    {(offerAttempts[currentRequestId]?.[`${offers[0].provider.id}_${offers[0].service.id}`] || 0) + 1}/3
                  </p>
                )}
                </div>

              <div className="mb-4 pt-3 border border-gray-200 rounded-md">
                <div className="flex items-center mb-2 ml-4">
                  <img
                    src={offers[0].provider?.avatar || "https://via.placeholder.com/40"}
                    alt="Provider"
                    className="h-10 w-10 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-medium -mb-1">{offers[0].provider?.name || "Service Provider"}</h4>
                    <div className="flex items-center">
                      <span className="text-indigo-500">★★★★☆</span>
                      <span className="text-sm text-gray-500 ml-1">{offers[0].provider?.rating || "4.0"}</span>
                    </div>
                  </div>
                </div>

                <table className="w-full text-sm text-left text-gray-700">
                  <tbody>
                    <tr className="border-b border-t border-gray-300">
                      <th className="px-3 py-2 font-medium text-gray-900 bg-gray-100 w-1/3">Service</th>
                      <td className="px-3 py-2">{offers[0].service?.name || "Instant Service"}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="px-3 py-2 font-medium text-gray-900 bg-gray-100">Visiting Charge</th>
                      <td className="px-3 py-2">₹{offers[0].price || "0"}</td>
                    </tr>
                    <tr>
                      <th className="px-3 py-2 font-medium text-gray-900 bg-gray-100">Estimated Arrival</th>
                      <td className="px-3 py-2">{offers[0].estimatedArrival || "Unknown"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleDeclineOffer(offers[0].id, offers[0].provider?.id, offers[0].service?.id)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50"
                >
                  Decline
                </button>
                <button
                  onClick={() => handleAcceptOffer(offers[0])}
                  className="flex-1 py-2 px-4 bg-indigo-500 text-white rounded-sm hover:bg-indigo-600"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Order confirmation popup */}
        {showConfirmation && selectedOffer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-sm px-1 py-6 w-full max-w-md overflow-y-auto max-h-[95vh]">
              <h3 className="text-xl text-indigo-500 font-bold mb-4 ml-5">Confirm Your Order</h3>

              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2 ml-3">Service Details</h4>
                <div className="pt-3 bg-gray-50">
                  <div className="flex items-center mb-2 ml-4">
                    <img
                      src={selectedOffer.provider?.avatar || "https://via.placeholder.com/40"}
                      alt="Provider"
                      className="h-12 w-12 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium">{selectedOffer.provider?.name || "Service Provider"}</p>
                      <div className="flex items-center">
                        <span className="text-yellow-500 -mt-1">★★★★☆</span>
                        <span className="text-sm text-gray-500 ml-1">{selectedOffer.provider?.rating || "4.0"}</span>
                      </div>
                    </div>
                  </div>

                  <table className="w-full text-sm text-left text-gray-700">
                  <tbody>
                    <tr className="border-b border-t border-gray-300">
                      <th className="px-3 py-2 font-medium text-gray-900 bg-gray-100 w-1/3">Service</th>
                      <td className="px-3 py-2">{selectedOffer.service?.name || "Instant Service"}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="px-3 py-2 font-medium text-gray-900 bg-gray-100">Visiting Charge</th>
                      <td className="px-3 py-2">₹{selectedOffer.price || "0"}</td>
                    </tr>
                    <tr className='border-b border-gray-300'>
                      <th className="px-3 py-2 font-medium text-gray-900 bg-gray-100">Estimated Arrival</th>
                      <td className="px-3 py-2">{selectedOffer.estimatedArrival || "Unknown"}</td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2 ml-3">Order Summary</h4>
                <table className="w-full text-sm text-left text-gray-700 bg-gray-50">
                  <tbody>
                    <tr className="border-b border-t border-gray-300">
                      <th className="px-3 py-2 font-medium text-gray-900 bg-gray-100 w-1/3">Address</th>
                      <td className="px-3 py-2">{formData.address}</td>
                    </tr>
                    <tr className="border-b border-gray-300">
                      <th className="px-3 py-2 font-medium text-gray-900 bg-gray-100">Issue</th>
                      <td className="px-3 py-2">{formData.description}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <ArrowDownFromLine  className='justify-center w-full text-indigo-500'/>

              <div className="my-4">
                <div className="p-3 border-t border-b border-gray-200">
                  <div className="flex justify-between font-semibold text-gray-800">
                    <span>Total Amount</span>
                    <span className='text-xl'>₹{selectedOffer.price || "0"}</span>
                  </div>
                  <p className="text-xs text-gray-500 -mt-1">Payment will be collected after service completion</p>
                </div>
              </div>

              <div className="flex space-x-2 tracking-wide px-2">
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
    </div>
  );
};

export default InstantService;
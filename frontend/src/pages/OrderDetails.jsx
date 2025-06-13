"use client"

import { Box, Contact, CreditCardIcon, Home, LucideTimerReset, Store, Timer } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import api from "../config/axios-config"
import Loading from "../components/Loading"

export default function OrderDetails() {
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showDateDialog, setShowDateDialog] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [cancelReason, setCancelReason] = useState("")
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [orderData, setOrderData] = useState({})
  const {id} = useParams()
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    api.get(`/orders/${id}`).then((res)=>{
      console.log(res.data)
      setOrderData(res.data)
    }).catch((err)=>{
      console.log(err)
    }).finally(()=>{
      setLoading(false)
    })
  },[])

  const handleCancelOrder = () => {
    setOrder({
      ...order,
      status: "cancelled",
    })
    setShowCancelDialog(false)
    setAlertMessage("Order has been successfully cancelled")
    setShowSuccessAlert(true)
    setTimeout(() => setShowSuccessAlert(false), 5000)
  }

  const getStatusBadge = (status) => {
    const baseStyle = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    switch (status) {
      case "pending":
        return <span className={`${baseStyle} bg-amber-500 text-white`}>Processing</span>
      case "fulfilled":
        return <span className={`${baseStyle} bg-indigo-500 text-white`}>Fullfilled</span>
        case "cancelled":
          return <span className={`${baseStyle} bg-red-500 text-white`}>Cancelled</span>
      default:
        return <span className={`${baseStyle} bg-gray-500 text-white`}>Unknown</span>
    }
  }

  if(loading)
    return <Loading />

  return (
    <div className="bg-gray-100">
    <div className="container mx-auto pb-5 pt-3 px-2">
      {showSuccessAlert && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center">
            <span className="h-4 w-4 text-green-600 mr-2">✔</span>
            <div>
              <h3 className="text-green-800 font-semibold">Success</h3>
              <p className="text-green-700">{alertMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
        <div>
          <h1 className="text-xl font-bold">{orderData.id}</h1>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          {orderData.status !== "cancelled" && (
            <>
              <button
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => setShowDateDialog(true)}
              >
                Edit Delivery Time
              </button>
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-700"
                onClick={() => setShowCancelDialog(true)}
              >
                Cancel Order
              </button>
            </>
          )}
        </div>
      </div>

      {/* Date Dialog */}
      {showDateDialog && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold">Update Delivery Time</h2>
            <p className="text-sm text-gray-500 mt-1">
              Choose a new date and time for your delivery.
            </p>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Delivery Date</label>
                <div className="relative">
                  <button
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-normal text-gray-700 bg-white hover:bg-gray-50 w-full justify-start"
                    onClick={() => setShowDatePicker(!showDatePicker)}
                  >
                    <span className="mr-2">📅</span>
                    {selectedDate ? selectedDate : "Select date"}
                  </button>
                  {showDatePicker && (
                    <div className="absolute mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-4 z-10">
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={selectedDate.toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Delivery Time</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                >
                  <option value="09:00">9:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => setShowDateDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-400"
              >
                Update Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold">Cancel Order</h2>
            <p className="text-sm text-gray-500 mt-1">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Reason for cancellation (optional)</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                >
                  <option value="">Select a reason</option>
                  <option value="changed_mind">Changed my mind</option>
                  <option value="found_better_price">Found a better price elsewhere</option>
                  <option value="delivery_too_long">Delivery time too long</option>
                  <option value="ordered_by_mistake">Ordered by mistake</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                onClick={() => setShowCancelDialog(false)}
              >
                Go Back
              </button>
              <button
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-400"
                onClick={handleCancelOrder}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-1">
        {/* Order Summary and Status */}
        <div className="bg-white border border-gray-200 rounded-lg lg:col-span-3 col-span-3">
          <div className="px-6 pt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Order Status</h2>
              {getStatusBadge(orderData.status)}
            </div>
          </div>
          <div className="px-6 pb-6 pt-2">
            <div className="flex flex-col md:flex-row gap-4 md:gap-12">
              <div className="flex items-start gap-3">
                <Timer className="h-6 w-6 text-indigo-500 mt-3" />
                <div>
                  <p className="font-medium">Service Booked on</p>
                  <p className="text-sm text-gray-500">{orderData.date}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <LucideTimerReset className="h-6 w-6 text-indigo-500 mt-3" />
                <div>
                  <p className="font-medium">Service Delivery time</p>
                  <p className="text-sm text-gray-500">
                    {orderData.date}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCardIcon className="h-6 w-6 text-indigo-500 mt-3" />
                <div>
                  <p className="font-medium">Payment Method</p>
                  <p className="text-sm text-gray-500">
                    {orderData?.payment?.method} ending in {orderData?.payment?.cardLast4}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 mt-2">
                <div className="flex">
                  <p className="font-medium mr-2">Issue:</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {orderData.issue}
                  </p>
                </div>
              </div>
          </div>
        </div>


        {/* Order Summary */}
        <div className="bg-white border border-gray-200 rounded-lg col-span-3 lg:col-span-1">
          <div className="px-6 py-4">
            <h2 className="text-lg font-semibold">Order Summary</h2>
          </div>
          <div className="px-6 pb-5">
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-gray-500">Subtotal</p>
                <p>₹{parseFloat(orderData?.subtotal || 0).toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500">Plateform Charge</p>
                <p>₹{parseFloat(orderData?.shipping || 0).toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500">Tax</p>
                <p>₹{parseFloat(orderData?.tax || 0).toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-500">Visiting Charge</p>
                <p>₹{parseFloat(orderData?.Service?.visiting_charge || orderData?.Service?.instant_visiting_charge  || 0).toFixed(2)}</p>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-medium">
                <p>Total</p>
                <p>₹{parseFloat(orderData?.total || 0).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* provider information */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-lg  col-span-3 lg:col-span-2">
          <div className="px-6 py-4">
            <h2 className="text-lg font-semibold">Provider Details</h2>
          </div>
          <div className="px-6 pb-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <h3 className="font-medium flex">{orderData?.ProviderInfo?.name}</h3>
                <p className="text-sm text-gray-700 tracking-wide">{orderData?.ProviderInfo?.address}</p>
                <p className="text-sm text-gray-700">{orderData?.ProviderInfo?.mobile}</p>
              </div>
              <div>
                <h3 className="font-medium flex"><Store className="text-indigo-500 h-4 w-4 mr-1 mt-1" /> Shop Address</h3>
                <div className="items-start gap-2 text-gray-700">
                    <p>{orderData?.ProviderInfo?.address}</p>
                </div>
              </div>
            </div>
            <Link to={`/service/${orderData?.Service?.id}`} className="hover:text-gray-500 cursor-pointer mt-3 text-indigo-500 text-xs">Open Profile</Link>
          </div>
        </div>

        {/* Customer Information */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-lg col-span-3 lg:col-span-2">
          <div className="px-6 py-4">
            <h2 className="text-lg font-semibold">Your Details</h2>
          </div>
          <div className="px-6 pb-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <h3 className="font-medium flex"><Contact className="text-indigo-500 h-4 w-4 mr-1 mt-1" /> Contact Information</h3>
                <p>{orderData?.CustomerInfo?.name}</p>
                <p className="text-sm text-gray-700">{orderData.CustomerInfo?.email}</p>
                <p className="text-sm text-gray-700">{orderData.CustomerInfo?.phone}</p>
              </div>
              <div>
                <h3 className="font-medium flex"><Home className="text-indigo-500 h-4 w-4 mr-1 mt-1" /> Service Address</h3>
                <div className="items-start gap-2 text-gray-700">
                    <p>{orderData?.location} </p>
                    <button className="hover:text-gray-500 cursor-pointer mt-3 text-indigo-500 text-xs">Change Address</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Need Help */}
        <div className="bg-white border border-gray-200 rounded-lg col-span-3 lg:col-span-1">
          <div className="px-6 py-4">
            <h2 className="text-lg font-semibold">Need Help?</h2>
          </div>
          <div className="p-6 space-y-2">
            <p className="text-sm">
              If you have any questions or concerns about your order, please contact our customer support team.
            </p>
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 w-full justify-center"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus, Check, CalendarIcon, ChevronDown, Info } from "lucide-react"
import { format } from "date-fns"

const BookOrderPage = () => {
  const [step, setStep] = useState(1)
  const [date, setDate] = useState()
  const [time, setTime] = useState("")
  const [addressOption, setAddressOption] = useState("existing-1")
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)
  const calendarRef = useRef(null)
  const timeDropdownRef = useRef(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false)
      }
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target)) {
        setShowTimeDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const existingAddresses = [
    {
      id: 1,
      name: "Home",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
      isDefault: true,
    },
    {
      id: 2,
      name: "Office",
      street: "456 Business Ave",
      city: "New York",
      state: "NY",
      zip: "10002",
      country: "USA",
      isDefault: false,
    },
  ]

  const bookDetails = {
    title: "Ananta Plumbing Service",
    author: "Ananta Services",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsptzDjvtAQGO2VhhxrjCeh8hAZ-Q2182Lqw&s",
    price: 500,
    quantity: 1,
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      setIsOrderConfirmed(true)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleAddNewAddress = () => {
    setShowNewAddressForm(true)
  }

  const handleCancelNewAddress = () => {
    setShowNewAddressForm(false)
    setAddressOption("existing-1")
  }

  const timeSlots = [
    "9:00 AM - 11:00 AM",
    "11:00 AM - 1:00 PM",
    "1:00 PM - 3:00 PM",
    "3:00 PM - 5:00 PM",
    "5:00 PM - 7:00 PM",
  ]

  // Simple calendar implementation
  const generateCalendarDays = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const days = []
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()

    // Get first day of month
    const firstDay = new Date(currentYear, currentMonth, 1)
    const startingDay = firstDay.getDay() // 0 = Sunday, 1 = Monday, etc.

    // Get number of days in month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

    // Fill in days
    for (let i = 0; i < startingDay; i++) {
      days.push(null) // Empty cells for days before the 1st
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(currentYear, currentMonth, i)
      days.push({
        date: dayDate,
        day: i,
        disabled: dayDate < today,
      })
    }

    return days
  }

  return (
    <div className="max-w-4xl px-2 py-5 md:mx-auto">

      {!isOrderConfirmed ? (
        <>
        {/* 1 to 4 process steps */}
          <div className="mx-5 mb-3">
            <div className="flex justify-between items-center mb-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`flex items-center ${i < 4 ? "flex-1" : ""}`}>
                  <div
                    className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${
                      i <= step ? "bg-indigo-500 text-white border-indigo-500" : "bg-gray-100 border-gray-300"
                    }`}
                  >
                    {i < step ? <Check className="h-5 w-5" /> : i}
                  </div>
                  {i < 4 && <div className={`h-1 flex-1 ${i < step ? "bg-indigo-500" : "bg-gray-300"}`}></div>}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm -mt-1">
              <span>Delivery</span>
              <span>Address</span>
              <span>Payment</span>
              <span>Confirm</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-300 mb-6 overflow-hidden">
            <div className="p-4 border-b border-gray-300">
              <h2 className="text-xl font-semibold">Selected Service</h2>
            </div>
            <div className="p-4">
              <div className="flex gap-4">
                <img
                  src={bookDetails.cover || "/placeholder.svg"}
                  alt={bookDetails.title}
                  className="h-[100px] w-[100px] object-cover rounded"
                />
                <div className="w-full">
                  <h3 className="font-bold text-lg">{bookDetails.title}</h3>
                  <p className="text-gray-600 text-sm -mt-1 mb-2">by {bookDetails.author}</p>
                      <span className="font-bold text-indigo-500 text-xl">₹{(bookDetails.price * bookDetails.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              <div className="p-4 border-b border-gray-300">
                <h2 className="text-xl font-semibold">Delivery Information</h2>
                <p className="text-gray-600 text-sm">Choose when you'd like your book to be delivered</p>
              </div>

              <div className="p-4 space-y-4">
                {/* delivery date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Delivery Date</label>
                  <div className="relative" ref={calendarRef}>
                    <button
                      type="button"
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-md text-left"
                    >
                      <span className={date ? "text-black" : "text-gray-500"}>
                        {date ? format(date, "PPP") : "Select a date"}
                      </span>
                      <CalendarIcon className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* delivery time */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Delivery Time</label>
                  <div className="relative" ref={timeDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                      className="w-full flex justify-between items-center px-3 py-2 border border-gray-300 rounded-md text-left"
                    >
                      <span className={time ? "text-black" : "text-gray-500"}>{time || "Select a time slot"}</span>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </button>

                    {showTimeDropdown && (
                      <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg w-full">
                        <ul className="py-1 max-h-60 overflow-auto">
                          {timeSlots.map((slot) => (
                            <li key={slot}>
                              <button
                                type="button"
                                className={`w-full text-left px-3 py-2 hover:bg-blue-50 ${time === slot ? "bg-blue-50 text-blue-600" : ""}`}
                                onClick={() => {
                                  setTime(slot)
                                  setShowTimeDropdown(false)
                                }}
                              >
                                {slot}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4 flex justify-end">
                <button
                  onClick={handleNext}
                  disabled={!time}
                  className={`flex items-center px-4 py-2 rounded-md ${
                     !time
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-500 text-white hover:bg-indigo-400"
                  }`}
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              <div className="p-4 border-b border-gray-300">
                <h2 className="text-xl font-semibold">Shipping Address</h2>
                <p className="text-gray-600 text-sm">Select a delivery address or add a new one</p>
              </div>
              <div className="p-4 space-y-4">
                {!showNewAddressForm ? (
                  <>
                    <div className="space-y-4">
                      {existingAddresses.map((address) => (
                        <div key={address.id} className="flex items-start space-x-2">
                          <input
                            type="radio"
                            id={`address-${address.id}`}
                            name="address"
                            value={`existing-${address.id}`}
                            checked={addressOption === `existing-${address.id}`}
                            onChange={(e) => setAddressOption(e.target.value)}
                            className="mt-1"
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label htmlFor={`address-${address.id}`} className="font-medium">
                              {address.name}{" "}
                              {address.isDefault && <span className="text-xs text-gray-500">(Default)</span>}
                            </label>
                            <p className="text-sm text-gray-600">
                              {address.street}, {address.city}, {address.state} {address.zip}, {address.country}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-start space-x-2">
                        <input
                          type="radio"
                          id="new-address"
                          name="address"
                          value="new"
                          checked={addressOption === "new"}
                          onChange={(e) => setAddressOption(e.target.value)}
                          className="mt-1"
                        />
                        <label htmlFor="new-address" className="font-medium">
                          Add a new address
                        </label>
                      </div>
                    </div>

                    {addressOption === "new" && (
                      <button
                        type="button"
                        onClick={handleAddNewAddress}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 mt-2"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add New Address
                      </button>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="full-name" className="block text-sm font-medium">
                          Full Name
                        </label>
                        <input
                          id="full-name"
                          type="text"
                          placeholder="John Doe"
                          className="w-full px-3 py-2 border border-gray-300 focus:border-indigo-500 outline-none rounded-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-medium">
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          type="text"
                          placeholder="(123) 456-7890"
                          className="w-full px-3 py-2 border border-gray-300 focus:border-indigo-500 outline-none rounded-md"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="street" className="block text-sm font-medium">
                        Street Address
                      </label>
                      <input
                        id="street"
                        type="text"
                        placeholder="123 Main St"
                        className="w-full px-3 py-2 border border-gray-300 focus:border-indigo-500 outline-none rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="apt" className="block text-sm font-medium">
                        Apartment, suite, etc. (optional)
                      </label>
                      <input
                        id="apt"
                        type="text"
                        placeholder="Apt #42"
                        className="w-full px-3 py-2 border border-gray-300 focus:border-indigo-500 outline-none rounded-md"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="city" className="block text-sm font-medium">
                          City
                        </label>
                        <input
                          id="city"
                          type="text"
                          placeholder="New York"
                          className="w-full px-3 py-2 border border-gray-300 focus:border-indigo-500 outline-none rounded-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="state" className="block text-sm font-medium">
                          State
                        </label>
                        <input id="state" type="text" placeholder="NY" className="w-full px-3 py-2 border border-gray-300 focus:border-indigo-500 outline-none rounded-md" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="zip" className="block text-sm font-medium">
                          ZIP Code
                        </label>
                        <input
                          id="zip"
                          type="text"
                          placeholder="10001"
                          className="w-full px-3 py-2 border border-gray-300 focus:border-indigo-500 outline-none rounded-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="country" className="block text-sm font-medium">
                          Country
                        </label>
                        <input
                          id="country"
                          type="text"
                          placeholder="United States"
                          className="w-full px-3 py-2 border border-gray-300 focus:border-indigo-500 outline-none rounded-md"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={handleCancelNewAddress}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button type="button" className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-400">
                        Save Address
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={addressOption === "new" && !showNewAddressForm}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    addressOption === "new" && !showNewAddressForm
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-500 text-white hover:bg-indigo-400"
                  }`}
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              <div className="p-4 border-b border-gray-300">
                <h2 className="text-xl font-semibold">Payment Method</h2>
                <p className="text-gray-600 text-sm">Choose how you'd like to pay</p>
              </div>
              <div className="flex gap-2 px-5 py-3 rounded-sm bg-indigo-500 text-white m-2">
                <input type="radio" name="cashonservicetime" />
                <p>Cash on Service Time</p>
              </div>
              <div className="flex gap-2 px-5 py-3 rounded-sm bg-indigo-500 text-white m-2">
                <input type="radio" name="cashonservicetime" />
                <p>Others</p>
              </div>
              <div className="p-4 space-y-4">
                <div className="">
                  <div className="flex">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("credit-card")}
                      className={`px-4 py-2 text-center flex-1 ${
                        paymentMethod === "credit-card" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
                      }`}
                    >
                      Credit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("paypal")}
                      className={`px-4 py-2 text-center flex-1 ${
                        paymentMethod === "paypal" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
                      }`}
                    >
                      UPI
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("bank-transfer")}
                      className={`px-4 py-2 text-center flex-1 ${
                        paymentMethod === "bank-transfer" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"
                      }`}
                    >
                      Bank Transfer
                    </button>
                  </div>
                </div>

                {paymentMethod === "credit-card" && (
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label htmlFor="card-name" className="block text-sm font-medium">
                        Name on Card
                      </label>
                      <input
                        id="card-name"
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-3 py-2 border border-gray-300 focus:border-indigo-500 outline-none rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="card-number" className="block text-sm font-medium">
                        Card Number
                      </label>
                      <input
                        id="card-number"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border border-gray-300 focus:border-indigo-500 outline-none rounded-md"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2 col-span-1">
                        <label htmlFor="expiry" className="block text-sm font-medium">
                          Expiry Date
                        </label>
                        <input
                          id="expiry"
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 border border-gray-300 focus:border-indigo-500 outline-none rounded-md"
                        />
                      </div>
                      <div className="space-y-2 col-span-1">
                        <label htmlFor="cvc" className="block text-sm font-medium">
                          CVC
                        </label>
                        <input id="cvc" type="text" placeholder="123" className="w-full px-3 py-2 border border-gray-300 focus:border-indigo-500 outline-none rounded-md" />
                      </div>
                      <div className="space-y-2 col-span-1">
                        <label htmlFor="zip-code" className="block text-sm font-medium">
                          ZIP Code
                        </label>
                        <input
                          id="zip-code"
                          type="text"
                          placeholder="10001"
                          className="w-full px-3 py-2 border border-gray-300 focus:border-indigo-500 outline-none rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="text-center p-4">
                    <p className="mb-4">You'll be redirected to PayPal to complete your payment.</p>
                    <button
                      type="button"
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Continue to PayPal
                    </button>
                  </div>
                )}

                {paymentMethod === "bank-transfer" && (
                  <div className="space-y-4 pt-4">
                    <div className="p-4 bg-gray-100 rounded-md">
                      <p className="font-medium">Bank Account Details:</p>
                      <p className="text-sm">Bank: National Bank</p>
                      <p className="text-sm">Account Name: Book Store Inc.</p>
                      <p className="text-sm">Account Number: 1234567890</p>
                      <p className="text-sm">Routing Number: 987654321</p>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="transfer-reference" className="block text-sm font-medium">
                        Transfer Reference
                      </label>
                      <input
                        id="transfer-reference"
                        type="text"
                        placeholder="Order #12345"
                        className="w-full px-3 py-2 border border-gray-300 focus:border-indigo-500 outline-none rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="transfer-date" className="block text-sm font-medium">
                        Transfer Date
                      </label>
                      <input id="transfer-date" type="date" className="w-full px-3 py-2 border border-gray-300 focus:border-indigo-500 outline-none rounded-md" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Order Confirmation</h2>
                <p className="text-gray-600 text-sm">Review your order details before confirming</p>
              </div>
              <div className="p-4 space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Delivery Information</h3>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p>Date: {date ? format(date, "PPP") : "Not selected"}</p>
                    <p>Time: {time || "Not selected"}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Shipping Address</h3>
                  <div className="bg-gray-100 p-3 rounded-md">
                    {addressOption.startsWith("existing") ? (
                      (() => {
                        const addressId = Number.parseInt(addressOption.split("-")[1])
                        const address = existingAddresses.find((a) => a.id === addressId)
                        return address ? (
                          <>
                            <p>{address.name}</p>
                            <p>{address.street}</p>
                            <p>
                              {address.city}, {address.state} {address.zip}
                            </p>
                            <p>{address.country}</p>
                          </>
                        ) : (
                          <p>No address selected</p>
                        )
                      })()
                    ) : (
                      <p>New address will be used</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Payment Method</h3>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <p>
                      {paymentMethod === "credit-card" && "Credit Card"}
                      {paymentMethod === "paypal" && "PayPal"}
                      {paymentMethod === "bank-transfer" && "Bank Transfer"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Order Summary</h3>
                  <div className="bg-gray-100 p-3 rounded-md">
                    <div className="flex justify-between">
                      <span>
                        {bookDetails.title} × {bookDetails.quantity}
                      </span>
                      <span>${(bookDetails.price * bookDetails.quantity).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>$4.99</span>
                    </div>
                    <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                      <span>Total</span>
                      <span>${(bookDetails.price * bookDetails.quantity + 4.99).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="order-notes" className="block text-sm font-medium">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="order-notes"
                    placeholder="Any special instructions for delivery?"
                    className="w-full px-3 py-2 border border-gray-300 focus:border-indigo-500 outline-none rounded-md min-h-[100px]"
                  ></textarea>
                </div>
              </div>
              <div className="p-4 border-t flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b text-center">
            <div className="mx-auto bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold">Order Confirmed!</h2>
            <p className="text-gray-600 text-sm">Thank you for your order. Your order number is #12345.</p>
          </div>
          <div className="p-4 space-y-4">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Order Details</h3>
              <p>
                Your book will be delivered on {date ? format(date, "PPP") : "the selected date"} between{" "}
                {time || "the selected time"}.
              </p>
              <p className="mt-2">We've sent a confirmation email with all the details to your email address.</p>
            </div>
            <div className="text-center space-y-2">
              <p>Have questions about your order?</p>
              <button type="button" className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                Contact Support
              </button>
            </div>
          </div>
          <div className="p-4 border-t flex justify-center">
            <button type="button" className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 mr-2">
              View Order Status
            </button>
            <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookOrderPage

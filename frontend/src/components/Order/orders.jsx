import { useEffect, useState } from "react"
import { ChevronRight, ClockArrowDown, MapPin, Package } from "lucide-react"
import { Link } from "react-router-dom"
import api from "../../config/axios-config"
import Loading from "../../components/Loading"

const OrderItem = ({ order }) => {

   return (
    <div className="border rounded-sm p-4 mb-4 bg-white border-gray-300 text-gray-800 hover:border-indigo-500">
      <div className="sm:flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src={order.image || "/placeholder.svg"} alt={order.Service?.name} className="sm:w-25 w-22 sm:h-25 h-22 object-cover rounded-sm" />
          <div>
  <h3 className="font-medium text-lg md:text-xl">
    {order?.Service?.name}
  </h3>

  <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
    {order?.issue}
  </p>

  <p className="text-indigo-500 font-bold mt-1">
    ₹{parseFloat(order?.Service?.visiting_charge).toFixed(2)}
  </p>

  <div className="lg:flex lg:gap-4">
    <div className="flex items-center text-sm text-gray-500 mt-1 text-xs sm:text-sm">
      <ClockArrowDown className="w-4 h-4 mr-1 text-indigo-500" />
      <span>{order.created}</span>
    </div>

    <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-1">
      <MapPin className="w-4 h-4 mr-1 text-indigo-500" />
      <span className="">{order.location}</span>
    </div>
  </div>
</div>

        </div>
        <button
          className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors mx-auto sm:mx-0 mt-3"
        >
              More Details
              <ChevronRight className="ml-1 w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

const NoOrders = () => {
  
  return (
  <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
    <Package className="w-16 h-16 text-gray-400 mb-4" />
    <h3 className="text-xl font-medium text-gray-700">No Current Orders</h3>
    <p className="text-gray-500 mt-2 text-center max-w-md">
      You don't have any active orders at the moment. Browse our products and place an order to see it here.
    </p>
    <button className="mt-6 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors">
      Start Shopping
    </button>
  </div>
)}

const OrderPage = () => {
  const [currentOrders, setCurrentOrders] = useState([])
  const [pastOrders, setPastOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const cOrder = [];
    const pOrder = [];

    api.get('/orders/customer/8').then((response) => {
      response.data.map((order) => {
        if (order.status === "pending") {
          cOrder.push(order)
        } else {
          pOrder.push(order)
        }
      })
      }).catch((error) => {
        console.error("Error fetching orders:", error);
      }
    ).finally(() => {
      setCurrentOrders(cOrder)
      setPastOrders(pOrder)
      setLoading(false)
    })
  },[])

  if (loading) {
    return <Loading />
  }

  return (
   
    <div className="max-w-5xl mx-auto px-4 py-4">
      <section>
        <h2 className="text-xl font-semibold mb-4">Current Orders</h2>
        {currentOrders.length > 0 ? (
          currentOrders.map((order) =>  <Link to={`/orders/${order?.order_id}/view`}> <OrderItem key={order.id} order={order} /> </Link>)
        ) : (
          <NoOrders />
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Past Orders</h2>
        {pastOrders.map((order) => (
          <Link to={`/orders/${order?.order_id}/view`}> <OrderItem key={order.id} order={order} /> </Link>
        ))}
      </section>
    </div>
  )
}

export default OrderPage

import { ChevronRight } from "lucide-react"

const ProductCategoryCards = () => {
  const electronicsCategories = [
    {
      id: 1,
      title: "Ananta Plumbing Service",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXdRRvjXFfDjFcoYG2OyF8kSSNbBiHhL_UQQ&s",
      price: "Grab Now",
      isGrabNow: true,
    },
  ]

  const lifestyleCategories = [
    {
      id: 1,
      title: "Top Selling Stationery",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXdRRvjXFfDjFcoYG2OyF8kSSNbBiHhL_UQQ&s",
      price: "From ₹49",
    },
    {
      id: 2,
      title: "Coffee Powder",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXdRRvjXFfDjFcoYG2OyF8kSSNbBiHhL_UQQ&s",
      price: "Upto 80% Off",
      isDiscount: true,
    },
    {
      id: 3,
      title: "Remote Control Toys",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXdRRvjXFfDjFcoYG2OyF8kSSNbBiHhL_UQQ&s",
      price: "Up to 80% Off",
      isDiscount: true,
    },
    {
      id: 4,
      title: "Geared Cycles",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXdRRvjXFfDjFcoYG2OyF8kSSNbBiHhL_UQQ&s",
      price: "Up to 70% Off",
      isDiscount: true,
    },
    {
      id: 5,
      title: "Dry Fruits",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXdRRvjXFfDjFcoYG2OyF8kSSNbBiHhL_UQQ&s",
      price: "Upto 75% Off",
      isDiscount: true,
    },
    {
      id: 6,
      title: "Electric Cycle",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXdRRvjXFfDjFcoYG2OyF8kSSNbBiHhL_UQQ&s",
      price: "Up to 40% Off",
      isDiscount: true,
    },
    {
      id: 7,
      title: "Best of Action Toys",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXdRRvjXFfDjFcoYG2OyF8kSSNbBiHhL_UQQ&s",
      price: "Up to 70% Off",
      isDiscount: true,
    },
  ]

  return (
    <div className="container mx-auto p-4 bg-gray-50">
      {/* Electronics Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Best of Electronics</h2>
        </div>
        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 bg-white p-4 rounded shadow-sm">
            {electronicsCategories.map((category) => (
              <div
                key={category.id}
                className="flex flex-col items-center justify-center p-2 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="w-40 h-40 mb-2">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-sm text-center font-medium line-clamp-2">{category.title}</h3>
                <p className="text-sm">₹2000</p>
                <p className={`text-sm mt-1 ${category.isGrabNow ? "text-blue-600 font-semibold" : ""}`}>
                  {category.price}
                </p>
              </div>
            ))}
          </div>
          <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Beauty, Food, Toys Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Beauty, Food, Toys & more</h2>
        </div>
        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 bg-white p-4 rounded shadow-sm">
            {lifestyleCategories.map((category) => (
              <div
                key={category.id}
                className="flex flex-col items-center justify-center p-2 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="w-24 h-24 mb-2">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-sm text-center font-medium line-clamp-2 h-10">{category.title}</h3>
                <p className={`text-sm mt-1 ${category.isDiscount ? "text-green-600 font-medium" : ""}`}>
                  {category.price}
                </p>
              </div>
            ))}
          </div>
          <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Flight Booking Ad */}
      <div className="mt-8">
        <div className="bg-blue-600 rounded-md overflow-hidden">
          <div className="p-4 text-white">
            <h3 className="text-xl font-bold mb-1">Flight bookings</h3>
            <p className="text-2xl font-bold">From ₹1,499*</p>
          </div>
          <div className="bg-yellow-400 rounded-full w-32 h-32 mx-auto -mb-10 flex items-center justify-center">
            <div className="w-28 h-28">
              <img src="/placeholder.svg?height=112&width=112" alt="Flight" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCategoryCards

import { ChevronRight } from "lucide-react"

const ProductCategoryCards = () => {
  const electronicsCategories = [
    {
      id: 1,
      title: "Ananta Plumbing Service",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXdRRvjXFfDjFcoYG2OyF8kSSNbBiHhL_UQQ&s",
      price: 2000,
    },
    {
      id: 2,
      title: "Acropill Home Cleaning",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKGni7NEGpIMiG_IZN92D794xcF2DQb5C5qg&s",
      price: 500
    }
  ]

  return (
    <div className="container mx-auto p-4 bg-gray-50">
      {/* Electronics Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Services in Ahmedabad</h2>
        </div>
        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 bg-white p-4 rounded shadow-sm">
            {electronicsCategories.map((category) => (
              <div
                key={category.id}
                className="flex flex-col items-center justify-center p-2 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="w-40 h-40 mb-1">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-sm text-center font-medium line-clamp-2">{category.title}</h3>
                <p className={`text-sm mt-1 text-blue-600 font-semibold`}>₹{category.price}</p>
              </div>
            ))}
          </div>
          <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCategoryCards

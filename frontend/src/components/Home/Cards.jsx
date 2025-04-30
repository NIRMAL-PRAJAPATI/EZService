import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

const ProductCategoryCards = ({services, city}) => {

  return (
    <div className="mx-auto p-4 bg-gray-50">
      {/* Electronics Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold capitalize">Services in {city}</h2>
        </div>
        <div className="relative">
          <div className="flex gap-2 bg-white p-4 rounded shadow-sm overflow-x-auto">
            {services.map((category) => (
              <div
                key={category.id}
                className="flex flex-col items-center justify-center p-2 hover:shadow-md transition-shadow cursor-pointer border-b border-white hover:border-indigo-500"
              >
                <Link to={`/services/${category.id}`} className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-40 h-40 mb-1">
                  <img
                    src={category.cover_image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-sm text-center font-medium line-clamp-2">{category.name}</h3>
                <p className={`text-sm mt-1 text-blue-600 font-semibold`}>₹{category.visiting_charge}</p>
                </Link>
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

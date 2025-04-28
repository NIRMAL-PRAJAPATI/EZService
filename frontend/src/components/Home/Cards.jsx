import { ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import api from "../../config/axios-config"

const ProductCategoryCards = () => {

  const [services, setServices] = useState([])
  const [city, setCity] = useState('ahmedabad')
  
  useEffect(()=>{
    setCity(localStorage.getItem('city')? localStorage.getItem('city'): 'ahmedabad')
    api.get('/services/?limit=6').then((response)=>{
      setServices(response.data)
    }).catch((err)=>{
      console.log(`Error in fetching services in ${city}`)
      console.log(err)
    })
    
  },[])

  if(!(services && services.length > 0))
    return <></>
  return (
    <div className="container mx-auto p-4 bg-gray-50">
      {/* Electronics Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Services in {city}</h2>
        </div>
        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 bg-white p-4 rounded shadow-sm">
            {services.map((category) => (
              <div
                key={category.id}
                className="flex flex-col items-center justify-center p-2 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="w-40 h-40 mb-1">
                  <img
                    src={category.cover_image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-sm text-center font-medium line-clamp-2">{category.name}</h3>
                <p className={`text-sm mt-1 text-blue-600 font-semibold`}>₹{category.visiting_charge}</p>
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

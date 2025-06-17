import { AlignLeft, Search, SlidersHorizontal, Star, XIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ServiceCard = ({services})=>{
    const navigate = useNavigate()

    const handleBookNow = (e, serviceId) => {
        e.stopPropagation(); // Prevent card click event
        navigate(`/book?serviceId=${serviceId}`);
    }

    return (
        <>
        {
            services?.length > 0 && services.map((service)=>{
            return (
                <div 
                    key={service.id}
                    onClick={() => navigate(`/service/${service?.id}`)}
                    className="bg-white overflow-hidden rounded-md border border-gray-200 hover:border-indigo-500 cursor-pointer"
                >
                    <div className="items-start">
                      <div className="w-full bg-gray-100 h-26">
                        <img
                          src={service.cover_image || "https://c8.alamy.com/comp/DERFBR/colourful-indian-shop-in-puttaparthi-andhra-pradesh-india-DERFBR.jpg"}
                          alt="Provider"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 pb-3 px-1 sm:px-2">
                        {/* <span className="text-green-500 bg-gray-100 font-semibold rounded-full px-2 text-[10px] ml-1">
                          Available
                        </span> */}
                        <h3 className="font-semibold text-md leading-none py-1" title='Ananta Plumbing Service'>
                          {service.name}<p className='text-xs text-gray-500 font-medium'>{service?.ProviderInfo?.name}</p>
                        </h3>
                        
                        <p className="text-sm text-gray-600 mb-1 font-semibold">
                          ₹{service.visiting_charge}
                        </p>
                        <p className="text-xs ">
                          {service.ServiceCategory?.name}
                        </p>
                        <div className="flex items-center text-[12px]">
                          <span className="text-gray-500">
                            {service.city}, {service.state}, {service.country}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center text-indigo-500 gap-0.5">
                            {[...Array(Math.floor(service?.average_rating))]?.map((rate, i)=> <Star key={i} className="h-3 w-3 fill-indigo-500 inline-block" />)}
                            {[...Array(5-Math.floor(service?.average_rating))]?.map((rate, i)=>
                            <Star key={i} className="h-3 w-3 inline-block" />
                          )}
                          </div>
                          <button 
                            onClick={(e) => handleBookNow(e, service.id)}
                            className="text-xs bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                </div>
            )
            })
        }
        </>
    )
}

export default ServiceCard;
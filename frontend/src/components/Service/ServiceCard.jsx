import { AlignLeft, Search, SlidersHorizontal, Star, XIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ServiceCard = ({services})=>{
    const navigate = useNavigate()

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
                          {service.name} <span className='text-sm text-indigo-400'>({service?.ProviderInfo?.name})</span>
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
                        <div className="flex items-center text-indigo-500 gap-0.5 mt-1">
                          {[...Array(Math.floor(service?.average_rating))]?.map((rate)=> <Star className="h-3 w-3 fill-indigo-500 inline-block" />)}
                          {[...Array(5-Math.floor(service?.average_rating))]?.map((rate)=>
                          <Star className="h-3 w-3 inline-block" />
                        )}
                        {/* <Star className="h-3 w-3 fill-indigo-500 inline-block" /> */}
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
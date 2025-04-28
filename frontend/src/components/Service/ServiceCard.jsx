import { AlignLeft, Search, SlidersHorizontal, Star, XIcon } from 'lucide-react'

const ServiceCard = ({services})=>{


    return (
        <>
        {
            services?.length > 0 && services.map((service)=>{

            return <a href="/frontend/views/user/service_profile.html" className="bg-white overflow-hidden rounded-md border border-gray-200 hover:border-indigo-500">
                <div className="items-start">
                  <div className="w-full bg-gray-100 h-26">
                    <img
                      src="https://c8.alamy.com/comp/DERFBR/colourful-indian-shop-in-puttaparthi-andhra-pradesh-india-DERFBR.jpg"
                      alt="Provider"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 pb-3 px-1 sm:px-2">
                    {/* <span className="text-green-500 bg-gray-100 font-semibold rounded-full px-2 text-[10px] ml-1">
                      Available
                    </span> */}
                    <h3 className="font-semibold text-md leading-none py-1" title='Ananta Plumbing Service'>
                      Ananta Plumbing Service
                    </h3>
                    <p className="text-sm text-gray-600 mb-1 font-semibold">
                      ₹4100
                    </p>
                    <div className="flex items-center text-[12px]">
                      <span className="text-gray-500">
                        Ahmedabad, Gujarat, India
                      </span>
                    </div>
                    <div className="flex items-center text-indigo-500 gap-0.5 mt-1">
                      <Star className="h-3 w-3 fill-indigo-500 inline-block" />
                      <Star className="h-3 w-3 fill-indigo-500 inline-block" />
                      <Star className="h-3 w-3 fill-indigo-500 inline-block" />
                      <Star className="h-3 w-3 fill-indigo-500 inline-block" />
                      <Star className="h-3 w-3 inline-block" />
                    </div>
                  </div>
                </div>
              </a>
            })
        }
        </>
    )
}

export default ServiceCard;
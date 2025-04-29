import { useNavigate } from "react-router-dom"

const RankingCard = ({ position, name, location, imageUrl, metrics, id }) => {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate(`/service/${id}`)
  }

  return (
    <div 
      className="bg-white rounded-md shadow-sm p-5 cursor-pointer hover:shadow-md transition-shadow duration-200" 
      onClick={handleClick}
    >
      <div className="md:flex flex-col md:flex-row items-start md:items-center gap-4">
        <p className="absolute px-3 py-1 text-white font-bold bg-indigo-500 text-[12px] tracking-wide transform rotate-[-20deg] -mt-5 md:mt-0 md:mb-24 -ml-8 border-2 border-dashed border-white">
          {position} Position
        </p>
        <div className="flex h-20 w-20 bg-gray-100 rounded-md overflow-hidden">
          <img src={imageUrl || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold">{name}</h3>
          <p className="text-gray-600 text-sm">{location}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-5 mt-4">
            {Object.entries(metrics).map(([key, value], index) => (
              <div key={index} className="flex justify-between text-sm border-b border-indigo-500">
                <span className="text-gray-700">{key}</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RankingCard
  
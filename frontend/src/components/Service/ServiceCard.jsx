import { Image, Link, Star } from "lucide-react"

export default function ServiceCard({
  id,
  name,
  price,
  location,
  rating,
  imageUrl,
  isAvailable,
  href,
}) {
  return (
    <Link href={href} className="bg-white overflow-hidden rounded-lg shadow-sm">
      <div className="flex items-start space-x-4">
        <div className="flex h-[110px] w-[110px] sm:h-[120px] sm:w-40 bg-gray-100 relative">
          <Image src={imageUrl || "/placeholder.svg"} alt={name} fill className="object-cover" />
        </div>
        <div className="flex-1 pb-3 pr-1 sm:pr-4">
          {isAvailable && (
            <span className="text-green-500 bg-gray-100 font-semibold rounded-full px-2 text-[10px] ml-1">
              Available
            </span>
          )}
          <h3 className="font-semibold text-md leading-none sm:text-lg sm:leading-none">{name}</h3>
          <p className="text-sm text-gray-600 mb-1 font-semibold">{price}</p>
          <div className="flex items-center space-x-1 text-[12px]">
            <span className="text-gray-500">{location}</span>
          </div>
          {/* <div className="flex items-center text-primary gap-1 mt-1">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-primary" : ""} inline-block`} />
              ))}
          </div> */}
        </div>
      </div>
    </Link>
  )
}
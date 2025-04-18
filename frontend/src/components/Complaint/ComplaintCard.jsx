import { Star, MapPin } from "lucide-react";

export default function ProductCard({
  image = "/placeholder.svg?height=200&width=300",
  name = "Vintage Leather Armchair",
  category = "Furniture",
  price = 249.99,
  rating = 4.5,
  location = "Brooklyn, NY",
  distance = "2.5 miles away",
}) {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half-star" className="relative">
          <Star className="w-4 h-4 text-yellow-400" />
          <Star
            className="absolute top-0 left-0 w-4 h-4 fill-yellow-400 text-yellow-400 overflow-hidden"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        </div>,
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="max-w-sm bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <span className="absolute top-3 right-3 bg-white text-black px-2 py-1 rounded-md text-sm font-medium hover:bg-gray-100">
          {category}
        </span>
      </div>

      <div className="p-5">
        <div className="mb-2 flex justify-between items-start">
          <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
          <span className="font-bold text-lg">${price.toFixed(2)}</span>
        </div>

        <div className="flex items-center gap-1 mb-3">
          {renderStars()}
          <span className="text-sm text-gray-600 ml-1">({rating})</span>
        </div>
      </div>

      <div className="px-5 pb-5 pt-0 flex items-center text-sm text-gray-500">
        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
        <span>{location}</span>
        {distance && <span className="ml-1 text-gray-400">• {distance}</span>}
      </div>
    </div>
  );
}
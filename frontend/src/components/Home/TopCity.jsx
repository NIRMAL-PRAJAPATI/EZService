import React from 'react';

const cityData = [
  {
    city: "Mumbai",
    imageUrl: "https://th.bing.com/th/id/R.393baa4954fbd66557ee064d796cf16f?rik=DRm4tsYezNdhAg&riu=http%3a%2f%2fholidaydestinationsguide.com%2fwp-content%2fuploads%2fmumbai-taj-hotel.jpg&ehk=ENF2jhwO1YFAt%2f6oKoeGSDzTZuRDZ3tHH0pu8alBVCU%3d&risl=&pid=ImgRaw&r=0",
  },
  {
    city: "Delhi",
    imageUrl: "https://www.tripsavvy.com/thmb/pAlZ4kx0tM9HFLmgkYbqMlfxaok=/2116x1417/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-846359134-5b515328c9e77c003738e40c.jpg",
  },
  {
    city: "Bengaluru",
    imageUrl: "https://tse2.mm.bing.net/th/id/OIP.rggJwf9HPvGSfpQHFuXRZwHaE8?rs=1&pid=ImgDetMain",
  },
  {
    city: "Hyderabad",
    imageUrl: "https://tse4.mm.bing.net/th/id/OIP.2KNJxAEw5kZ7RPAwSi5DyAHaEK?rs=1&pid=ImgDetMain",
  },
  {
    city: "Chennai",
    imageUrl: "https://1.bp.blogspot.com/-D_MRXu7fy-g/Vxjrmvnie9I/AAAAAAAABAw/j2GYwgkKbGY9Uk0grh-jgaymGAzORJEwACLcB/s1600/Kapaleeshwarar%2BTemple.jpg",
  },
  {
    city: "Kolkata",
    imageUrl: "https://tse4.mm.bing.net/th/id/OIP.T9tgQdQtMjK7I2gn-FoBAAHaEz?rs=1&pid=ImgDetMain",
  },
  {
    city: "Pune",
    imageUrl: "https://lh3.googleusercontent.com/N1upVRj_tpope0wPvuj6Tcg2sNC4us-E8C8oSPQaQyQn6Qo5OtL7-YGYGtMYqBIRmeLYUil-DJ_u_IaceXpK9xPWVgsN=w1000",
  },
  {
    city: "Ahmedabad",
    imageUrl: "https://media.architecturaldigest.in/wp-content/uploads/2018/10/featured-Image5-1366x768.jpg",
  },
];

function TopCity() {
  return (
    <section className="bg-gray-50 pt-5 text-black">
      <div className="sm:p-6">
        {/* Header */}
        <div className="flex items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Explore City Services
          </h2>
          <span className="ml-2 mt-1 px-2 py-0.5 text-xs font-semibold text-white bg-indigo-500 rounded">
            NEW
          </span>
        </div>

        {/* City Grid */}
        <div className='w-full overflow-x-auto removeScroll'>
        <div className="flex gap-4 px-4 md:px-0 w-max">
          {cityData.map(({ city, imageUrl }) => (
            <div
              key={city}
              className="bg-white border border-gray-200 hover:border-indigo-500 rounded-lg overflow-hidden w-[250px]"
            >
              <div className="flex">
                <img
                  src={imageUrl}
                  alt={city}
                  className="w-18 h-18 object-cover"
                  loading="lazy"
                />
                <div className="p-2">
                  <h3 className="font-bold text-lg">{city.toUpperCase()}</h3>
                  <a href="#" className="text-blue-500 flex items-center">
                    Explore
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>

      </div>
    </section>
  );
}

export default TopCity;

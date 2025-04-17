import React from 'react'

function Template() {
  return (
    <section className="bg-white py-12">
        <div className="mx-4 md:mx-8">
          {/* <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Explore Template Services
          </h2> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Wedding Requisites Section */}
            <div className="bg-gray-50 rounded-lg border p-6">
              <h2 className="text-xl font-bold text-gray-900">
                Wedding Requisites
              </h2>
              <p className="text-gray-500 -mt-1 mb-4 text-sm">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Labore, unde.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {/* Banquet Halls */}
                <div className="flex flex-col items-center">
                  <div className="rounded-lg overflow-hidden mb-2 w-full">
                    <img
                      src="https://image.wedmegood.com/resized/720X/uploads/member/25616/1727946389_234217240.jpg?crop=6,84,1010,568"
                      alt="Banquet Halls"
                      className="w-full h-23 lg:h-28 object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-center">
                    Banquet Halls
                  </span>
                </div>
                {/* Bridal Requisite */}
                <div className="flex flex-col items-center">
                  <div className="rounded-lg overflow-hidden mb-2 w-full">
                    <img
                      src="https://img.weddingbazaar.com/shaadisaga_production/photos/pictures/001/887/534/new_medium/pinterest.jpg?1598019283"
                      alt="Bridal Requisite"
                      className="w-full h-23 lg:h-28 object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-center">
                    Bridal Requisite
                  </span>
                </div>
                {/* Caterers */}
                <div className="flex flex-col items-center">
                  <div className="rounded-lg overflow-hidden mb-2 w-full">
                    <img
                      src="https://www.shaadibaraati.com/vendors-profile/f79f778a75e54a9cfedc3400d4e3752e.jpg"
                      alt="Caterers"
                      className="w-full h-23 lg:h-28 object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-center">
                    Caterers
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default Template
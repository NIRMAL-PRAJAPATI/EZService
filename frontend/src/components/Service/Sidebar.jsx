import { useState } from "react"
import { AlignLeft, X } from "lucide-react"
import SidebarOption from "./SidebarOption"

export default function Sidebar({ services }) {
  const [isVisible, setIsVisible] = useState(true)

  return (
    <>
      <div className="md:hidden">
        <AlignLeft
          className="mt-2 text-gray-500 hover:text-primary cursor-pointer"
          onClick={() => setIsVisible(true)}
        />
      </div>

      <div
        className={`lg:col-span-1 bg-white p-1 shadow-md h-fit absolute md:relative z-10 ${
          isVisible ? "" : "hidden"
        } md:block`}
      >
        <div className="flex justify-between">
          <h2 className="text-xl font-bold ml-4 mb-4 text-gray-800">Our Services</h2>
          <X
            className="md:hidden text-gray-500 hover:text-primary cursor-pointer"
            onClick={() => setIsVisible(false)}
          />
        </div>
        <ul className="space-y-1 overflow-y-scroll h-[91vh]">
          {services.map((service, index) => (
            <SidebarOption
              key={index}
              title={service.title}
              description={service.description}
              isActive={service.isActive}
            />
          ))}
        </ul>
      </div>
    </>
  )
}

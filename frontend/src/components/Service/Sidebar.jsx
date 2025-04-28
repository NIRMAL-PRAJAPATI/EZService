import { XIcon } from 'lucide-react'


const Sidebar = ({categories, menuOpen})=>{

    return  (
    
    <div className={`lg:col-span-1 bg-white px-1 pt-2 h-fit absolute md:relative z-10 ${menuOpen ? 'block' : 'hidden'}`}>
        <XIcon onClick={() => setMenuOpen(false)} className="md:hidden text-gray-500 hover:text-indigo-500 cursor-pointer ml-1" />
      <ul className="overflow-y-scroll h-[85vh] sm:h-[90vh]">
        {
            categories.length > 0 && categories?.map((category)=>{
         return (<li className="p-2 bg-indigo-500/8 rounded-t cursor-pointer hover:bg-gray-50 transition-colors">
          <h3 className="font-semibold text-indigo-500">{category.name}</h3>
          <p className="text-xs text-gray-600">
            {category.description}
          </p>
        </li>)

            })
        }
      </ul>
    </div>)
}

export default Sidebar;
export default function SidebarOption({ title, description, isActive = false }) {
    return (
      <li
        className={`p-2 ${
          isActive ? "border-b border-primary bg-primary/10 rounded-t" : ""
        } cursor-pointer hover:bg-gray-50 transition-colors`}
      >
        <h3 className={`font-semibold ${isActive ? "text-primary" : "text-gray-800"}`}>{title}</h3>
        <p className="text-xs text-gray-600">{description}</p>
      </li>
    )
  }
  
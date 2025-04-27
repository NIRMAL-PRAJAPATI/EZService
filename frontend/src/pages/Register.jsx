import { Plug, LibraryBig, Car, Wrench, PartyPopper } from 'lucide-react'
import Registeration from "../components/Register/Registration"
import ThirdPartyRegistration from "../components/Register/ThirdpartyRegistration"

export default function Register() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-5">
        <Registeration />
        <ThirdPartyRegistration />
        </div>
        </div>
  )
}

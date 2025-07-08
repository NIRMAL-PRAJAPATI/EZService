import { LogOut, Trash2 } from "lucide-react";
import Profileinfo from "../components/Profile/user/Profileinfo";
import Updateinfo from "../components/Profile/user/Updateinfo";
import LogoutDelete from "../components/Profile/user/Logoutdelete";
import ProfileNav from '../components/Profile/user/ProfileNav';

export default function ProfilePage() {
  return (
    <div className="bg-gray-100">
      <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8 font-sans">
        <ProfileNav />
        <div>
          <Profileinfo />
          <div className="hidden sm:block">
            <div className="py-8">
              <div className="border-t border-gray-200" />
            </div>
          </div>
        </div>
        <Updateinfo />
        <div className="hidden sm:block">
          <div className="py-8">
            <div className="border-t border-gray-200" />
          </div>
        </div>
        <LogoutDelete />
      </main>
    </div>
  );
}

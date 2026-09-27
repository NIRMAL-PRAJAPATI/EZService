import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { lazy, Suspense } from 'react'
import CustomerLayout from './components/layout/CustomerLayout'
import ProviderLayout from './components/layout/ProviderLayout'
import { PageSkeleton } from './components/ui/Skeleton'

// Customer pages
const UserHome = lazy(() => import('./pages/UserHome'));
const ProfilePage = lazy(() => import('./pages/Pofile'));
const Notifications = lazy(() => import('./pages/Notifications'));
const ServicePage = lazy(() => import('./pages/ServicesPage'));
const About = lazy(() => import('./pages/About'));
const Explore = lazy(() => import('./pages/Explore'));
const Complaint = lazy(() => import('./pages/Complaint'));
const Order = lazy(() => import('./pages/Order'));
const Rankings = lazy(() => import('./pages/Rankings'));
const ServiceProfilePage = lazy(() => import('./pages/ServiceProfilePage'));
const Templates = lazy(() => import('./pages/Templates'));
const HomeRenovation = lazy(() => import('./components/Templates/home-renovation'));
const WeddingRequisites = lazy(() => import('./components/Templates/wedding-requisites'));
const HomeAppliance = lazy(() => import('./components/Templates/HomeAppliance'));
const BeautySpa = lazy(() => import('./components/Templates/BeautySpa'));
const Party = lazy(() => import('./components/Templates/Party'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));
const BookOrderPage = lazy(() => import('./pages/BookOrder'));
const InstantService = lazy(() => import('./pages/InstantService'));
const BookInstantOrder = lazy(() => import('./pages/BookInstantOrder'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));

// Auth
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const MobileVarification = lazy(() => import('./pages/MobileVarification'));
const OAuthTransfer = lazy(() => import('./config/authTransfer'));
const RegistrationForm = lazy(() => import('./components/Register/ProviderRegistration'));
const LoginForm = lazy(() => import('./components/Register/ProviderLogin'));

// Provider pages
const Dashboard = lazy(() => import('./pages/ProviderDashboard'));
const ProviderProfile = lazy(() => import('./pages/ProviderProfile'));
const ProviderReview = lazy(() => import('./pages/ProviderReview'));
const ProviderCalendar = lazy(() => import('./pages/ProviderCalendar'));
const ProviderOrder = lazy(() => import('./pages/ProviderOrder'));
const ProviderOrderView = lazy(() => import('./pages/ProviderOrderView'));
const ProviderComplaint = lazy(() => import('./pages/ProviderComplaint'));
const ProviderServices = lazy(() => import('./pages/ProviderServices'));
const ProviderInstantRequests = lazy(() => import('./pages/ProviderInstantRequests'));

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        {/* Customer app */}
        <Route element={<CustomerLayout />}>
          <Route index element={<UserHome />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/services/:category" element={<ServicePage />} />
          <Route path="/service/:id" element={<ServiceProfilePage />} />
          <Route path="/book" element={<BookOrderPage />} />
          <Route path="/instant-service" element={<InstantService />} />
          <Route path="/order" element={<Order />} />
          <Route path="/bookings" element={<Order />} />
          <Route path="/orders" element={<Navigate to="/order" replace />} />
          <Route path="/orders/:id/view" element={<OrderDetails />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/complaint" element={<Complaint />} />
          <Route path="/about" element={<About />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/home-renovation" element={<HomeRenovation />} />
          <Route path="/wedding-requisites" element={<WeddingRequisites />} />
          <Route path="/HomeAppliance" element={<HomeAppliance />} />
          <Route path="/BeautySpa" element={<BeautySpa />} />
          <Route path="/Party" element={<Party />} />
        </Route>

        {/* Stand-alone pages */}
        <Route path="/book-instant-order" element={<BookInstantOrder />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/mobilevarification" element={<MobileVarification />} />
        <Route path="/authtransfer" element={<OAuthTransfer />} />
        <Route path="/provider/login" element={<LoginForm />} />
        <Route path="/provider/register" element={<RegistrationForm />} />

        {/* Provider app */}
        <Route path="/provider" element={<ProviderLayout />}>
          <Route index element={<Navigate to="/provider/trips" replace />} />
          <Route path="trips" element={<ProviderOrder />} />
          <Route path="calendar" element={<ProviderCalendar />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<ProviderOrder />} />
          <Route path="orders/:orderId/view" element={<ProviderOrderView />} />
          <Route path="instant-requests" element={<ProviderInstantRequests />} />
          <Route path="services" element={<ProviderServices />} />
          <Route path="complaints" element={<ProviderComplaint />} />
          <Route path="reviews" element={<ProviderReview />} />
          <Route path="profile" element={<ProviderProfile />} />
        </Route>

        <Route path="/errorpage" element={<ErrorPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Suspense>
  )
}

export default App

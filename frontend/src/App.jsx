import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import { lazy, Suspense } from 'react'
const UserHome = lazy(() => import('./pages/UserHome'));
const Footer = lazy(() => import('./components/Footer'));
const ProfilePage = lazy(() => import('./pages/Pofile'));
const ServicePage = lazy(() => import('./pages/ServicesPage'));
const About = lazy(() => import('./pages/About'));
const Explore = lazy(() => import('./pages/Explore'));
const Complaint = lazy(() => import('./pages/Complaint'));
const Order = lazy(() => import('./pages/Order'));
const Rankings = lazy(()=> import('./pages/Rankings'))
const ServiceProfilePage = lazy(() => import('./pages/ServiceProfilePage'));
const Templates = lazy(() => import('./pages/Templates/Templates'));
const HomeRenovation = lazy(() => import('./components/Templates/home-renovation'));
const WeddingRequisites = lazy(() => import('./components/Templates/wedding-requisites'));
import Loading from './components/Loading'
import OrderDetails from './pages/OrderDetails';
import BookOrderPage from './pages/BookOrder';
import Login from './pages/Login';
import MobileVarification from './pages/MobileVarification';
const ErrorPage = lazy(() => import('./pages/ErrorPage'));
const Register = lazy(() => import('./pages/register'));
import Dashboard  from './pages/ProviderDashboard';
import RegistrationForm from './components/Register/ProviderRegistration'
import LoginForm from './components/Register/ProviderLogin';
import ProviderProfile from './pages/ProviderProfile';
import ProviderReview from './pages/ProviderReview';
import ProviderOrder from './pages/ProviderOrder';
import ProviderServices from './pages/ProviderServices';
import OAuthTransfer from './config/authTransfer';

function App() {
  const location = useLocation();
  const hideHeaderFooter = (location.pathname === '/login') || (location.pathname === '/errorpage') || (location.pathname === '/register') || (location.pathname === '/register/mobilevarification' || location.pathname?.startsWith('/provider/'));

  return (
      <div className="">
        {!hideHeaderFooter && <Navbar />}
        <Suspense fallback={<Loading />}>
        <Routes>
          <Route index element={<UserHome />} />
          <Route path="/about" element={<About />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/services/" element={<ServicePage />} >
            <Route path=":category" element={<ServicePage />} />
          </Route>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/complaint" element={<Complaint />} />
          <Route path='/Rankings' element={<Rankings />} />
          <Route path="/service/:id" element={<ServiceProfilePage />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/home-renovation" element={<HomeRenovation />} />
          <Route path="/wedding-requisites" element={<WeddingRequisites />} />
          <Route path="/HomeAppliance" element={<HomeAppliance />} />
          <Route path="/BeautySpa" element={<BeautySpa />} />
          <Route path="/Party" element={<Party/>} />
          <Route path="/order" element={<Order />} />
          <Route path='/authtransfer' element={<OAuthTransfer/>} />
          <Route path="/errorpage" element={<ErrorPage />} />
          <Route path="/orders/" element={<OrderDetails />} >
            <Route path=":id/view" element={<OrderDetails />} />
          </Route>
          <Route path="/provider/" >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path='register' element={<RegistrationForm />} />
            <Route path='login' element={<LoginForm />} />
            <Route path='profile' element={<ProviderProfile />} />
            <Route path='complaints' element={<ProviderReview />} />
            <Route path='orders' element={<ProviderOrder />} />
            {/* <Route path='complaints' element={<Complaint />} /> */}
            <Route path='services' element={<ProviderServices />} />
            <Route path='instant-requests' element={<ProviderInstantRequests />} />
          </Route>
          <Route path='/book' element={<BookOrderPage />} />
          <Route path='/instant-service' element={<InstantService />} />
          <Route path='/book-instant-order' element={<BookInstantOrder />} />
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<Register />} />
          <Route path='/register/mobilevarification' element={<MobileVarification />} />
        </Routes>
        </Suspense>
        {!hideHeaderFooter && <Footer/>}
      </div>
  )
}

export default App

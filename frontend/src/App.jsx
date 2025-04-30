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
import Loading from './components/Loading'
import OrderDetails from './pages/OrderDetails';
import BookOrderPage from './pages/BookOrder';
import Login from './pages/Login';
import MobileVarification from './pages/MobileVarification';
const ErrorPage = lazy(() => import('./pages/ErrorPage'));
const Register = lazy(() => import('./pages/register'));

function App() {
  const location = useLocation();
  const hideHeaderFooter = (location.pathname === '/login') || (location.pathname === '/errorpage') || (location.pathname === '/register') || (location.pathname === '/register/mobilevarification');

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
          <Route path="/order" element={<Order />} />
          <Route path="/errorpage" element={<ErrorPage />} />
          <Route path="/orders/" element={<OrderDetails />} >
            <Route path=":id/view" element={<OrderDetails />} />
          </Route>
          <Route path='/book' element={<BookOrderPage />} />
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

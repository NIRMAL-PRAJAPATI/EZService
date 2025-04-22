import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
import Loading from './components/Loading'
import OrderDetails from './pages/OrderDetails';
import Rankings from './pages/Rankings/Rankings'
const ErrorPage = lazy(() => import('./pages/ErrorPage'));

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen">
        <Navbar />
        <Suspense fallback={<Loading />}>
        <Routes>
          <Route index element={<UserHome />} />
          <Route path="/about" element={<About />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/complaint" element={<Complaint />} />
          <Route path='/Rankings' element={<Rankings />} />
          <Route path="/order" element={<Order />} />
          <Route path="/errorpage" element={<ErrorPage />} />
          <Route path="/orders/orderdetails" element={<OrderDetails />} />
        </Routes>
        </Suspense>
        <Footer/>
      </div>
    </Router>
  )
}

export default App

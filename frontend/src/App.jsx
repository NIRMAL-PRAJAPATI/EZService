import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
<<<<<<< HEAD
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
const ErrorPage = lazy(() => import('./pages/ErrorPage'));
=======
import UserHome from './pages/UserHome'
import Footer from './components/Footer'
import ProfilePage from './pages/Pofile'
import ServicePage from './pages/ServicesPage'
import About from './pages/About'
import Explore from './pages/Explore'
import Complaint from './pages/Complaint'
import Rankings from './pages/Rankings/Rankings'
>>>>>>> 66a2de20475a5fc8bb9851f4e17e304a15660928

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
<<<<<<< HEAD
          <Route path="/order" element={<Order />} />
          <Route path="/errorpage" element={<ErrorPage />} />
=======
          <Route path="/rankings" element={<Rankings />} />
>>>>>>> 66a2de20475a5fc8bb9851f4e17e304a15660928
        </Routes>
        </Suspense>
        <Footer/>
      </div>
    </Router>
  )
}

export default App

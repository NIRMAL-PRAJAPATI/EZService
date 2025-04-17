import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import UserHome from './pages/UserHome'
import Footer from './components/Footer'
import ProfilePage from './pages/Pofile'
import ServicePage from './pages/ServicesPage'
import About from './pages/About'
import Explore from './pages/Explore'

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route index element={<UserHome />} />
          <Route path="/about" element={<About />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/services" element={<ServicePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  )
}

export default App

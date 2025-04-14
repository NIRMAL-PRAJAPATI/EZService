import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import UserHome from './pages/UserHome'
import Footer from './components/Footer'
// import UserExplore from './pages/UserExplore'
import ServicePage from './pages/ServicesPage'
import About from './pages/About'

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<UserHome />} />
          <Route path="/about" element={<About />} />
          {/* <Route path="/explore" element={<UserExplore />} /> */}
          <Route path="/services" element={<ServicePage />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  )
}

export default App

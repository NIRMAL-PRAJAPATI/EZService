import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import HeroSection from './components/Home/HeroSection'
import Footer from './components/Footer'
import UserReview from './components/Home/UserReview'
import Services from './components/Home/Services'
import About from './components/About/About'

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <Services/>
              <UserReview />
            </>
          } />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  )
}

export default App

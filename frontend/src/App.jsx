import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import HeroSection from './components/Home/HeroSection'
import Footer from './components/Footer'
import UserReview from './components/Home/UserReview'
import Services from './components/Home/Services'

function App() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
    <Navbar />
    <HeroSection />
    <Services/>
    <UserReview />
    <Footer/>
    </div>
  )
}

export default App

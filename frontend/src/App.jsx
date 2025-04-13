import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import HeroSection from './components/Home/HeroSection'

function App() {
  return (
    <div className="w-full min-h-screen bg-gray-50">
    <Navbar />
    <HeroSection />
    </div>
  )
}

export default App

import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { Outlet } from 'react-router-dom'

function App() {


  return (
    <div className='min-h-screen flex flex-col'>
      <Header/>
      <main className='flex-grow container mx-auto px-4 py-8'>
      <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default App

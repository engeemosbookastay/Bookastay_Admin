import React from 'react'
import { Route, Routes } from 'react-router-dom'  
import Home from './Pages/Home'
import Hero from './Pages/Hero'

export const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:4000';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />

      </Routes>
    </div>
  )
}

export default App

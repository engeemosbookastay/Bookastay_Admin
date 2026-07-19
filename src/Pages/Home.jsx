import React from 'react'
import Hero from './Hero'

const Home = ({ onLogout }) => {
  return (
    <div>
      <Hero onLogout={onLogout} />
    </div>
  )
}

export default Home

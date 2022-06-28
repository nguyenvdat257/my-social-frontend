import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './Header'
import Home from './Home'
import Chat from './Chat'
import Settings from './Settings'
import Explore from './Explore'
import Profile from './Profile'

const Main = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="/direct/inbox" element={<Chat />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/:username" element={<Profile />} /> 
        <Route path="/accounts/edit" element={<Settings />} />
      </Routes>
    </div>
  )
}

export default Main
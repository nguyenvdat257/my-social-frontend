import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './Header'
import Home from './Home'
import Chat from './Chat'
import Settings from './Settings'
import Explore from './Explore'
import Profile from './Profile'
import PrivateRoute from '../utils/PrivateRoute'
import { useSelector } from 'react-redux'

const Main = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<PrivateRoute isLoggedIn={isLoggedIn}/>}>
          <Route path="" element={<Home />} />
          <Route path='direct/inbox' element={<Chat />} />
          <Route path="/explore" element={<Explore />} />
          {/* <Route path="/:username" element={<Profile />} />  */}
          <Route path="/accounts/edit" element={<Settings />} />
        </Route>
      </Routes>
    </div>
  )
}

export default Main
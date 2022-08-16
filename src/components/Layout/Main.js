import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from '../Home/Home'
import Chat from '../Chat/Chat'
import Header from './Header'
import Settings from '../Settings/Settings'
import Explore from '../Explore/Explore'
import Profile from '../Profile/Profile'
import PrivateRoute from '../../utils/PrivateRoute'
import { useSelector } from 'react-redux'
import PostUser from '../Post/PostUser'

const Main = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  return (
    <div>
      <Header />
      <div className='contain'>
        <Routes>
          <Route path="/" element={<PrivateRoute isLoggedIn={isLoggedIn} />}>
            <Route path="" element={<Home />} />
            <Route path='direct/inbox' element={<Chat />} />
            <Route path="explore" element={<Explore />} />
            <Route path="profiles/:username" element={<Profile />} /> 
            <Route path="posts/:postCode" element={<PostUser />} /> 
            <Route path="profiles/:username/saved" element={<Profile isSaved={true}/>} /> 
            <Route path="accounts/*" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </div>
  )
}

export default Main
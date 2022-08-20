import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Main from './components/Layout/Main';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup'
import Story from './components/Story/Story';
import MyToast from './components/Common/MyToast';
import { useDispatch, useSelector } from 'react-redux';
import SharedModals from './components/Post/SharedModals';
import { useUserSocket } from './hooks/UserSocketHook';
import { useChatSocket } from './hooks/ChatSocketHooks';
import { useEffect } from 'react';

export const SocketContext = React.createContext();
function App() {
  const isClickable = useSelector(state => state.click.isClickable);
  const wsChat = useChatSocket();
  const wsUser = useUserSocket();
  // useEffect(() => {
  //   return () => {
  //     wsChat.close();
  //     wsUser.close();
  //   }
  // }, []);
  return (
    <>
      <SocketContext.Provider value={wsChat}>
        <div style={{ pointerEvents: `${isClickable ? 'auto' : 'none'}` }}>
          <BrowserRouter>
            <Routes>
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/signup" element={<Signup />} />
              <Route exact path="/signup" element={<Signup />} />
              <Route exact path="/stories/profiles/:idx" element={<Story type='other' />} />
              <Route exact path="/stories/my" element={<Story type='my' />} />
              <Route path="/*" element={<Main />} />
            </Routes>
            <SharedModals />
          </BrowserRouter>
          <MyToast />

        </div>

      </SocketContext.Provider>
    </>
  );
}

export default App;

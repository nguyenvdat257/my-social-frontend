import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Main from './components/Layout/Main';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup'
import Story from './components/Story/Story';
import MyToast from './components/Common/MyToast';
import { useEffect } from 'react';
import { callGetCurrentProfile } from './store/profile-actions';
import { useDispatch, useSelector } from 'react-redux';
import SharedModals from './components/Post/SharedModals';
import { useUserSocket, SocketContext } from './hooks/UserSocketHook';
import { useChatSocket } from './hooks/ChatSocketHooks';

function App() {
  const dispatch = useDispatch();
  const isClickable = useSelector(state => state.click.isClickable);
  const wsUser = useUserSocket();
  const wsChat = useChatSocket();
  // useEffect(() => {
  //   dispatch(callGetCurrentProfile());
  // }, [])
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
          </BrowserRouter>
          <MyToast />
          <SharedModals />

        </div>

      </SocketContext.Provider>
    </>
  );
}

export default App;

import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Main from './components/Layout/Main';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup'
import Story from './components/Story/Story';
import MyToast from './components/Common/MyToast';
import { useEffect } from 'react';
import { callGetCurrentProfile } from './store/profile-actions';
import { useDispatch } from 'react-redux';
import SharedModals from './components/Post/SharedModals';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(callGetCurrentProfile());
  }, [])
  return (
    <>
      <div style={{ pointerEvents: 'auto' }}>
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
    </>
  );
}

export default App;

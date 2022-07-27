import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Main from './components/Layout/Main';
import Login from './components/Authen/Login';
import Signup from './components/Authen/Signup'
import Story from './components/Story/Story';
import MyToast from './components/Common/MyToast';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/stories/profiles/:idx" element={<Story />} />
          <Route path="/*" element={<Main />} />
        </Routes>
      </BrowserRouter>
      <MyToast />
    </>
  );
}

export default App;

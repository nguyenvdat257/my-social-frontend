import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Main from './components/Main';
import Login from './components/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route path="/*" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

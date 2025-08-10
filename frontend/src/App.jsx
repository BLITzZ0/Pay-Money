import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignupForm } from './pages/SignupForm';
import {Login} from './pages/Login';
import { AppBar } from './components/AppBar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/s" element={<SignupForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AppBar/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

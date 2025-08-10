import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignupForm } from './pages/SignupForm';
import {Login} from './pages/Login';
import { Dashboard } from './pages/Dashboard';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/s" element={<SignupForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

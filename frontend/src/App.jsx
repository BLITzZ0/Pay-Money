import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignupForm } from './pages/SignupForm';
import {Login} from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { SendMoney } from './pages/SendMoney';
import { LandingPage } from './pages/LandingPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />}/>
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/sendmoney" element={<SendMoney />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

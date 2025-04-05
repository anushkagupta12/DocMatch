import { Routes, Route } from 'react-router-dom';
import { testApi } from './api';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDAshboard';
import Navbar from './components/Navbar';
import './index.css';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}
export default App;
import { useState } from 'react';
import RegisterForm from './components/RegisterForm';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import BusList from './components/BusList';
import BusSeats from './components/BusSeats';
import UserBookings from './components/UserBookings';
import Wrapper from './components/Wrapper';
import Toast from './components/Toast';

const App = () => {
  const navigate = useNavigate();
  const [token, setToken]=useState(localStorage.getItem('token'))
  const [userId, setUserId]=useState(localStorage.getItem('userId'))
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
  };
  const handlelogin =(token, userId)=>{
    localStorage.setItem('token',token)
    localStorage.setItem('userId',userId)
    setToken(token)
    setUserId(userId)
  }
  const handlelogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null)
    setUserId(null)
    navigate('/login');
  }
  return (
    <div>
      <Wrapper  token={token} handlelogout = {handlelogout}>
      <Routes>
        <Route path='/' element={<BusList />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm onLogin={handlelogin}/>}/>
        <Route path="/bus/:busId" element={<BusSeats token={token} notify={showToast} />} />
        <Route path="/my-bookings" element={<UserBookings token={token} userId={userId} notify={showToast} />} />
      </Routes>
      </Wrapper>
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}

export default App;
      

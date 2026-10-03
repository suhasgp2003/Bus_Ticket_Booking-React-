import { useEffect, useState } from 'react';
import RegisterForm from './components/RegisterForm';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);
  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
  };
  const handlelogin =(token, userId)=>{
    localStorage.setItem('token',token)
    localStorage.setItem('userId',userId)
    setToken(token)
    setUserId(userId)
    navigate('/buses', { replace: true });
  }
  const handlelogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null)
    setUserId(null)
    navigate('/login');
  }
  return (
    <div className={theme === 'dark' ? 'theme-dark' : ''}>
      <Wrapper
        token={token}
        handlelogout={handlelogout}
        theme={theme}
        onThemeToggle={() => setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark')}
      >
      <Routes>
        <Route path='/' element={<Navigate to={token ? "/buses" : "/login"}replace />} />       
        <Route path="/login" element={token? <Navigate to="/buses" replace /> : <LoginForm onLogin={handlelogin}/>}/>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/buses" element={token ? <BusList /> : <Navigate to="/login" replace />} />
        <Route path="/bus/:busId" element={token ? <BusSeats token={token} notify={showToast} /> : <Navigate to="/login" replace />} />
        <Route path="/my-bookings" element={token ? <UserBookings token={token} userId={userId} notify={showToast} /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Wrapper>
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}

export default App;
      

import React, { useState } from 'react';
import RegisterForm from './components/RegisterForm';
import { Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import BusList from './components/BusList';
import BusSeats from './components/BusSeats';
import UserBookings from './components/UserBookings';
import Wrapper from './components/Wrapper';

const App = () => {
  const [token, setToken]=useState(localStorage.getItem('token'))
  const [userId, setUserId]=useState(localStorage.getItem('userId'))
  const [selectedBusId, setSelectedBusId]= useState(null)
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
    setSelectedBusId(null)
  }
  return (
    <div>
      <Wrapper  token={token} handlelogout = {handlelogout}>
      <Routes>
        <Route path='/' element={<BusList onSelectBus={(id)=>setSelectedBusId(id)} token={token} />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm onLogin={handlelogin}/>}/>
        <Route path="/bus/:busId" element={<BusSeats token={token} />} />
        <Route path="/my-bookings" element={<UserBookings token={token} userId={userId} />} />
      </Routes>
      </Wrapper>
    </div>
  )
}

export default App;
      

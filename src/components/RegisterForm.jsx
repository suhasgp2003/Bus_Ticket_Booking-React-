import { useState} from 'react';
import axios from 'axios';

const RegisterForm = () => {
    const [form,setForm]= useState({
        username:'',
        email:'',
        password:''
    });
    const [message,setMessage]= useState('');
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/register/', form);
            setMessage('Registration successfull!');
        } catch (error) {
  const data = error.response?.data;

  const errorMessage =
    data?.username?.[0] ||
    data?.email?.[0] ||
    data?.password?.[0] ||
    data?.detail ||
    "Registration failed. Please try again.";

  setMessage(errorMessage);
}
    };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
            <label>Username:</label>
            <input type="text" id="username" name="username" value={form.username} onChange={handleChange} /><br></br>
            <label>Email</label>
            <input type="email" id="email" name="email" value={form.email} onChange={handleChange} /><br></br>
            <label>Password</label>
            <input type="password" id="password" name="password" value={form.password} onChange={handleChange} /><br></br>
            <button type="submit">Register</button>
            {message && <p>{message}</p>}
        </div>
      </form>
    </div>
  )
}

export default RegisterForm

import { useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({onLogin}) => {
    const navigate = useNavigate();
    const [form,setForm]= useState({
        username:'',
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
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/login/`, form);
            setMessage('User logged in successfully!');
            if(onLogin){
                onLogin(response.data.token, response.data.user_id
                )
            }
            navigate('/');
        } catch {
            setMessage("Login failed. Please try again.");
        }
    };
  return (
    <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-5 shadow-lg shadow-slate-200/70 sm:p-8">
      <div className="mb-6">
        <p className="text-sm font-semibold text-blue-600">Welcome back</p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Log in to your account</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium text-slate-700">Username</label>
          <input className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" type="text" id="username" name="username" value={form.username} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
          <input className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" type="password" id="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <button className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" type="submit">Login</button>
        {message && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>}
      </form>
    </div>
  )
}

export default LoginForm;

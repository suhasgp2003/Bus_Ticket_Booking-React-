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
    <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-5 shadow-lg shadow-slate-200/70 sm:p-8">
      <div className="mb-6">
        <p className="text-sm font-semibold text-blue-600">Plan your next trip</p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Create an account</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium text-slate-700">Username</label>
          <input className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" type="text" id="username" name="username" value={form.username} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
          <input className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
          <input className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" type="password" id="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <button className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" type="submit">Create account</button>
        {message && <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">{message}</p>}
      </form>
    </div>
  )
}

export default RegisterForm

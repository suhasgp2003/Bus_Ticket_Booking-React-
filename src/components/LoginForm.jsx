import { useState} from 'react';
import axios from 'axios';

const LoginForm = ({onLogin}) => {
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
            const response = await axios.post('http://localhost:8000/api/login/', form);
            setMessage('User logged in successfully!');
            if(onLogin){
                onLogin(response.data.token, response.data.user_id
                )
            }
        } catch(error)
         {
            setMessage("Login failed. Please try again.");
        }
    };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
            <label>Username:</label>
            <input type="text" id="username" name="username" value={form.username} onChange={handleChange} /><br></br>
            <label>Password</label>
            <input type="password" id="password" name="password" value={form.password} onChange={handleChange} /><br></br>
            <button type="submit">Login</button>
            {message && <p>{message}</p>}
        </div>
      </form>
    </div>
  )
}

export default LoginForm;

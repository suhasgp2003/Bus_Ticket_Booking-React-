import { useState} from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = ({onLogin}) => {
    const navigate = useNavigate();
    const [form,setForm]= useState({
        username:'',
        password:''
    });
    const [message,setMessage]= useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/login/`, form);
            setMessage('User logged in successfully!');
            if(onLogin){
                onLogin(response.data.token, response.data.user_id, form.username)
            }
            navigate('/');
        } catch {
            setMessage("Login failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    const isSuccess = message === 'User logged in successfully!';
  return (
    <section aria-labelledby="login-title" className="mx-auto w-full max-w-5xl py-2 sm:py-6 lg:py-10">
      <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 md:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#b91c1c] p-8 text-white md:flex lg:p-10">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border-[40px] border-white/10" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-white" />
              GoBus · Travel made simple
            </div>
            <h2 className="mt-8 text-3xl font-bold leading-tight tracking-tight lg:text-4xl">
              Good journeys<br />start here.
            </h2>
            <p className="mt-4 max-w-xs text-sm leading-7 text-red-100">
              Find your route, choose your seat, and keep your travel plans in one place.
            </p>
          </div>
          <svg className="relative my-8 w-full" viewBox="0 0 320 150" fill="none" aria-hidden="true">
            <path d="M15 127h290" stroke="white" strokeOpacity=".3" strokeWidth="2" strokeLinecap="round" />
            <rect x="37" y="35" width="246" height="82" rx="18" fill="white" />
            <path d="M263 35h2a18 18 0 0 1 18 18v31h-20V35Z" fill="#fecaca" />
            <rect x="53" y="50" width="36" height="28" rx="5" fill="#fee2e2" />
            <rect x="98" y="50" width="36" height="28" rx="5" fill="#fee2e2" />
            <rect x="143" y="50" width="36" height="28" rx="5" fill="#fee2e2" />
            <rect x="188" y="50" width="36" height="28" rx="5" fill="#fee2e2" />
            <path d="M38 90h202" stroke="#dc2626" strokeWidth="4" />
            <rect x="237" y="49" width="17" height="56" rx="4" fill="#fee2e2" />
            <circle cx="84" cy="116" r="15" fill="#7f1d1d" />
            <circle cx="84" cy="116" r="6" fill="#fecaca" />
            <circle cx="237" cy="116" r="15" fill="#7f1d1d" />
            <circle cx="237" cy="116" r="6" fill="#fecaca" />
            <path d="M21 64h-9m15 16H8m15 17H13" stroke="white" strokeOpacity=".5" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <ul className="relative space-y-3 text-sm text-red-100">
            {['Browse available routes', 'Reserve your preferred seat', 'Manage your bookings'].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </aside>

        <div className="px-5 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
          <div className="mb-7">
            <div aria-hidden="true" className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-700">
              <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="5" y="3" width="14" height="16" rx="3" />
                <path d="M5 10h14M8 19v2m8-2v2M9 6h6" strokeLinecap="round" />
                <circle cx="8.5" cy="15" r="1" /><circle cx="15.5" cy="15" r="1" />
              </svg>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-red-700">Welcome back</p>
            <h1 id="login-title" className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Log in to GoBus</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">Your next journey is just a few clicks away.</p>
          </div>

          <form onSubmit={handleSubmit} aria-busy={isSubmitting} aria-describedby={message && !isSubmitting ? 'login-message' : undefined}>
            {message && !isSubmitting && (
              <div
                id="login-message"
                role={isSuccess ? 'status' : 'alert'}
                className={`mb-6 flex items-start gap-3 rounded-xl border p-4 text-sm leading-6 ${isSuccess ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}
              >
                <svg className="mt-0.5 shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  {isSuccess ? <path d="m7 12 3 3 7-7" /> : <path d="M12 7v6m0 3v1" />}
                </svg>
                <div>
                  <p className="font-semibold">{isSuccess ? 'You’re logged in' : 'Unable to log in'}</p>
                  <p>{message}</p>
                </div>
              </div>
            )}

            <fieldset disabled={isSubmitting} className="min-w-0 space-y-5">
              <legend className="sr-only">Login credentials</legend>
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-slate-700">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="Enter your username"
                  aria-describedby="username-hint"
                  className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none"
                  required
                />
                <p id="username-hint" className="mt-2 text-xs leading-5 text-slate-500">Use the username you registered with.</p>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 disabled:cursor-wait disabled:opacity-60 motion-reduce:transition-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70 motion-reduce:transition-none"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin motion-reduce:animate-none" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity=".25" />
                      <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Logging in...
                  </>
                ) : (
                  <>
                    Log in to your account
                    <span aria-hidden="true">&rarr;</span>
                  </>
                )}
              </button>
            </fieldset>
            <p role="status" className="sr-only">{isSubmitting ? 'Logging in. Please wait.' : ''}</p>
          </form>

          <div className="mt-7 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-600">New to GoBus?</p>
            <Link to="/register" className="mt-2 inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-sm font-bold text-red-700 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">
              Create an account <span aria-hidden="true" className="ml-2">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoginForm;

import { useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
    const [form,setForm]= useState({
        username:'',
        email:'',
        password:''
    });
    const [message,setMessage]= useState('');
    const [showPassword, setShowPassword] = useState(false);
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/register/`, form);
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

  const isSuccess = message === 'Registration successfull!';

  return (
    <section aria-labelledby="signup-title" className="mx-auto w-full max-w-5xl py-2 sm:py-6 lg:py-10">
      <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 md:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#b91c1c] p-8 text-white md:flex lg:p-10">
          <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full border-[40px] border-white/10" />
          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-white" />
              GoBus · Travel made simple
            </p>
            <h2 className="mt-8 text-3xl font-bold leading-tight tracking-tight lg:text-4xl">One account.<br />Every journey.</h2>
            <p className="mt-4 text-sm leading-7 text-red-100">A simpler way to find your bus, choose your seat, and manage your reservations.</p>
          </div>

          <div aria-hidden="true" className="relative my-9 rotate-[-3deg] rounded-2xl bg-white p-5 text-slate-900 shadow-xl shadow-red-950/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-red-700">Your next adventure</span>
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="1.8">
                <rect x="5" y="3" width="14" height="16" rx="3" /><path d="M5 10h14M8 19v2m8-2v2M9 6h6" strokeLinecap="round" /><circle cx="8.5" cy="15" r="1" /><circle cx="15.5" cy="15" r="1" />
              </svg>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <div className="h-3 w-3 shrink-0 rounded-full border-2 border-red-600" />
              <div className="h-px flex-1 border-t border-dashed border-slate-300" />
              <span className="text-xl text-red-600">&rarr;</span>
              <div className="h-px flex-1 border-t border-dashed border-slate-300" />
              <div className="h-3 w-3 shrink-0 rounded-full bg-red-600" />
            </div>
            <div className="mt-2 flex justify-between gap-3 text-sm font-semibold text-slate-900"><span>Your city</span><span>Somewhere new</span></div>
            <div className="mt-5 flex items-center justify-between border-t border-dashed border-slate-300 pt-4 text-xs text-slate-500"><span>Find your route</span><span>Make it your journey</span></div>
          </div>

          <ul className="relative space-y-5">
            {[
              ['Find your route', 'Browse buses between your departure and destination.'],
              ['Choose your seat', 'Pick from the available seats on your bus.'],
              ['Stay organized', 'View and manage your bookings in one place.'],
            ].map(([title, description]) => (
              <li key={title} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <div><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs leading-5 text-red-100">{description}</p></div>
              </li>
            ))}
          </ul>
        </aside>

        <div className="px-5 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-12">
          <div className="mb-7">
            <div aria-hidden="true" className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-700">
              <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="8" r="4" /><path d="M2 21v-2a7 7 0 0 1 14 0v2m3-13v6m-3-3h6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-red-700">Start your journey</p>
            <h1 id="signup-title" className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Create your account</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">Your routes, reservations, and next adventure. All in one place.</p>
          </div>

          <form onSubmit={handleSubmit} aria-describedby={message ? 'signup-message' : undefined}>
            {message && (
              <div
                id="signup-message"
                role={isSuccess ? 'status' : 'alert'}
                className={`mb-6 flex items-start gap-3 rounded-xl border p-4 text-sm leading-6 ${isSuccess ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}
              >
                <svg aria-hidden="true" className="mt-0.5 shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" />{isSuccess ? <path d="m7 12 3 3 7-7" /> : <path d="M12 7v6m0 3v1" />}</svg>
                <div>
                  <p className="font-semibold">{isSuccess ? 'Your account is ready' : 'We couldn’t create your account'}</p>
                  <p className="break-words">{isSuccess ? 'Registration successful. Log in to start planning your trip.' : message}</p>
                </div>
              </div>
            )}

            <fieldset className="min-w-0 space-y-5">
              <legend className="sr-only">Account details</legend>
              <div>
                <label htmlFor="signup-username" className="block text-sm font-semibold text-slate-700">Username</label>
                <input
                  type="text"
                  id="signup-username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="Choose a username"
                  aria-describedby="signup-username-hint"
                  className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 motion-reduce:transition-none"
                  required
                />
                <p id="signup-username-hint" className="mt-2 text-xs leading-5 text-slate-500">You’ll use this username to log in.</p>
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-semibold text-slate-700">Email address</label>
                <input
                  type="email"
                  id="signup-email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="you@example.com"
                  className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 motion-reduce:transition-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-sm font-semibold text-slate-700">Password</label>
                <div className="relative mt-2">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="signup-password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="Create a password"
                    aria-describedby="signup-password-hint"
                    className="min-h-13 w-full rounded-xl border border-slate-300 bg-white py-3 pr-24 pl-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 motion-reduce:transition-none"
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    aria-controls="signup-password"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute top-1 right-1 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 motion-reduce:transition-none"
                  >
                    <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="3" />
                      {showPassword && <path d="m3 3 18 18" strokeLinecap="round" />}
                    </svg>
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <p id="signup-password-hint" className="mt-2 text-xs leading-5 text-slate-500">Choose a password you don’t use for other accounts.</p>
              </div>

              <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 motion-reduce:transition-none">
                Create my account <span aria-hidden="true">&rarr;</span>
              </button>
            </fieldset>
          </form>

          <div className="mt-7 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-600">Already have an account?</p>
            <Link to="/login" className="mt-2 inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-sm font-bold text-red-700 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">
              Log in to GoBus <span aria-hidden="true" className="ml-2">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RegisterForm

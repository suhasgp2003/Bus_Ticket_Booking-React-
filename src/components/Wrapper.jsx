import { Link, NavLink } from "react-router-dom";
import { ArrowRight, BusFront, LayoutDashboard, LogOut, Moon, Sun, Ticket } from "lucide-react";

const navigationClass = ({ isActive }) =>
  `inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 motion-reduce:transition-none sm:px-4 sm:text-sm ${
    isActive
      ? "bg-red-50 text-red-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-red-700"
  }`;

const Wrapper = ({ token, handlelogout, theme, onThemeToggle, children }) => {
    const logout=()=>{
        handlelogout()
    }
    return (
        <div className="flex min-h-dvh flex-col bg-slate-100 font-sans text-slate-900 antialiased">
          <a href="#main-content" className="absolute top-4 left-4 z-[70] -translate-y-[200%] rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
            Skip to content
          </a>

          <header className="shrink-0 border-b border-slate-200 bg-white shadow-sm">
            <div aria-hidden="true" className="h-1 bg-red-600" />
            <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-3 gap-y-3 px-4 py-3 sm:px-6 lg:gap-x-6 lg:px-8 lg:py-4">
              <Link to="/" aria-label="GoBus home" className="mr-auto inline-flex shrink-0 items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm">
                  <BusFront size={23} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-2xl font-extrabold leading-none tracking-tight text-red-700">GoBus</span>
                  <span className="mt-1 hidden text-[10px] font-medium tracking-wide text-slate-500 sm:block">Travel made simple</span>
                </span>
              </Link>

              <nav aria-label="Main navigation" className={`order-last grid w-full gap-1 border-t border-slate-100 pt-3 lg:order-none lg:flex lg:w-auto lg:gap-1 lg:border-t-0 lg:pt-0 ${token ? "grid-cols-3" : "grid-cols-2"}`}>
                {token ? (
                  <>
                    <NavLink to="/dashboard" className={navigationClass}>
                      <LayoutDashboard size={16} aria-hidden="true" className="hidden shrink-0 sm:block" />
                      Dashboard
                    </NavLink>
                    <NavLink to="/buses" className={navigationClass}>
                      <BusFront size={17} aria-hidden="true" className="hidden shrink-0 sm:block" />
                      Buses
                    </NavLink>
                    <NavLink to="/my-bookings" className={navigationClass}>
                      <Ticket size={17} aria-hidden="true" className="hidden shrink-0 sm:block" />
                      My bookings
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" className={navigationClass}>Login</NavLink>
                    <NavLink to="/register" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 motion-reduce:transition-none sm:text-sm">
                      Create account <ArrowRight size={15} aria-hidden="true" className="hidden sm:block" />
                    </NavLink>
                  </>
                )}
              </nav>

              <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={onThemeToggle}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 motion-reduce:transition-none"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                aria-pressed={theme === 'dark'}
              >
                {theme === 'dark' ? <Sun size={19} strokeWidth={1.8} aria-hidden="true" /> : <Moon size={19} strokeWidth={1.8} aria-hidden="true" />}
              </button>
              {token && (
                  <button
                    type="button"
                    aria-label="Logout"
                    className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 motion-reduce:transition-none sm:px-4"
                    onClick={logout}
                  >
                    <LogOut size={17} strokeWidth={1.8} aria-hidden="true" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
              )}
              </div>
            </div>
          </header>

          <main id="main-content" tabIndex={-1} className="mx-auto w-full min-w-0 max-w-6xl flex-1 px-4 py-6 outline-none sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {children}
          </main>

          <footer className="shrink-0 border-t border-slate-200 bg-white">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <div>
                <p className="text-sm font-bold tracking-tight text-red-700">GoBus <span className="ml-2 font-normal text-slate-500">Travel made simple.</span></p>
                <p className="mt-1.5 text-xs leading-5 text-slate-500">© {new Date().getFullYear()} GoBus.</p>
              </div>
              <nav className="flex flex-wrap gap-x-2 gap-y-1 text-sm font-medium text-slate-600 sm:justify-end" aria-label="Footer navigation">
                {token ? (
                  <>
                    <Link to="/buses" className="inline-flex min-h-11 items-center rounded-lg px-3 transition hover:bg-slate-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">Find a bus</Link>
                    <Link to="/my-bookings" className="inline-flex min-h-11 items-center rounded-lg px-3 transition hover:bg-slate-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">My bookings</Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="inline-flex min-h-11 items-center rounded-lg px-3 transition hover:bg-slate-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">Login</Link>
                    <Link to="/register" className="inline-flex min-h-11 items-center rounded-lg px-3 transition hover:bg-slate-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500">Create account</Link>
                  </>
                )}
              </nav>
            </div>
          </footer>
        </div>
    );
    
}
export default Wrapper;

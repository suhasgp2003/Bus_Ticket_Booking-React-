import { Link } from "react-router-dom";

const Wrapper = ({ token, handlelogout, theme, onThemeToggle, children }) => {
    const logout=()=>{
        handlelogout()
    }
    return (
        <div className="flex min-h-screen flex-col bg-slate-100 text-slate-900">
          <header className="border-b border-slate-200 bg-white shadow-sm">
            <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
              <Link to="/" className="mr-auto text-xl font-bold tracking-tight text-blue-700">
                GoBus
              </Link>
              <button
                type="button"
                onClick={onThemeToggle}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                aria-pressed={theme === 'dark'}
              >
                <span aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
              </button>
              {token ? (
                <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
                  <Link
                    to="/dashboard"
                    className="text-sm font-medium text-slate-600 transition hover:text-blue-700"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/buses"
                    className="text-sm font-medium text-slate-600 transition hover:text-blue-700"
                  >
                    Buses
                  </Link>
                  <Link
                    to="/my-bookings"
                    className="text-sm font-medium text-slate-600 transition hover:text-blue-700"
                  >
                    My bookings
                  </Link>
                  <button
                    type="button"
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
                <Link
                    to="/login"
                    className="text-sm font-semibold text-slate-600 transition hover:text-blue-700"
                >
                    Login
                </Link>
                <Link
                    to="/register"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Create account
                </Link>
                </div>
              )}
            </nav>
          </header>
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
          <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p>© {new Date().getFullYear()} GoBus. Travel made simple.</p>
              <nav className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Footer navigation">
                {token ? (
                  <>
                    <Link to="/buses" className="transition hover:text-blue-700">Find a bus</Link>
                    <Link to="/my-bookings" className="transition hover:text-blue-700">My bookings</Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="transition hover:text-blue-700">Login</Link>
                    <Link to="/register" className="transition hover:text-blue-700">Create account</Link>
                  </>
                )}
              </nav>
            </div>
          </footer>
        </div>
    );
    
}
export default Wrapper;

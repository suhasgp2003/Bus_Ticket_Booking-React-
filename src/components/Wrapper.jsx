import { Link } from "react-router-dom";

const Wrapper = ({token, handlelogout, children}) => {
    const logout=()=>{
        handlelogout()
    }
    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
          <header className="border-b border-slate-200 bg-white shadow-sm">
            <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
              <Link to="/" className="mr-auto text-xl font-bold tracking-tight text-blue-700">
                BusGo
              </Link>
              {token ? (
                <div className="flex w-full items-center justify-end gap-3 sm:w-auto">
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
          <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
        </div>
    );
    
}
export default Wrapper;

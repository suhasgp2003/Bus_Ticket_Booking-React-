import { Link } from "react-router-dom";
const Wrapper = ({token, handlelogout, children}) => {
    const logout=()=>{
        handlelogout()
    }
    return (
        <div className="min-h-screen bg-slate-50 p-4 text-slate-900">
           {token ? (
            <button
                type="button"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                onClick={logout}
            >
                Logout
            </button>
           ) : (
            <div className="flex gap-3">
                <Link
                    to="/login"
                    className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                    Login
                </Link>
                <Link
                    to="/register"
                    className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                    Create account
                </Link>
            </div>
           )}
        <main className="mx-auto mt-6 max-w-5xl">{children}</main>
        </div>
    );
    
}
export default Wrapper;

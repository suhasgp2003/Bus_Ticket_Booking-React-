import React from "react";
import { Link } from "react-router-dom";
const Wrapper = ({token, handlelogout, children}) => {
    const logout=()=>{
        handlelogout()
    }
    return (
        <div>
           {token ?(
            
            <button onClick={logout}>Logout</button>
            
           ) :
           <Link to="/login">
           <button>Login</button>
           </Link>
           }
        <main>{children}</main>
        </div>
    );
    
}
export default Wrapper;
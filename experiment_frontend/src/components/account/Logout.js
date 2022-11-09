import React from 'react';
import useAuth from "../../hooks/Auth";

const Logout = () => {
    const {setAuth} = useAuth();

    const logout = () => {
        localStorage.removeItem('refreshToken');
        setAuth(null);
    };

    return (
        <div>
            <button className="button" onClick={()=> logout()}>
                Logout
            </button>
        </div>
    );
};

export default Logout;
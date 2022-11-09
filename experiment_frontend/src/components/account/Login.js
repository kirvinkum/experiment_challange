import {useRef,useState,useEffect} from 'react';
import useAuth from "../../hooks/Auth";
import {useLocation, useNavigate} from "react-router-dom";
import axios from '../../api/Axios';
const LOGIN_URL = '/auth/token';

const Login = () => {

    const {setAuth} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const userRef = useRef();
    const errRef = useRef();
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, password])


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(LOGIN_URL, {
                username: user,
                password: password
            });
            const accessToken = response?.data.access;
            setAuth({user, accessToken});
            localStorage.setItem("refreshToken", response?.data.refresh)//TODO: later remove this
            setUser('');
            setPassword('');
            navigate(from, { replace: true });
        } catch (err){
            setErrMsg('Incorrect username or password. ');
            errRef.current.focus();
        }
    }


    return (
            <div className="center-col">
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1 className="underline">Login to your account</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    <p>Demo username: demouser , Password: dE£RFCGE2SFW</p>
                    <button className="button">Login</button>
                </form>
            </div>
    );
};

export default Login;
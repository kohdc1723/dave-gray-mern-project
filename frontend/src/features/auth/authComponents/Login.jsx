import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../authSlice";
import { useLoginMutation } from "../authApiSlice";
import usePersist from "../../../hooks/usePersist";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const usernameRef = useRef();
    const errorRef = useRef();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [persist, setPersist] = usePersist();

    const [login, { isLoading }] = useLoginMutation();

    useEffect(() => {
        usernameRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg("");
    }, [username, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try  {
            const { accessToken } = await login({ username, password }).unwrap();
            dispatch(setCredentials({ accessToken }));
            setUsername("");
            setPassword("");
            navigate("/dash");
        } catch (err) {
            if (!err?.status) {
                setErrMsg("no server response");
            } else if (err.status === 400) {
                setErrMsg("missing username or password");
            } else if (err.status === 401) {
                setErrMsg("unauthorized");
            } else {
                setErrMsg(err.data?.message);
            }

            errorRef.current.focus();
        }
    };

    const handleChangeUsername = (e) => setUsername(e.target.value);
    const handleChangePassword = (e) => setPassword(e.target.value);
    const handleToggle = () => setPersist(prev => !prev);

    if (isLoading) {
        return <p>Loading...</p>;
    } else {
        return (
            <main className="login">
                <div className="login-window">
                    <h2>Login</h2>

                    <p
                        ref={errorRef}
                        className={errMsg ? "errmsg" : "offscreen"}
                        aria-live="assertive"
                    >
                        {errMsg}
                    </p>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <label htmlFor="username">
                            Username:
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            id="username"
                            ref={usernameRef}
                            value={username}
                            onChange={handleChangeUsername}
                            autoComplete="off"
                            required
                        />

                        <label htmlFor="password">
                            Password:
                        </label>
                        <input
                            type="password"
                            className="form-input"
                            id="password"
                            onChange={handleChangePassword}
                            value={password}
                            required
                        />

                        <label htmlFor="persist" className="login-persist">
                            Trust this device?
                            <input
                                type="checkbox"
                                className="login-persist-checkbox"
                                id="persist"
                                onChange={handleToggle}
                                checked={persist}
                            />
                        </label>

                        <button className="login-submit-button">
                            Sign In
                        </button>
                        
                        <Link className="login-home-link" to="/">Go back to home</Link>
                    </form>
                </div>
            </main>
        );
    }
};

export default Login;
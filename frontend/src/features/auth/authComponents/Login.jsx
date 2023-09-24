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
            <section className="public">
                <header>
                    <h1>Employee Login</h1>
                </header>
                <main className="login">
                    <p
                        ref={errorRef}
                        className={errMsg ? "errmsg" : "offscreen"}
                        aria-live="assertive"
                    >
                        {errMsg}
                    </p>
                    <form className="form" onSubmit={handleSubmit}>
                        <label htmlFor="username">
                            Username:
                        </label>
                        <input
                            type="text"
                            className="form__input"
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
                            className="form__input"
                            id="password"
                            onChange={handleChangePassword}
                            value={password}
                            required
                        />

                        <label htmlFor="persist" className="form__persist">
                            <input
                                type="checkbox"
                                className="form__checkbox"
                                id="persist"
                                onChange={handleToggle}
                                checked={persist}
                            />
                            Trust this device
                        </label>

                        <button className="form__submit-button">
                            Sign In
                        </button>
                    </form>
                </main>
                <footer>
                    <Link to="/">Back to Home</Link>
                </footer>
            </section>
        );
    }
};

export default Login;
import { useRef, useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../authSlice";
import { useRefreshMutation } from "../authApiSlice";
import usePersist from "../../../hooks/usePersist";

const PersistLogin = () => {
    const [persist] = usePersist();
    const token = useSelector(selectCurrentToken);
    const effectRan = useRef(false);

    const [trueSuccess, setTrueSuccess] = useState(false);

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation();

    useEffect(() => {
        if (effectRan.current === true || process.env.NODE_ENV !== "development") {
            const verifyRefreshToken = async () => {
                try {
                    await refresh();
                    setTrueSuccess(true);
                } catch (err) {
                    console.error(err);
                }
            };

            if (!token && persist) {
                verifyRefreshToken();
            }
        }

        return () => effectRan.current = true;
    }, [persist, refresh, token]);

    if (!persist) { // persist X
        return <Outlet />;
    } else if (isLoading) { // persist O, token X
        return <p>Loading...</p>;
    } else if (isError) { // persist O, token X
        return (
            <p className="errmsg">
                {error.data?.message} - <Link to="/login">please login again</Link>
            </p>
        );
    } else if (isSuccess && trueSuccess) { // persist O, token O
        return <Outlet />;
    } else if (token && isUninitialized) { // persist O, token O
        return <Outlet />;
    }
};

export default PersistLogin;
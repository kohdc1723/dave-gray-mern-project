import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const DashFooter = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const { username, status } = useAuth();

    const onClickHome = () => navigate("/dash");

    const homeButton = (pathname !== "/dash") ? (
        <button
            className="dash-footer__button icon-button"
            title="Home"
            onClick={onClickHome}
        >
            <FontAwesomeIcon icon={faHouse} />
        </button>
    ) : (
        null
    );

    return (
        <footer className="dash-footer">
            {homeButton}
            <p>Current User: {username}</p>
            <p>Status: {status}</p>
        </footer>
    );
};

export default DashFooter;
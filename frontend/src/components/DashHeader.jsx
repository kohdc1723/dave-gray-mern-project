import { useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faRightFromBracket,
    faFileCirclePlus,
    faFilePen,
    faUserGear,
    faUserPlus
} from "@fortawesome/free-solid-svg-icons";
import { useSignoutMutation } from "../features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";

const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { isManager, isAdmin } = useAuth();

    const [signout, { isLoading, isSuccess, isError, error }] = useSignoutMutation();

    useEffect(() => {
        if (isSuccess) {
            navigate("/");
        }
    }, [isSuccess, navigate]);

    const handleClickNewNote = () => navigate("/dash/notes/new");
    const handleClickNewUser = () => navigate("/dash/users/new");
    const handleClickNotes = () => navigate("/dash/notes");
    const handleClickUsers = () => navigate("/dash/users");

    const dashClass = (
        !DASH_REGEX.test(pathname) &&
        !NOTES_REGEX.test(pathname) &&
        !USERS_REGEX.test(pathname)
    ) ? "dash-header__container--small" : "";

    const logoutButton = (
        <button
            className="icon-button"
            title="Sign Out"
            onClick={signout}
        >
            <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
    );

    const newNoteButton = NOTES_REGEX.test(pathname) ? (
        <button
            className="icon-button"
            title="New Note"
            onClick={handleClickNewNote}
        >
            <FontAwesomeIcon icon={faFileCirclePlus} />
        </button>
    ) : (
        null
    );

    const newUserButton = USERS_REGEX.test(pathname) ? (
        <button
            className="icon-button"
            title="New User"
            onClick={handleClickNewUser}
        >
            <FontAwesomeIcon icon={faUserPlus} />
        </button>
    ) : (
        null
    );

    const notesButton = (!NOTES_REGEX.test(pathname) && pathname.includes("/dash")) ? (
        <button
            className="icon-button"
            title="Notes"
            onClick={handleClickNotes}
        >
            <FontAwesomeIcon icon={faFilePen} />
        </button>
    ) : (
        null
    );

    const usersButton = (
        (isManager || isAdmin) &&
        !USERS_REGEX.test(pathname) &&
        pathname.includes('/dash')
    ) ? (
        <button
            className="icon-button"
            title="Users"
            onClick={handleClickUsers}
        >
            <FontAwesomeIcon icon={faUserGear} />
        </button>
    ) : (
        null
    );

    const buttons = isLoading ? (
        <p>Logging out...</p>
    ) : (
        <>
            {newNoteButton}
            {notesButton}
            {newUserButton}
            {usersButton}
            {logoutButton}
        </>
    );

    return (
        <>
            <p className={isError ? "errmsg" : "offscreen"}>{error?.data?.message}</p>
            <header className="dash-header">
                <div className={`dash-header__container`}> {/*dashClass*/}
                    <Link to="/dash">
                        <h1 className="dash-header__title">TechNotes</h1>
                    </Link>
                    <nav className="dash-header__nav">
                        {buttons}
                    </nav>
                </div>
            </header>
        </>
    );
};

export default DashHeader;
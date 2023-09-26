import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { useCreateUserMutation } from "../usersApiSlice";
import ROLES from "../../../config/roles";

const USERNAME_REGEX = /^[A-z]{3,20}$/;
const PASSWORD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const NewUserForm = () => {
    const [username, setUsername] = useState("");
    const [validUsername, setValidUsername] = useState(false);
    const [password, setPassword] = useState("");
    const [validPassword, setValidPassword] = useState(false);
    const [roles, setRoles] = useState(["Employee"]);

    const navigate = useNavigate();
    const [createUser, { isLoading, isSuccess, isError, error }] = useCreateUserMutation();

    useEffect(() => {
        setValidUsername(USERNAME_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setValidPassword(PASSWORD_REGEX.test(password));
    }, [password]);

    useEffect(() => {
        if (isSuccess) {
            setUsername("");
            setPassword("");
            setRoles([]);

            navigate("/dash/users");
        }
    }, [isSuccess, navigate]);

    const onChangeUsername = e => setUsername(e.target.value);
    const onChangePassword = e => setPassword(e.target.value);
    const onChangeRoles = e => {
        const values = Array.from(e.target.selectedOptions, option => option.value);
        setRoles(values);
    };
    const isValid = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;
    const onSubmitForm = async (e) => {
        e.preventDefault();

        if (isValid) await createUser({ username, password, roles });
    };

    return (
        <>
            <p className={isError ? "errmsg" : "offscreen"}>{error?.data?.message}</p>

            <form className="form" onSubmit={onSubmitForm}>
                <div className="form-title-row">
                    <h2>New User</h2>
                    <div className="form-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!isValid}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>
                <label className="form-label" htmlFor="username">
                    Username: <span className="nowrap">[3-20 letters]</span></label>
                <input
                    className={`form-input ${!validUsername ? "form-input-incomplete" : ""}`}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onChangeUsername}
                />

                <label className="form-label" htmlFor="password">
                    Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
                </label>
                <input
                    className={`form-input ${!validPassword ? "form-input-incomplete" : ""}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onChangePassword}
                />

                <label className="form-label" htmlFor="roles">
                    ASSIGNED ROLES:
                </label>
                <select
                    id="roles"
                    name="roles"
                    className={`form-select ${!Boolean(roles.length) ? "form-input-incomplete" : ""}`}
                    multiple={true}
                    size="3"
                    value={roles}
                    onChange={onChangeRoles}
                >
                    {Object.values(ROLES).map(role => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
            </form>
        </>
    );
};

export default NewUserForm;
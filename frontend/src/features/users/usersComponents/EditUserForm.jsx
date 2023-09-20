import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useUpdateUserMutation, useDeleteUserMutation } from "../usersApiSlice";
import ROLES from "../../../config/roles";

const USERNAME_REGEX = /^[A-z]{3,20}$/;
const PASSWORD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const EditUserForm = ({ user }) => {
    const [username, setUsername] = useState(user.username);
    const [validUsername, setValidUsername] = useState(false);
    const [password, setPassword] = useState("");
    const [validPassword, setValidPassword] = useState(false);
    const [roles, setRoles] = useState(user.roles);
    const [active, setActive] = useState(user.active);

    const navigate = useNavigate();

    const [updateUser, {
        isLoading: isUpdateLoading,
        isSuccess: isUpdateSuccess,
        isError: isUpdateError,
        error: updateError
    }] = useUpdateUserMutation();

    const [deleteUser, {
        isSuccess: isDeleteSuccess,
        isError: isDeleteError,
        error: deleteError
    }] = useDeleteUserMutation();

    useEffect(() => {
        setValidUsername(USERNAME_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setValidPassword(PASSWORD_REGEX.test(password));
    }, [password]);

    useEffect(() => {
        if (isUpdateSuccess || isDeleteSuccess) {
            setUsername("");
            setPassword("");
            setRoles([]);

            navigate("/dash/users");
        }
    }, [isUpdateSuccess, isDeleteSuccess, navigate]);

    const onChangeUsername = e => setUsername(e.target.value);
    const onChangePassword = e => setPassword(e.target.value);

    const onChangeRoles = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        );

        setRoles(values);
    };

    const onChangeActive = () => setActive(prev => !prev);

    const onClickSave = async (e) => {
        if (password) {
            await updateUser({ id: user.id, username, password, roles, active });
        } else {
            await updateUser({ id: user.id, username, roles, active });
        }
    };
    const onClickDelete = async () => {
        await deleteUser({ id: user.id });
    };

    let isValid = password
        ? [roles.length, validUsername, validPassword].every(Boolean) && !isUpdateLoading
        : [roles.length, validUsername].every(Boolean) && !isUpdateLoading;

    return (
        <>
            <p className={(isUpdateError || isDeleteError) ? "errmsg" : "offscreen"}>
                {(updateError?.data?.message || deleteError?.data?.message) ?? ""}
            </p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit User</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={onClickSave}
                            disabled={!isValid}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={onClickDelete}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="username">
                    Username: <span className="nowrap">[3-20 letters]</span>
                </label>
                <input
                    className={`form__input ${!validUsername ? "form__input--incomplete" : ""}`}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onChangeUsername}
                />

                <label className="form__label" htmlFor="password">
                    Password:
                    <span className="nowrap">[empty = no change]</span>
                    <span className="nowrap">[4-12 chars incl. !@#$%]</span>
                </label>
                <input
                    className={`form__input ${password && !validPassword ? "form__input--incomplete" : ""}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onChangePassword}
                />

                <label className="form__label form__checkbox-container" htmlFor="user-active">
                    ACTIVE:
                    <input
                        className="form__checkbox"
                        id="user-active"
                        name="user-active"
                        type="checkbox"
                        checked={active}
                        onChange={onChangeActive}
                    />
                </label>

                <label className="form__label" htmlFor="roles">
                    ASSIGNED ROLES:
                </label>
                <select
                    id="roles"
                    name="roles"
                    className={`form__select ${!Boolean(roles.length) ? "form__input--incomplete" : ""}`}
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

export default EditUserForm;
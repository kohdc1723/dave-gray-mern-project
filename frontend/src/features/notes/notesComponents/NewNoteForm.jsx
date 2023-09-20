import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { useCreateNoteMutation } from "../notesApiSlice";

const NewNoteForm = ({ users }) => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [userId, setUserId] = useState();

    const [createNote, { isLoading, isSuccess, isError, error }] = useCreateNoteMutation();

    useEffect(() => {
        if (isSuccess) {
            setTitle("");
            setText("");
            setUserId("");
            navigate("/dash/notes");
        }
    }, [isSuccess, navigate]);

    const handleChangeTitle = e => setTitle(e.target.value);
    const handleChangeText = e => setText(e.target.value);
    const handleChangeUserId = e => setUserId(e.target.value);

    const isValid = [title, text, userId].every(Boolean) && !isLoading;

    const handleClickSave = async (e) => {
        e.preventDefault();

        if (isValid) {
            await createNote({ user: userId, title, text });
        }
    };

    return (
        <>
            <p className={isError ? "errmsg" : "offscreen"}>
                {error?.data?.message}
            </p>

            <form className="form" onSubmit={handleClickSave}>
                <div className="form__title-row">
                    <h2>New Note</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!isValid}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="title">
                    Title:
                </label>
                <input
                    className={`form__input ${!title ? "form__input--incomplete" : ""}`}
                    id="title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    value={title}
                    onChange={handleChangeTitle}
                />

                <label className="form__label" htmlFor="text">
                    Text:</label>
                <textarea
                    className={`form__input form__input--text ${!text ? "form__input--incomplete" : ""}`}
                    id="text"
                    name="text"
                    value={text}
                    onChange={handleChangeText}
                />

                <label className="form__label form__checkbox-container" htmlFor="username">
                    ASSIGNED TO:
                </label>
                <select
                    id="username"
                    name="username"
                    className="form__select"
                    value={userId}
                    onChange={handleChangeUserId}
                >
                    {users.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.username} 
                        </option>
                    ))}
                </select>
            </form>
        </>
    );
};

export default NewNoteForm;
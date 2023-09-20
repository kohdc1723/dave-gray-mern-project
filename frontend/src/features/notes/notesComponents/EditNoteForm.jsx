import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useUpdateNoteMutation, useDeleteNoteMutation } from "../notesApiSlice";

const EditNoteForm = ({ note, users }) => {
    const navigate = useNavigate();

    const [title, setTitle] = useState(note.title);
    const [text, setText] = useState(note.text);
    const [completed, setCompleted] = useState(note.completed);
    const [userId, setUserId] = useState(note.user);

    const [updateNote, {
        isLoading: isUpdateLoading,
        isSuccess: isUpdateSuccess,
        isError: isUpdateError,
        error: updateError
    }] = useUpdateNoteMutation();
    const [deleteNote, {
        isSuccess: isDeleteSuccess,
        isError: isDeleteError,
        error: deleteError
    }] = useDeleteNoteMutation();

    useEffect(() => {
        if (isUpdateSuccess || isDeleteSuccess) {
            setTitle("");
            setText("");
            setUserId("");
            navigate("/dash/notes");
        }
    }, [isUpdateSuccess, isDeleteSuccess, navigate]);

    const handleChangeTitle = e => setTitle(e.target.value);
    const handleChangeText = e => setText(e.target.value);
    const handleChangeCompleted = e => setCompleted(prev => !prev);
    const handleChangeUserId = e => setUserId(e.target.value);

    const isValid = [title, text, userId].every(Boolean) && !isUpdateLoading;

    const handleClickSave = async () => {
        if (isValid) {
            await updateNote({ id: note.id, user: userId, title, text, completed })
        }
    };

    const handleClickDelete = async () => {
        await deleteNote({ id: note.id });
    };

    const createdAt = new Date(note.createdAt).toLocaleString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
    });

    const updatedAt = new Date(note.updatedAt).toLocaleString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
    });

    return (
        <>
            <p className={(isUpdateError || isDeleteError) ? "errmsg" : "offscreen"}>
                {(updateError?.data?.message || deleteError?.data?.message) ?? ""}
            </p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form__title-row">
                    <h2>Edit Note #{note.ticket}</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={handleClickSave}
                            disabled={!isValid}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        <button
                            className="icon-button"
                            title="Delete"
                            onClick={handleClickDelete}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="note-title">
                    Title:
                </label>
                <input
                    className={`form__input ${!title ? "form__input--incomplete" : ""}`}
                    id="note-title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    value={title}
                    onChange={handleChangeTitle}
                />

                <label className="form__label" htmlFor="note-text">
                    Text:</label>
                <textarea
                    className={`form__input form__input--text ${!text ? "form__input--incomplete" : ""}`}
                    id="note-text"
                    name="text"
                    value={text}
                    onChange={handleChangeText}
                />
                <div className="form__row">
                    <div className="form__divider">
                        <label className="form__label form__checkbox-container" htmlFor="note-completed">
                            WORK COMPLETE:
                            <input
                                className="form__checkbox"
                                id="note-completed"
                                name="completed"
                                type="checkbox"
                                checked={completed}
                                onChange={handleChangeCompleted}
                            />
                        </label>

                        <label className="form__label form__checkbox-container" htmlFor="note-username">
                            ASSIGNED TO:
                        </label>
                        <select
                            id="note-username"
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
                    </div>
                    <div className="form__divider">
                        <p className="form__created">Created:<br />{createdAt}</p>
                        <p className="form__updated">Updated:<br />{updatedAt}</p>
                    </div>
                </div>
            </form>
        </>
    );
};

export default EditNoteForm;
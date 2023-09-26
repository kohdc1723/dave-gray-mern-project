import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useUpdateNoteMutation, useDeleteNoteMutation } from "../notesApiSlice";
import useAuth from "../../../hooks/useAuth";

const EditNoteForm = ({ note, users }) => {
    const navigate = useNavigate();

    const { isManager, isAdmin } = useAuth();

    const [title, setTitle] = useState(note.title);
    const [text, setText] = useState(note.text);
    const [completed, setCompleted] = useState(note.completed);
    // const [userId, setUserId] = useState(note.user);

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
            // setUserId("");
            navigate("/dash/notes");
        }
    }, [isUpdateSuccess, isDeleteSuccess, navigate]);

    const handleChangeTitle = e => setTitle(e.target.value);
    const handleChangeText = e => setText(e.target.value);
    const handleChangeCompleted = e => setCompleted(prev => !prev);
    // const handleChangeUserId = e => setUserId(e.target.value);

    const isValid = [title, text, note?.user].every(Boolean) && !isUpdateLoading;

    const handleClickSave = async () => {
        if (isValid) {
            await updateNote({ id: note.id, user: note?.user, title, text, completed })
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

    const deleteButton = (isManager || isAdmin) ? (
        <button
            className="icon-button"
            title="Delete"
            onClick={handleClickDelete}
        >
            <FontAwesomeIcon icon={faTrashCan} />
        </button>
    ) : (
        null
    );

    return (
        <>
            <p className={(isUpdateError || isDeleteError) ? "errmsg" : "offscreen"}>
                {(updateError?.data?.message || deleteError?.data?.message) ?? ""}
            </p>

            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form-title-row">
                    <h2>Edit Note #{note.ticket}</h2>
                    <div className="form-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            onClick={handleClickSave}
                            disabled={!isValid}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                        {deleteButton}
                    </div>
                </div>

                <label className="form-label" htmlFor="note-title">
                    Title:
                </label>
                <input
                    className={`form-input ${!title ? "form-input-incomplete" : ""}`}
                    id="note-title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    value={title}
                    onChange={handleChangeTitle}
                />

                <label className="form-label" htmlFor="note-text">
                    Text:</label>
                <textarea
                    className={`form-input form-input-textarea ${!text ? "form-input-incomplete" : ""}`}
                    id="note-text"
                    name="text"
                    value={text}
                    onChange={handleChangeText}
                />

                <div className="form-row">
                    <div className="form-divider">
                        <label className="form-label form-checkbox-container" htmlFor="note-completed">
                            Completed:
                            <input
                                className="form-checkbox"
                                id="note-completed"
                                name="completed"
                                type="checkbox"
                                checked={completed}
                                onChange={handleChangeCompleted}
                            />
                        </label>

                        {/* <label className="form-label form-checkbox-container" htmlFor="note-username">
                            Assigned to:
                        </label>
                        <select
                            id="note-username"
                            name="username"
                            className="form-select"
                            value={userId}
                            onChange={handleChangeUserId}
                        >
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.username}
                                </option>
                            ))}
                        </select> */}
                    </div>
                    <div className="form-divider">
                        <p><b>Created:</b><br />{createdAt}</p>
                        <p><b>Updated:</b><br />{updatedAt}</p>
                    </div>
                </div>
            </form>
        </>
    );
};

export default EditNoteForm;
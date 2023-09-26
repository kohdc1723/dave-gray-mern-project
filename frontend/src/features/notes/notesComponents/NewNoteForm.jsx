import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { useCreateNoteMutation } from "../notesApiSlice";

const NewNoteForm = ({ userId }) => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [text, setText] = useState("");

    const [createNote, { isLoading, isSuccess, isError, error }] = useCreateNoteMutation();

    useEffect(() => {
        if (isSuccess) {
            setTitle("");
            setText("");
            navigate("/dash/notes");
        }
    }, [isSuccess, navigate]);

    const handleChangeTitle = e => setTitle(e.target.value);
    const handleChangeText = e => setText(e.target.value);

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
                <div className="form-title-row">
                    <h2>New Note</h2>
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
                <label className="form-label" htmlFor="title">
                    Title:
                </label>
                <input
                    className={`form-input ${!title ? "form-input-incomplete" : ""}`}
                    id="title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    value={title}
                    onChange={handleChangeTitle}
                />

                <label className="form-label" htmlFor="text">
                    Text:
                </label>
                <textarea
                    className={`form-input form-input-textarea ${!text ? "form-input-incomplete" : ""}`}
                    id="text"
                    name="text"
                    value={text}
                    onChange={handleChangeText}
                />
            </form>
        </>
    );
};

export default NewNoteForm;
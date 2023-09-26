import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { memo } from "react";
import { useGetNotesQuery } from "../notesApiSlice";

const Note = ({ noteId }) => {
    const navigate = useNavigate();
    const { note } = useGetNotesQuery("notesList", {
        selectFromResult: ({ data }) => ({
            note: data?.entities[noteId]
        })
    });

    if (note) {
        const createdAt = new Date(note.createdAt).toLocaleString("en-US", {
            day: "numeric",
            month: "long"
        });
        const updatedAt = new Date(note.updatedAt).toLocaleString("en-US", {
            day: "numeric",
            month: "long"
        });

        const onClickEdit = () => navigate(`/dash/notes/${noteId}`);

        return (
            <tr>
                <td className="table-cell note-status">
                    {note.completed
                        ? <span className="note-status-completed">Completed</span>
                        : <span className="note-status-open">Open</span>
                    }
                </td>
                <td className="table-cell">{createdAt}</td>
                <td className="table-cell">{updatedAt}</td>
                <td className="table-cell">{note.title}</td>
                <td className="table-cell">{note.username}</td>

                <td className="table-cell">
                    <button
                        className="icon-button table-button"
                        onClick={onClickEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        );
    } else {
        return null;
    }
};

const memoizedNote = memo(Note);

export default memoizedNote;
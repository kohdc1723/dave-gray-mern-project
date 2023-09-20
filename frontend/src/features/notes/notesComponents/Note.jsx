import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectNoteById } from '../notesApiSlice'

const Note = ({ noteId }) => {
    const navigate = useNavigate();
    const note = useSelector(state => selectNoteById(state, noteId));

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
            <tr className="table__row">
                <td className="table__cell note__status">
                    {note.completed
                        ? <span className="note__status--completed">Completed</span>
                        : <span className="note__status--open">Open</span>
                    }
                </td>
                <td className="table__cell note__created">{createdAt}</td>
                <td className="table__cell note__updated">{updatedAt}</td>
                <td className="table__cell note__title">{note.title}</td>
                <td className="table__cell note__username">{note.username}</td>

                <td className="table__cell">
                    <button
                        className="icon-button table__button"
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

export default Note;
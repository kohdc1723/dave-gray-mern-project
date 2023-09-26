import { useParams } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { useGetNotesQuery } from "../notesApiSlice";
import { useGetUsersQuery } from "../../users/usersApiSlice";
import { EditNoteForm } from "./";
import useAuth from "../../../hooks/useAuth";

const EditNote = () => {
    const { id } = useParams();
    const { username, isManager, isAdmin } = useAuth();

    const { note } = useGetNotesQuery("notesList", {
        selectFromResult: ({ data }) => ({
            note: data?.entities[id]
        })
    });

    const { users } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            users: data?.ids.map(id => data?.entities[id])
        })
    });


    if (!note || !users?.length) {
        return <PulseLoader color={"#FFF"} />;
    } else if (!isManager && !isAdmin && (note.username !== username)) {
        return <p className="errmsg">no access</p>
    } else {
        return <EditNoteForm note={note} users={users} />;
    }
};

export default EditNote;
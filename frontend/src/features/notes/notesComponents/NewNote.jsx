import { useSelector } from "react-redux";
import { selectAllUsers } from "../../users/usersApiSlice";
import { NewNoteForm } from "./";

const NewNote = () => {
    const users = useSelector(selectAllUsers);

    if (!users?.length) {
        return <p>currently not available</p>
    } else {
        return <NewNoteForm users={users} />;
    }
};

export default NewNote;
import { useSelector } from "react-redux";
import { selectAllUsers } from "../../users/usersApiSlice";
import { NewNoteForm } from "./";

const NewNote = () => {
    const users = useSelector(selectAllUsers);
    console.log(users);
    
    return (users ? (
        <NewNoteForm users={users} />
    ) : (
        <p>Loading...</p>
    ));
};

export default NewNote;
import { NewNoteForm } from "./";
import { useGetUsersQuery } from "../../users/usersApiSlice";
import PulseLoader from "react-spinners/PulseLoader";
import useAuth from "../../../hooks/useAuth";

const NewNote = () => {
    const { username } = useAuth();
    const { userId } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => {
            const users = data?.ids.map(id => data.entities[id]);
            const user = users?.find(user => user.username === username);
            const userId = user?._id;

            return { userId };
        }
    });

    if (!userId) {
        return <PulseLoader color={"#FFF"} />;
    } else {
        return <NewNoteForm userId={userId} />;
    }
};

export default NewNote;
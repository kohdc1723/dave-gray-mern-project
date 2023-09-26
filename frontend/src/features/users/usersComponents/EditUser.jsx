import { useParams } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { EditUserForm } from "./";
import { useGetUsersQuery } from "../usersApiSlice";

const EditUser = () => {
    const { id } = useParams();
    
    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[id]
        })
    });

    return (user ? (
        <EditUserForm user={user} />
    ) : (
        <PulseLoader color={"#FFF"} />
    ));
};

export default EditUser;
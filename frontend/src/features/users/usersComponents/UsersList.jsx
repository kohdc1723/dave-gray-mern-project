import { useGetUsersQuery } from "../usersApiSlice";
import { User } from "./";

const UsersList = () => {
    const { 
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery("usersList", {
        pollingInterval: 60000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    });

    if (isLoading) {
        return (
            <p>Loading...</p>
        );
    } else if (isError) {
        return (
            <p className="errmsg">{error?.data?.message}</p>
        );
    } else if (isSuccess) {
        const { ids } = users;

        const tableContent = ids?.length
            ? ids.map(userId => <User key={userId} userId={userId} />)
            : null;
        
        return (
            <table className="table">
                <thead className="table-thead">
                    <tr>
                        <th scope="col" className="table-th">Username</th>
                        <th scope="col" className="table-th">Roles</th>
                        <th scope="col" className="table-th">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        );
    }
};

export default UsersList;
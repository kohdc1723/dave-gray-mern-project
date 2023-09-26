import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom";
import { memo } from "react";
import { useGetUsersQuery } from "../usersApiSlice";

const User = ({ userId }) => {
    const navigate = useNavigate();
    
    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[userId]
        })
    });

    if (user) {
        const onClickEdit = () => navigate(`/dash/users/${userId}`);
        const userRolesString = user.roles.toString().replaceAll(",", ", ");
        const cellStatus = user.active ? "" : "table-cell-inactive";

        return (
            <tr>
                <td className={`table-cell ${cellStatus}`}>{user.username}</td>
                <td className={`table-cell ${cellStatus}`}>{userRolesString}</td>
                <td className={`table-cell ${cellStatus}`}>
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

const memoizedUser = memo(User);

export default memoizedUser;
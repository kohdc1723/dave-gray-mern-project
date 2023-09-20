import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserById } from "../usersApiSlice";

const User = ({ userId }) => {
    const navigate = useNavigate();
    const user = useSelector(state => selectUserById(state, userId));

    if (user) {
        const onClickEdit = () => navigate(`/dash/users/${userId}`);
        const userRolesString = user.roles.toString().replaceAll(",", ", ");
        const cellStatus = user.active ? "" : "table_cell--inactive";

        return (
            <tr className="table__row user">
                <td className={`table__cell ${cellStatus}`}>{user.username}</td>
                <td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
                <td className={`table__cell ${cellStatus}`}>
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

export default User;
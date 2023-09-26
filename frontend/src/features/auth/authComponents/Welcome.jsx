import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const Welcome = () => {
    const { username, isManager, isAdmin } = useAuth();

    return (
        <section className="welcome">
            <h1>Welcome {username}!</h1>
            <p><Link to="/dash/notes">View To-Do Notes</Link></p>
            <p><Link to="/dash/notes/new">Add New To-Do Note</Link></p>
            {(isManager || isAdmin) && <p><Link to="/dash/users">View Users List</Link></p>}
            {(isManager || isAdmin) && <p><Link to="/dash/users/new">Add New User</Link></p>}
        </section>
    );
};

export default Welcome;
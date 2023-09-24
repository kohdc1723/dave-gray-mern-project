import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const Welcome = () => {
    const today = new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
        timeStyle: "long"
    }).format(new Date());

    const { username, isManager, isAdmin } = useAuth();

    return (
        <section className="welcome">
            <p>{today}</p>
            <h1>Welcome {username}!</h1>
            <p><Link to="/dash/notes">View Tech Notes</Link></p>
            <p><Link to="/dash/notes/new">Add New Tech Note</Link></p>
            {(isManager || isAdmin) && <p><Link to="/dash/users">View User List</Link></p>}
            {(isManager || isAdmin) && <p><Link to="/dash/users/new">Add New User</Link></p>}
        </section>
    );
};

export default Welcome;
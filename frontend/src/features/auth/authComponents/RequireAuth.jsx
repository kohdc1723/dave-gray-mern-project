import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const location = useLocation();
    const { roles } = useAuth();

    if (roles.some(role => allowedRoles.includes(role))) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" state={{ from: location }} replace />
    }
};

export default RequireAuth;
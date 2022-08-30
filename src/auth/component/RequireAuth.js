import {useLocation, Navigate, Outlet, useParams} from "react-router-dom";
import useAuth from "../hook/useAuth";
import {GET_ROUTE_WITH_ROLE} from "../../global/utils";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();
    const params = useParams();

    return (
        allowedRoles?.includes(auth?.role) && params.route === GET_ROUTE_WITH_ROLE(auth.role)
            ? <Outlet />
            : auth
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;
import {Navigate, useLocation} from "react-router-dom";
import useAuth from "../hook/useAuth";
import Missing from "../../components/missing/Missing";
import {GET_ROUTE_WITH_ROLE} from "../../global/utils";

const ManageRoute = () => {
    const { auth } = useAuth();
    const location = useLocation();
    return (
            auth ? location.pathname === "/" ? <Navigate to={`/${GET_ROUTE_WITH_ROLE(auth.role)}/general/incidents`} /> : <Missing />
            : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default ManageRoute;
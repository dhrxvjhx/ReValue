import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRedirect = () => {
    const { userData, loading } = useAuth();

    if (loading) return null;

    switch (userData?.role) {
        case "admin":
            return <Navigate to="/admin/overview" replace />;
        case "agent":
            return <Navigate to="/agent" replace />;
        default:
            return <Navigate to="/dashboard" replace />;
    }
};

export default RoleRedirect;
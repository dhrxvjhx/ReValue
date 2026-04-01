import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleProtectedRoute = ({ children, allowedRole }) => {
    const { userData, loading } = useAuth();

    if (loading) return <div className="text-white">Loading...</div>;

    if (userData?.role !== allowedRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RoleProtectedRoute;
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
    const { currentUser, userData, loading } = useAuth();

    if (loading) return null;

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (userData?.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
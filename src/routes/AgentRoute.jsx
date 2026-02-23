import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AgentRoute = ({ children }) => {
    const { currentUser, userData, loading } = useAuth();

    if (loading) return null;

    if (!currentUser) return <Navigate to="/auth" replace />;

    if (userData?.role !== "agent")
        return <Navigate to="/" replace />;

    return children;
};

export default AgentRoute;
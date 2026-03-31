import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { subscribeToNotifications } from "../firebase/notificationService";

function NotificationBell() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = subscribeToNotifications(
            currentUser.uid,
            setNotifications
        );

        return () => unsubscribe();
    }, [currentUser]);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="relative">
            <button onClick={() => navigate("/notifications")}>
                <Bell className="text-white" />
            </button>

            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-1 rounded-full">
                    {unreadCount}
                </span>
            )}
        </div>
    );
}

export default NotificationBell;
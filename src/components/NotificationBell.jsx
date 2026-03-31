import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { subscribeToPickups } from "../firebase/pickupService";
import { onMessageListener } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

function NotificationBell() {
    const { currentUser, userData } = useAuth();
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);

    const audioRef = useRef(null);

    useEffect(() => {
        if (!currentUser || !userData) return;

        // 🔊 SOUND INIT
        audioRef.current = new Audio("/notification.mp3");

        // 🔴 REAL-TIME LOGIC
        const unsubscribe = subscribeToPickups(
            currentUser.uid,
            userData.role,
            (data) => {
                const notifs = data.map((p) => ({
                    id: p.id,
                    text: getNotificationText(p, userData.role),
                    read: false
                }));

                // 🔊 play sound on new notification
                if (notifications.length !== 0) {
                    audioRef.current.play().catch(() => { });
                }

                setNotifications(notifs.slice(0, 10));
            }
        );

        // 🔔 FCM FOREGROUND
        onMessageListener().then((payload) => {
            audioRef.current.play().catch(() => { });
        });

        return () => unsubscribe();
    }, [currentUser, userData]);

    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((n) =>
                n.id === id ? { ...n, read: true } : n
            )
        );
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="relative">
            <button onClick={() => navigate("/notifications")}>
                <Bell className="text-white" />
            </button>

            {/* 🔴 BADGE */}
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs px-1 rounded-full">
                    {unreadCount}
                </span>
            )}

            {/* DROPDOWN */}
            {open && (
                <div className="absolute right-0 mt-3 w-64 bg-[#111827] border border-white/10 rounded-xl shadow-xl p-3 z-50">
                    <h3 className="text-sm font-semibold mb-2">
                        Notifications
                    </h3>

                    {notifications.length === 0 ? (
                        <p className="text-xs text-gray-400">
                            No notifications
                        </p>
                    ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {notifications.map((n) => (
                                <div
                                    key={n.id}
                                    onClick={() => markAsRead(n.id)}
                                    className={`text-xs p-2 rounded cursor-pointer ${n.read
                                        ? "text-gray-500"
                                        : "bg-white/5 text-white"
                                        }`}
                                >
                                    {n.text}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/* 🔥 ROLE BASED TEXT */
function getNotificationText(p, role) {
    if (role === "agent") {
        if (p.status === "assigned") return "🚚 New pickup assigned";
    }

    if (role === "user") {
        if (p.status === "completed") return "✅ Your pickup is completed";
    }

    if (role === "admin") {
        if (p.status === "pending") return "📦 New pickup request";
    }

    return "🔔 Update received";
}

export default NotificationBell;
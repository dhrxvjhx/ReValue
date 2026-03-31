import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    subscribeToNotifications,
    markNotificationAsRead
} from "../firebase/notificationService";
import { db } from "../firebase/firebase";
import {
    collection,
    query,
    where,
    getDocs,
    deleteDoc,
    doc
} from "firebase/firestore";

function Notifications() {
    const { currentUser } = useAuth();

    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState("unread"); // 🔥 DEFAULT FIX

    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = subscribeToNotifications(
            currentUser.uid,
            setNotifications
        );

        return () => unsubscribe();
    }, [currentUser]);

    // 🔥 FILTER LOGIC
    const filtered =
        filter === "unread"
            ? notifications.filter((n) => !n.read)
            : notifications;

    const handleRead = async (id) => {
        await markNotificationAsRead(id);
    };

    const clearAll = async () => {
        const q = query(
            collection(db, "notifications"),
            where("userId", "==", currentUser.uid)
        );

        const snapshot = await getDocs(q);

        snapshot.forEach(async (docSnap) => {
            await deleteDoc(doc(db, "notifications", docSnap.id));
        });
    };

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Notifications</h2>

                <button
                    onClick={clearAll}
                    className="text-red-400 text-sm"
                >
                    Clear All
                </button>
            </div>

            {/* FILTER */}
            <div className="flex gap-2">
                <button
                    onClick={() => setFilter("unread")}
                    className={`px-4 py-1 rounded-xl ${filter === "unread"
                            ? "bg-primary"
                            : "bg-[#1f2937]"
                        }`}
                >
                    Unread
                </button>

                <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-1 rounded-xl ${filter === "all"
                            ? "bg-primary"
                            : "bg-[#1f2937]"
                        }`}
                >
                    All
                </button>
            </div>

            {/* LIST */}
            {filtered.length === 0 ? (
                <div className="text-gray-400 text-sm">
                    {filter === "unread"
                        ? "No unread notifications"
                        : "No notifications"}
                </div>
            ) : (
                filtered.map((n) => (
                    <div
                        key={n.id}
                        onClick={() => handleRead(n.id)}
                        className={`
                            p-4 rounded-xl border cursor-pointer
                            ${n.read
                                ? "bg-[#111827] border-white/10"
                                : "bg-primary/10 border-primary"
                            }
                        `}
                    >
                        <p className="text-sm">{n.title}</p>

                        <p className="text-xs text-gray-400 mt-1">
                            {n.createdAt?.toDate?.().toLocaleString() ||
                                "Just now"}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
}

export default Notifications;
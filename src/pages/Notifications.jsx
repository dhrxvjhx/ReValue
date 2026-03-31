import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    subscribeToNotifications,
    markNotificationAsRead
} from "../firebase/notificationService";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Notifications() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState("all"); // all | unread

    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = subscribeToNotifications(
            currentUser.uid,
            setNotifications
        );

        return () => unsubscribe();
    }, [currentUser]);

    // 🔥 FILTERED DATA
    const filtered =
        filter === "unread"
            ? notifications.filter((n) => !n.read)
            : notifications;

    // 🔥 CLEAR ALL
    const handleClearAll = async () => {
        if (!currentUser) return;

        const q = query(
            collection(db, "notifications"),
            where("userId", "==", currentUser.uid)
        );

        const snapshot = await getDocs(q);

        const deletes = snapshot.docs.map((d) =>
            deleteDoc(doc(db, "notifications", d.id))
        );

        await Promise.all(deletes);
    };

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <ArrowLeft
                        className="cursor-pointer text-gray-400"
                        onClick={() => navigate(-1)}
                    />
                    <h2 className="text-xl font-semibold">
                        Notifications
                    </h2>
                </div>

                <button
                    onClick={handleClearAll}
                    className="text-xs text-red-400 hover:underline"
                >
                    Clear All
                </button>
            </div>

            {/* FILTERS */}
            <div className="flex gap-2">
                <FilterBtn
                    active={filter === "all"}
                    onClick={() => setFilter("all")}
                    label="All"
                />
                <FilterBtn
                    active={filter === "unread"}
                    onClick={() => setFilter("unread")}
                    label="Unread"
                />
            </div>

            {/* LIST */}
            {filtered.length === 0 ? (
                <p className="text-gray-400 text-sm">
                    No notifications
                </p>
            ) : (
                <div className="space-y-3">
                    {filtered.map((n) => (
                        <motion.div
                            key={n.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => markNotificationAsRead(n.id)}
                            className={`
                p-4 rounded-xl border border-white/10 cursor-pointer
                ${n.read ? "bg-[#111827] text-gray-400" : "bg-white/5 text-white"}
              `}
                        >
                            {n.text}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

function FilterBtn({ active, onClick, label }) {
    return (
        <button
            onClick={onClick}
            className={`
        px-3 py-1 rounded-lg text-sm
        ${active ? "bg-primary text-white" : "bg-[#111827] text-gray-400"}
      `}
        >
            {label}
        </button>
    );
}

export default Notifications;
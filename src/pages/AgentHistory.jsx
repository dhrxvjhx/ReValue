import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    collection,
    query,
    where,
    onSnapshot,
    orderBy
} from "firebase/firestore";
import { db } from "../firebase/firebase";

function AgentHistory() {
    const { currentUser } = useAuth();
    const [completed, setCompleted] = useState([]);

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, "pickups"),
            where("assignedAgentId", "==", currentUser.uid),
            where("status", "==", "completed"),
            orderBy("completedAt", "desc")
        );

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setCompleted(data);
            },
            (error) => {
                console.error("Agent history error:", error);
            }
        );

        return () => unsubscribe();
    }, [currentUser]);

    /* 🔥 DAILY SUMMARY CALC (SAFE) */
    const today = new Date().toISOString().split("T")[0];

    const todayPickups = completed.filter(p => {
        if (!p.completedAt || !p.completedAt.toDate) return false;
        const date = p.completedAt.toDate().toISOString().split("T")[0];
        return date === today;
    });

    const todayPoints = todayPickups.reduce(
        (sum, p) => sum + (p.pointsEarned || 0),
        0
    );

    return (
        <div className="space-y-6">

            <h2 className="text-2xl font-bold">📋 Pickup History</h2>

            {/* 🔥 DAILY SUMMARY */}
            <div className="grid grid-cols-2 gap-4">

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-xs text-gray-400">Today’s Pickups</p>
                    <p className="text-xl font-bold mt-1">
                        {todayPickups.length}
                    </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-xs text-gray-400">Points Earned</p>
                    <p className="text-xl font-bold text-primary mt-1">
                        +{todayPoints}
                    </p>
                </div>

            </div>

            {/* 🔥 HISTORY LIST */}
            {completed.length === 0 ? (
                <p className="text-gray-400">No completed pickups</p>
            ) : (
                completed.map((p) => (
                    <div
                        key={p.id}
                        className="relative bg-[#111827] border border-white/10 p-5 rounded-2xl overflow-hidden"
                    >
                        {/* LEFT ACCENT */}
                        <div className="absolute left-0 top-0 h-full w-1 bg-primary"></div>

                        <div className="space-y-3 ml-2">

                            {/* DATE */}
                            <p className="text-sm text-gray-400">
                                {p.scheduledDate || "No date"}
                                {p.timeSlot ? ` | ${p.timeSlot}` : ""}
                            </p>

                            {/* POINTS + STATUS */}
                            <div className="flex justify-between items-center">
                                <p className="text-lg font-semibold text-primary">
                                    💰 +{p.pointsEarned || 0} pts
                                </p>

                                <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400">
                                    Completed
                                </span>
                            </div>

                            {/* WASTE BREAKDOWN */}
                            {p.actualWeights && (
                                <div className="flex gap-2 flex-wrap text-xs text-gray-400">
                                    {p.actualWeights.map((w, i) => (
                                        <span
                                            key={i}
                                            className="bg-white/5 px-2 py-1 rounded-md"
                                        >
                                            {w.type}: {w.actual}kg
                                        </span>
                                    ))}
                                </div>
                            )}

                        </div>
                    </div>
                ))
            )}

        </div>
    );
}

export default AgentHistory;
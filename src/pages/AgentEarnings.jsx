import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    collection,
    query,
    where,
    onSnapshot
} from "firebase/firestore";
import { db } from "../firebase/firebase";

function AgentEarnings() {
    const { currentUser } = useAuth();
    const [completed, setCompleted] = useState([]);

    const POINT_TO_RUPEE = 0.5;

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, "pickups"),
            where("assignedAgentId", "==", currentUser.uid),
            where("status", "==", "completed")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCompleted(data);
        });

        return () => unsubscribe();
    }, [currentUser]);

    /* 🔥 CALCULATIONS */

    const totalPoints = completed.reduce(
        (sum, p) => sum + (p.pointsEarned || 0),
        0
    );

    const totalPickups = completed.length;

    const avgPoints = totalPickups
        ? Math.round(totalPoints / totalPickups)
        : 0;

    const totalEarnings = totalPoints * POINT_TO_RUPEE;

    /* 🔥 WEEKLY DATA (FINAL FIX) */

    const weekly = {};

    completed.forEach(p => {
        let date;

        // ✅ Try Firestore timestamps first
        if (p.completedAt && typeof p.completedAt.toDate === "function") {
            date = p.completedAt.toDate();
        } else if (p.createdAt && typeof p.createdAt.toDate === "function") {
            date = p.createdAt.toDate();
        } else if (p.scheduledDate) {
            // 🔥 FORCE parse only YYYY-MM-DD
            const match = p.scheduledDate.match(/\d{4}-\d{2}-\d{2}/);

            if (match) {
                date = new Date(match[0]);
            }
        }

        // 🔥 LAST FALLBACK (THIS GUARANTEES NO EMPTY CHART)
        if (!date || isNaN(date)) {
            date = new Date(); // fallback to today
        }

        const week = Math.ceil(date.getDate() / 7);
        const key = `W${week}`;

        weekly[key] = (weekly[key] || 0) + (p.pointsEarned || 0);
    });

    const weeklyData = Object.entries(weekly);

    const maxPoints = Math.max(
        ...weeklyData.map(([_, p]) => p),
        1
    );

    return (
        <div className="space-y-6">

            <h2 className="text-2xl font-bold">💰 Earnings</h2>

            {/* 🔥 HERO CARD */}
            <div className="bg-gradient-to-r from-primary/20 to-green-500/10 border border-primary/20 p-6 rounded-2xl">

                <p className="text-sm text-gray-400">Total Earnings</p>

                <p className="text-3xl font-bold text-primary mt-2">
                    ₹ {totalEarnings.toFixed(2)}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                    Based on {totalPoints} points earned
                </p>

            </div>

            {/* 🔥 STATS */}
            <div className="grid grid-cols-3 gap-4">

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-xs text-gray-400">📦 Pickups</p>
                    <p className="text-xl font-bold mt-1">{totalPickups}</p>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-xs text-gray-400">⭐ Points</p>
                    <p className="text-xl font-bold text-primary mt-1">
                        {totalPoints}
                    </p>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-xs text-gray-400">⚡ Avg</p>
                    <p className="text-xl font-bold mt-1">{avgPoints}</p>
                </div>

            </div>

            {/* 🔥 WEEKLY CHART */}
            <div className="bg-[#111827] p-5 rounded-2xl border border-white/10">

                <p className="text-sm text-gray-400 mb-4">Weekly Performance</p>

                {weeklyData.length === 0 ? (
                    <p className="text-gray-500 text-sm">No data yet</p>
                ) : (
                    <div className="flex items-end justify-around h-[150px]">

                        {weeklyData.map(([week, points]) => (
                            <div key={week} className="flex flex-col items-center gap-2">

                                <div
                                    className="w-8 bg-primary rounded-lg transition-all duration-300"
                                    style={{
                                        height: `${Math.max((points / maxPoints) * 120, 12)}px`
                                    }}
                                />

                                <span className="text-xs text-gray-400">
                                    {week}
                                </span>

                            </div>
                        ))}

                    </div>
                )}

            </div>

            {/* 🔥 RECENT EARNINGS */}
            <div className="space-y-3">

                {completed.length === 0 ? (
                    <p className="text-gray-400">No earnings yet</p>
                ) : (
                    completed.map(p => (
                        <div
                            key={p.id}
                            className="bg-[#111827] border border-white/10 p-4 rounded-xl flex justify-between items-center"
                        >
                            <div>
                                <p className="text-sm text-gray-400">
                                    {p.scheduledDate || "No date"}
                                    {p.timeSlot ? ` | ${p.timeSlot}` : ""}
                                </p>

                                <p className="text-primary font-semibold">
                                    +{p.pointsEarned || 0} pts
                                </p>
                            </div>

                            <p className="text-green-400 font-bold text-lg">
                                ₹ {(p.pointsEarned * POINT_TO_RUPEE).toFixed(2)}
                            </p>
                        </div>
                    ))
                )}

            </div>

        </div>
    );
}

export default AgentEarnings;
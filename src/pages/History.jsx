import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import PickupTimeline from "../components/PickupTimeline";
import EmptyState from "../components/ui/EmptyState";

function History() {
    const { currentUser } = useAuth();
    const [pickups, setPickups] = useState([]);

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, "pickups"),
            where("userId", "==", currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            // 🔥 Sort latest first
            data.sort((a, b) => {
                const t1 = a.createdAt?.seconds || 0;
                const t2 = b.createdAt?.seconds || 0;
                return t2 - t1;
            });

            setPickups(data);
        });

        return () => unsubscribe();
    }, [currentUser]);

    return (
        <div className="space-y-6">

            <h2 className="text-2xl font-semibold">📜 Pickup History</h2>

            {pickups.length === 0 ? (
                <p className="text-gray-400 text-sm">
                    <EmptyState
                        title="No history yet"
                        subtitle="Complete a pickup to see it here"
                    />
                </p>
            ) : (
                pickups.map(pickup => (
                    <HistoryCard key={pickup.id} pickup={pickup} />
                ))
            )}

        </div>
    );
}

/* 🔹 CARD */
function HistoryCard({ pickup }) {
    return (
        <div className="bg-[#111827] border border-white/10 p-5 rounded-2xl space-y-3">

            {/* DATE */}
            <p className="text-sm text-gray-400">
                {pickup.scheduledDate}
            </p>

            {/* STATUS + POINTS */}
            <div className="flex justify-between items-center">

                <p className="text-green-400 text-sm font-medium">
                    {pickup.status === "completed"
                        ? `+${pickup.pointsEarned || 0} pts`
                        : pickup.status}
                </p>

                <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
                    {pickup.status}
                </span>
            </div>

            {/* ITEMS */}
            <div className="flex flex-wrap gap-2">
                {(pickup.actualWeights || pickup.items || []).map((item, idx) => (
                    <span
                        key={idx}
                        className="text-xs bg-[#1f2937] px-2 py-1 rounded"
                    >
                        {item.type}: {item.actual || item.estimated}kg
                    </span>
                ))}
            </div>

            {/* 🔥 TIMELINE */}
            <PickupTimeline
                status={pickup.status}
                pickup={pickup}
            />

        </div>
    );
}

export default History;
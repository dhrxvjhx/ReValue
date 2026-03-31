import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { subscribeToPickups } from "../firebase/pickupService";

function AgentEarnings() {
    const { currentUser, userData } = useAuth();
    const [pickups, setPickups] = useState([]);

    useEffect(() => {
        if (!currentUser || !userData) return;

        const unsubscribe = subscribeToPickups(
            currentUser.uid,
            userData.role,
            setPickups
        );

        return () => unsubscribe();
    }, [currentUser, userData]);

    const completed = pickups.filter(p => p.status === "completed");

    const totalPoints = completed.reduce(
        (sum, p) => sum + (p.pointsEarned || 0),
        0
    );

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">💰 Earnings</h2>

            {/* TOTAL */}
            <div className="bg-[#111827] border border-white/10 p-4 rounded-xl">
                <p className="text-sm text-gray-400">Total Points Earned</p>
                <p className="text-2xl font-bold mt-1 text-green-400">
                    {totalPoints}
                </p>
            </div>

            {/* HISTORY */}
            <div className="space-y-3">
                {completed.length === 0 ? (
                    <p className="text-gray-400 text-sm">
                        No completed pickups
                    </p>
                ) : (
                    completed.map(p => (
                        <div
                            key={p.id}
                            className="bg-[#111827] border border-white/10 p-3 rounded-xl"
                        >
                            <p className="text-sm text-gray-400">
                                {p.scheduledDate}
                            </p>
                            <p className="text-green-400">
                                +{p.pointsEarned} pts
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default AgentEarnings;
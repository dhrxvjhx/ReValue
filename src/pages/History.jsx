import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getPickups } from "../firebase/pickupService";

function History() {
    const { currentUser, userData } = useAuth();
    const [pickups, setPickups] = useState([]);

    useEffect(() => {
        if (!currentUser || !userData) return;

        getPickups(currentUser.uid, userData.role)
            .then(setPickups)
            .catch(console.error);
    }, [currentUser, userData]);

    if (pickups.length === 0) {
        return (
            <div className="text-center text-gray-400 mt-10">
                No pickup history yet.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Pickup History</h2>

            {pickups
                .slice()
                .reverse()
                .map((pickup) => (
                    <motion.div
                        key={pickup.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#111827] border border-white/10 rounded-2xl p-5 space-y-3"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">
                                {pickup.scheduledDate}
                            </span>

                            <StatusBadge status={pickup.status} />
                        </div>

                        {/* Items */}
                        <div className="space-y-1 text-sm">
                            {pickup.items?.map((item, index) => (
                                <div key={index} className="flex justify-between">
                                    <span className="capitalize">{item.type}</span>
                                    <span>
                                        {item.actual ?? item.estimated} kg
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Points */}
                        {pickup.status === "completed" && (
                            <div className="text-right text-primary font-semibold">
                                +{pickup.pointsEarned ?? 0} pts
                            </div>
                        )}
                    </motion.div>
                ))}
        </div>
    );
}

function StatusBadge({ status }) {
    const color =
        status === "completed"
            ? "bg-green-500/20 text-green-400"
            : status === "assigned"
                ? "bg-blue-500/20 text-blue-400"
                : "bg-yellow-500/20 text-yellow-400";

    return (
        <span className={`text-xs px-3 py-1 rounded-full ${color}`}>
            {status}
        </span>
    );
}

export default History; 
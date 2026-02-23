import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getPickups, completePickup } from "../firebase/pickupService";

function AdminPanel() {
    const { currentUser, userData } = useAuth();
    const [pickups, setPickups] = useState([]);

    useEffect(() => {
        if (!currentUser || !userData) return;

        getPickups(currentUser.uid, userData.role)
            .then(setPickups)
            .catch(console.error);
    }, [currentUser, userData]);

    const scheduled = pickups.filter(
        (pickup) => pickup.status === "pending"
    );

    if (scheduled.length === 0) {
        return (
            <div className="text-center text-gray-400 mt-10">
                No pending pickups.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Admin Panel</h2>

            {scheduled.map((pickup) => (
                <PickupCard
                    key={pickup.id}
                    pickup={pickup}
                    adminId={currentUser.uid}
                />
            ))}
        </div>
    );
}

function PickupCard({ pickup, adminId }) {
    const [weights, setWeights] = useState(
        pickup.items?.map(item => ({
            ...item,
            actual: item.estimated
        })) || []
    );

    const updateActual = (index, value) => {
        const copy = [...weights];
        copy[index].actual = Number(value);
        setWeights(copy);
    };

    const handleComplete = async () => {
        await completePickup(pickup.id, weights, adminId);
        window.location.reload();
    };

    return (
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="text-sm text-gray-400">
                {pickup.scheduledDate}
            </div>

            {weights.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                    <span className="capitalize">{item.type}</span>

                    <input
                        type="number"
                        value={item.actual}
                        onChange={(e) => updateActual(index, e.target.value)}
                        className="w-20 p-1 bg-[#1f2937] rounded text-center"
                    />
                </div>
            ))}

            <button
                onClick={handleComplete}
                className="w-full py-2 bg-primary rounded-xl"
            >
                Mark as Completed
            </button>
        </div>
    );
}

export default AdminPanel;
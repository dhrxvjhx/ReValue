import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getPickups, completePickupFlow } from "../firebase/pickupService";
import { uploadImage } from "../firebase/imageService";

const AgentDashboard = () => {
    const { currentUser, userData } = useAuth();
    const [pickups, setPickups] = useState([]);

    console.log("Agent UID:", currentUser.uid);
    console.log("Pickup:", pickups);

    useEffect(() => {
        if (!currentUser || !userData) return;

        fetchPickups();
    }, [currentUser, userData]);

    const fetchPickups = async () => {
        const data = await getPickups(currentUser.uid, userData.role);
        setPickups(data);
    };

    if (!pickups.length) {
        return (
            <div className="text-center text-gray-400 mt-10">
                No assigned pickups.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">My Pickups</h2>

            {pickups.map((pickup) => (
                <PickupCard key={pickup.id} pickup={pickup} refresh={fetchPickups} />
            ))}
        </div>
    );

};

/* 🔥 PICKUP CARD */
function PickupCard({ pickup, refresh }) {
    const [image, setImage] = useState(null);
    const [weights, setWeights] = useState(
        (pickup.items || []).map((item) => ({
            ...item,
            actual: Number(item.estimated) || 0,
        }))
    );

    const updateWeight = (index, value) => {
        const copy = [...weights];
        copy[index].actual = Number(value);
        setWeights(copy);
    };

    const handleComplete = async () => {
        let imageUrl = null;

        if (image) {
            imageUrl = await uploadImage(image, pickup.id);
        }

        await completePickupFlow(pickup, weights, imageUrl);
        refresh();
    };

    return (
        <div className="bg-[#111827] border border-white/10 p-4 rounded-xl space-y-3">

            <p className="text-sm text-gray-400">
                {pickup.scheduledDate}
            </p>

            <p className="text-sm text-gray-400">
                📍 {pickup.address || "No address"}
            </p>

            <p className="text-sm">
                Status: <span className="text-primary">{pickup.status}</span>
            </p>

            {/* 🔥 ONLY SHOW INPUT IF NOT COMPLETED */}
            {pickup.status !== "completed" && (
                <>
                    {(weights || []).map((item, i) => (
                        <div key={`${pickup.id}-${i}`} className="flex justify-between items-center">
                            <span className="capitalize">{item.type}</span>

                            <input
                                type="number"
                                value={item.actual}
                                onChange={(e) => updateWeight(i, e.target.value)}
                                className="w-20 bg-[#1f2937] rounded p-1 text-center"
                            />
                        </div>
                    ))}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="text-sm"
                    />

                    <button
                        onClick={handleComplete}
                        className="w-full py-2 bg-primary rounded-xl"
                    >
                        Complete Pickup
                    </button>
                </>
            )}

            {/* ✅ SHOW POINTS AFTER COMPLETION */}
            {pickup.status === "completed" && (
                <p className="text-green-400 font-semibold text-right">
                    +{pickup.pointsEarned || 0} pts
                </p>
            )}
        </div>
    );
}


export default AgentDashboard;

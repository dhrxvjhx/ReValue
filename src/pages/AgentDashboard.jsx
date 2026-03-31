import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getPickups, completePickupFlow } from "../firebase/pickupService";
import { uploadImage } from "../firebase/imageService";
import { subscribeToPickups } from "../firebase/pickupService";

function AgentDashboard() {
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

        // getPickups(currentUser.uid, userData.role)
        //     .then(setPickups)
        //     .catch(console.error);
    }, [currentUser, userData]);

    const assigned = pickups.filter(p => p.status === "assigned");
    const completed = pickups.filter(p => p.status === "completed");

    return (
        <div className="space-y-8">
            <Section title="🚚 Assigned Pickups">
                {assigned.length === 0 ? (
                    <Empty text="No assigned pickups" />
                ) : (
                    assigned.map(p => (
                        <PickupCard
                            key={p.id}
                            pickup={p}
                            refresh={setPickups}
                            agentId={currentUser.uid} // ✅ PASS AGENT ID
                        />
                    ))
                )}
            </Section>

            <Section title="✅ Completed Pickups">
                {completed.length === 0 ? (
                    <Empty text="No completed pickups yet" />
                ) : (
                    completed.map(p => (
                        <CompletedCard key={p.id} pickup={p} />
                    ))
                )}
            </Section>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div>
            <h2 className="text-xl font-bold mb-3">{title}</h2>
            <div className="space-y-4">{children}</div>
        </div>
    );
}

function Empty({ text }) {
    return <div className="text-gray-400 text-sm">{text}</div>;
}

function PickupCard({ pickup, refresh, agentId }) {
    const [weights, setWeights] = useState(
        pickup.items.map(i => ({ ...i, actual: Number(i.estimated) }))
    );
    const [image, setImage] = useState(null);

    const updateWeight = (i, val) => {
        const copy = [...weights];
        copy[i].actual = Number(val);
        setWeights(copy);
    };

    const handleComplete = async () => {
        let imageUrl = null;

        if (image) {
            imageUrl = await uploadImage(image);
        }

        await completePickupFlow(pickup, weights, imageUrl, agentId);

        const updated = await getPickups(agentId, "agent");
        refresh(updated);
    };

    return (
        <div className="bg-[#111827] border border-white/10 p-4 rounded-xl space-y-3">
            <p className="text-sm text-gray-400">{pickup.scheduledDate}</p>
            <p className="text-xs text-gray-500">
                📍 {pickup.address || "No address"}
            </p>

            {weights.map((item, i) => (
                <div key={i} className="flex justify-between">
                    <span>{item.type}</span>
                    <input
                        type="number"
                        value={item.actual}
                        onChange={(e) => updateWeight(i, e.target.value)}
                        className="w-20 bg-[#1f2937] text-center rounded"
                    />
                </div>
            ))}

            <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
            />

            <button
                onClick={handleComplete}
                className="w-full py-2 bg-primary rounded-xl"
            >
                Complete Pickup
            </button>
        </div>
    );
}

function CompletedCard({ pickup }) {
    return (
        <div className="bg-[#111827] border border-white/10 p-4 rounded-xl">
            <p className="text-sm text-gray-400">{pickup.scheduledDate}</p>
            <p className="text-green-400 mt-2">+{pickup.pointsEarned} pts</p>

            {/* ✅ SHOW WHO COMPLETED */}
            {pickup.completedBy && (
                <p className="text-xs text-gray-500 mt-1">
                    Completed by: {pickup.completedBy}
                </p>
            )}

            {pickup.proofImageUrl && (
                <img
                    src={pickup.proofImageUrl}
                    className="mt-2 rounded-xl"
                />
            )}
        </div>
    );
}

export default AgentDashboard;
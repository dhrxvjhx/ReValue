import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    increment,
    updateDoc
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import toast from "react-hot-toast";
import EmptyState from "../components/ui/EmptyState";

function AgentDashboard() {
    const { currentUser } = useAuth();
    const [assignedPickups, setAssignedPickups] = useState([]);
    const [loadingId, setLoadingId] = useState(null);

    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, "pickups"),
            where("assignedAgentId", "==", currentUser.uid),
            where("status", "==", "assigned")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAssignedPickups(data);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const handleComplete = async (pickupId, actualWeights, image, userId) => {
        try {
            setLoadingId(pickupId);

            // 🔥 CALCULATE POINTS
            let totalWeight = 0;

            actualWeights.forEach(w => {
                totalWeight += Number(w.actual || 0);
            });

            const pointsEarned = Math.round(totalWeight * 10);

            // 🔥 UPDATE PICKUP
            await updateDoc(doc(db, "pickups", pickupId), {
                status: "completed",
                completedAt: new Date(),
                actualWeights,
                proofImage: image || null,
                pointsEarned
            });

            // 🔥 UPDATE USER POINTS
            if (userId) {
                const userRef = doc(db, "users", userId);

                await updateDoc(userRef, {
                    totalPoints: increment(pointsEarned)
                });
            }

            toast.success(`+${pointsEarned} pts awarded!`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to complete pickup");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">🚚 Assigned Pickups</h2>

            {assignedPickups.length === 0 ? (
                <EmptyState
                    title="No pickups assigned"
                    subtitle="New tasks will appear here"
                />
            ) : (
                assignedPickups.map(p => (
                    <PickupCard
                        key={p.id}
                        pickup={p}
                        onComplete={handleComplete}
                        loading={loadingId === p.id}
                    />
                ))
            )}
        </div>
    );
}

/* 🔹 PICKUP CARD */
function PickupCard({ pickup, onComplete, loading }) {
    const [weights, setWeights] = useState(
        pickup.items?.map(i => ({
            type: i.type,
            estimated: i.estimated,
            actual: i.estimated || "" // ✅ PREFILL
        })) || []
    );

    const [imagePreview, setImagePreview] = useState(null);

    const handleChange = (index, value) => {
        const updated = [...weights];
        updated[index].actual = value;
        setWeights(updated);
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const preview = URL.createObjectURL(file);
        setImagePreview(preview);
    };

    const validate = () => {
        for (let w of weights) {
            if (!w.actual || Number(w.actual) <= 0) {
                return false;
            }
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validate()) {
            toast.error("Enter valid weights for all items");
            return;
        }

        onComplete(pickup.id, weights, imagePreview, pickup.userId);
    };

    const openMaps = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            pickup.address
        )}`;
        window.open(url, "_blank");
    };

    return (
        <div className="bg-[#111827] border border-white/10 p-5 rounded-2xl space-y-4 shadow-md">

            {/* DATE */}
            <p className="text-sm text-gray-400">
                {pickup.scheduledDate}
            </p>

            {/* ADDRESS */}
            <p className="text-sm font-medium">
                {pickup.address}
            </p>

            {/* MAP BUTTON */}
            <button
                onClick={openMaps}
                className="inline-block text-xs px-3 py-1 rounded-full 
                           bg-primary/10 text-primary hover:bg-primary/20 transition"
            >
                📍 Open in Maps
            </button>

            {/* ITEMS */}
            <div className="space-y-3">
                {weights.map((w, i) => (
                    <div key={i} className="space-y-1">

                        <p className="text-xs text-gray-400">
                            {w.type} • est: {w.estimated}kg
                        </p>

                        <input
                            type="number"
                            value={w.actual}
                            onChange={(e) =>
                                handleChange(i, e.target.value)
                            }
                            className="w-full bg-[#1f2937] border border-white/10 
                                       rounded-xl px-3 py-2 text-sm 
                                       focus:outline-none focus:border-primary"
                        />

                        <p className="text-[10px] text-gray-500">
                            Edit if needed
                        </p>
                    </div>
                ))}
            </div>

            {/* IMAGE */}
            <label className="block">
                <span className="text-xs text-gray-400">
                    Upload Proof (Camera / File)
                </span>

                <div className="mt-2 border border-dashed border-white/20 
                                rounded-xl p-4 text-center cursor-pointer 
                                hover:border-primary transition">

                    {imagePreview ? (
                        <img
                            src={imagePreview}
                            alt="preview"
                            className="h-32 mx-auto rounded-lg object-cover"
                        />
                    ) : (
                        <p className="text-sm text-gray-400">
                            📸 Tap to upload image
                        </p>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImage}
                        className="hidden"
                    />
                </div>
            </label>

            {/* BUTTON */}
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 bg-primary rounded-xl text-black font-semibold 
                           disabled:opacity-50 transition"
            >
                {loading ? "Completing..." : "Mark as Completed"}
            </button>

        </div>
    );
}

export default AgentDashboard;
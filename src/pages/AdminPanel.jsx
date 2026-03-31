import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    subscribeToPickups,
    assignAgentToPickup
} from "../firebase/pickupService";
import { getAgents } from "../firebase/firestoreService";
import toast from "react-hot-toast";
import StatsBar from "../components/ui/StatsBar";
import EmptyState from "../components/ui/EmptyState";
import SkeletonCard from "../components/ui/SkeletonCard";
import PickupTimeline from "../components/PickupTimeline";

function AdminPanel() {
    const { currentUser, userData } = useAuth();

    const [pickups, setPickups] = useState([]);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser || !userData) return;

        let unsubscribe;

        const init = async () => {
            try {
                // 🔴 REALTIME
                unsubscribe = subscribeToPickups(
                    currentUser.uid,
                    userData.role.toLowerCase(),
                    (data) => {
                        setPickups(data);
                        setLoading(false); // ✅ FIX
                    }
                );

                const agentData = await getAgents();
                setAgents(agentData);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load data");
                setLoading(false);
            }
        };

        init();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [currentUser, userData]);

    const pending = pickups.filter(p => p.status === "pending");
    const assigned = pickups.filter(p => p.status === "assigned");

    const handleAssign = async (pickupId, agentId) => {
        try {
            await assignAgentToPickup(pickupId, agentId);

            toast.success("Agent assigned!");
        } catch (err) {
            console.error(err);
            toast.error("Assignment failed");
        }
    };

    if (loading) {
        return <div className="text-gray-400">Loading...</div>;
    }

    return (
        <div className="space-y-8">
            <Section title="📦 Pending Pickups">
                {pending.length === 0 ? (
                    <Empty text="No pending pickups" />
                ) : (
                    pending.map(p => (
                        <AssignCard
                            key={p.id}
                            pickup={p}
                            agents={agents}
                            onAssign={handleAssign}
                        />
                    ))
                )}
            </Section>

            <Section title="🚚 Assigned Pickups">
                {assigned.length === 0 ? (
                    <Empty text="No assigned pickups" />
                ) : (
                    assigned.map(p => (
                        <AssignedCard key={p.id} pickup={p} agents={agents} />
                    ))
                )}
            </Section>
        </div>
    );
}

/* 🔹 SECTION */
function Section({ title, children }) {
    return (
        <div>
            <h2 className="text-xl font-bold mb-3">{title}</h2>
            <div className="space-y-4">{children}</div>
        </div>
    );
}

/* 🔹 EMPTY */
function Empty({ text }) {
    return <div className="text-gray-400 text-sm">{text}</div>;
}

/* 🔹 ASSIGN CARD */
function AssignCard({ pickup, agents, onAssign }) {
    const [selectedAgent, setSelectedAgent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAssignClick = async () => {
        if (!selectedAgent) {
            toast.error("Select an agent");
            return;
        }

        setLoading(true);
        await onAssign(pickup.id, selectedAgent);
        setLoading(false);
    };

    return (
        <div className="bg-[#111827] border border-white/10 p-4 rounded-xl space-y-3">
            <p className="text-sm text-gray-400">{pickup.scheduledDate}</p>

            <p className="text-xs text-gray-500">
                📍 {pickup.address || "No address"}
            </p>

            <div className="text-xs text-gray-400">
                {pickup.items?.map((i, idx) => (
                    <div key={idx}>
                        {i.type} - {i.estimated}kg
                    </div>
                ))}
            </div>

            <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full bg-[#1f2937] p-2 rounded"
            >
                <option value="">Select Agent</option>

                {agents.map(agent => (
                    <option key={agent.id} value={agent.id}>
                        {agent.name || agent.email}
                    </option>
                ))}
            </select>

            <button
                onClick={handleAssignClick}
                disabled={loading}
                className="w-full py-2 bg-primary rounded-xl disabled:opacity-50"
            >
                {loading ? "Assigning..." : "Assign to Agent"}
            </button>
        </div>
    );
}

/* 🔹 ASSIGNED CARD */
function AssignedCard({ pickup, agents }) {
    const agent = agents.find(a => a.id === pickup.assignedAgentId);

    return (
        <div className="bg-[#111827] border border-white/10 p-4 rounded-xl space-y-2">
            <p className="text-sm text-gray-400">{pickup.scheduledDate}</p>

            <p className="text-xs text-gray-500">
                📍 {pickup.address || "No address"}
            </p>

            <p className="text-green-400 text-sm">
                Assigned to: {agent?.name || agent?.email || "Unknown"}
            </p>
        </div>
    );
}

export default AdminPanel;
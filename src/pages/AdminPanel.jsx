import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    getPickups,
    assignAgentToPickup
} from "../firebase/pickupService";
import { getAgents } from "../firebase/firestoreService";

function AdminPanel() {
    const { currentUser, userData } = useAuth();
    const [pickups, setPickups] = useState([]);
    const [agents, setAgents] = useState([]);

    useEffect(() => {
        if (!currentUser || !userData) return;

        getPickups(currentUser.uid, userData.role)
            .then(setPickups);

        getAgents().then(setAgents);
    }, [currentUser, userData]);

    const pending = pickups.filter(p => p.status === "pending");

    if (pending.length === 0) {
        return <div className="text-gray-400">No pending pickups</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Assign Pickups</h2>

            {pending.map(pickup => (
                <AssignCard
                    key={pickup.id}
                    pickup={pickup}
                    agents={agents}
                />
            ))}
        </div>
    );
}

function AssignCard({ pickup, agents }) {
    const [selectedAgent, setSelectedAgent] = useState("");

    const handleAssign = async () => {
        if (!selectedAgent) return;
        await assignAgentToPickup(pickup.id, selectedAgent);
        window.location.reload();
    };

    return (
        <div className="bg-[#111827] border border-white/10 p-4 rounded-xl space-y-3">
            <div className="text-sm text-gray-400">
                {pickup.scheduledDate}
            </div>

            <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full bg-[#1f2937] p-2 rounded"
            >
                <option value="">Select Agent</option>
                {agents.map(agent => (
                    <option key={agent.id} value={agent.id}>
                        {agent.email}
                    </option>
                ))}
            </select>

            <button
                onClick={handleAssign}
                className="w-full py-2 bg-primary rounded-xl"
            >
                Assign
            </button>
        </div>
    );
}

export default AdminPanel;
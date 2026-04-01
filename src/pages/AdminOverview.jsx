import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { subscribeToPickups } from "../firebase/pickupService";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";

function AdminOverview() {
    const { currentUser, userData } = useAuth();

    const [pickups, setPickups] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (!currentUser || !userData) return;

        const unsubscribe = subscribeToPickups(
            currentUser.uid,
            userData.role,
            setPickups
        );

        fetchUsers();

        return () => unsubscribe();
    }, [currentUser, userData]);

    const fetchUsers = async () => {
        const snapshot = await getDocs(collection(db, "users"));
        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setUsers(data);
    };

    // 🔥 STATS
    const total = pickups.length;
    const completed = pickups.filter(p => p.status === "completed").length;
    const pending = pickups.filter(p => p.status === "pending").length;
    const assigned = pickups.filter(p => p.status === "assigned").length;

    const totalUsers = users.filter(u => u.role === "user").length;
    const totalAgents = users.filter(u => u.role === "agent").length;

    // 🔥 CHART DATA
    const typeMap = {};

    pickups.forEach(p => {
        p.items?.forEach(item => {
            if (!typeMap[item.type]) typeMap[item.type] = 0;
            typeMap[item.type] += Number(item.estimated || 0);
        });
    });

    const chartData = Object.keys(typeMap).map(key => ({
        type: key,
        weight: typeMap[key]
    }));

    // 🔥 TOP USERS
    const topUsers = users
        .filter(u => u.role === "user")
        .sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
        .slice(0, 3);

    // 🔥 TOP AGENTS
    const agentMap = {};

    pickups.forEach(p => {
        if (!p.assignedAgentId) return;

        if (!agentMap[p.assignedAgentId]) {
            agentMap[p.assignedAgentId] = 0;
        }

        if (p.status === "completed") {
            agentMap[p.assignedAgentId]++;
        }
    });

    const topAgents = users
        .filter(u => u.role === "agent")
        .map(agent => ({
            ...agent,
            completed: agentMap[agent.id] || 0
        }))
        .sort((a, b) => b.completed - a.completed)
        .slice(0, 3);

    return (
        <div className="space-y-8">

            <h2 className="text-2xl font-semibold">📊 Admin Dashboard</h2>

            {/* 🔥 STATS */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Stat title="📦 Total" value={total} />
                <Stat title="✅ Completed" value={completed} />
                <Stat title="⏳ Pending" value={pending} />
                <Stat title="🚚 Assigned" value={assigned} />
                <Stat title="👥 Users" value={totalUsers} />
                <Stat title="🧑‍🔧 Agents" value={totalAgents} />
            </div>

            {/* 🔥 CHART */}
            <Card title="Waste Distribution">
                <div className="w-full h-[260px]">
                    <ResponsiveContainer>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                            <XAxis dataKey="type" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#020617",
                                    border: "1px solid #1f2937",
                                    borderRadius: "10px"
                                }}
                            />
                            <Bar dataKey="weight" fill="#22C55E" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* 🔥 LOWER GRID */}
            <div className="grid md:grid-cols-2 gap-4">

                <Card title="🏆 Top Users">
                    {topUsers.map(u => (
                        <Row
                            key={u.id}
                            label={u.name || u.email}
                            value={`${u.totalPoints || 0} pts`}
                        />
                    ))}
                </Card>

                <Card title="🚚 Top Agents">
                    {topAgents.map(a => (
                        <Row
                            key={a.id}
                            label={a.name || a.email}
                            value={`${a.completed} completed`}
                        />
                    ))}
                </Card>

            </div>

        </div>
    );
}

/* 🔹 STAT */
function Stat({ title, value }) {
    return (
        <div className="bg-[#111827] border border-white/10 p-4 rounded-2xl shadow-md">
            <p className="text-xs text-gray-400">{title}</p>
            <p className="text-2xl font-semibold mt-2">{value}</p>
        </div>
    );
}

/* 🔹 CARD */
function Card({ title, children }) {
    return (
        <div className="bg-[#111827] border border-white/10 p-5 rounded-2xl shadow-md space-y-4">
            <h3 className="text-sm text-gray-400">{title}</h3>
            {children}
        </div>
    );
}

/* 🔹 ROW */
function Row({ label, value }) {
    return (
        <div className="flex justify-between text-sm py-1">
            <span className="font-medium">{label}</span>
            <span className="text-gray-400">{value}</span>
        </div>
    );
}

export default AdminOverview;
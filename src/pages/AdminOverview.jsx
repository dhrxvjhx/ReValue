import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { subscribeToPickups } from "../firebase/pickupService";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

function AdminOverview() {
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

    // 🔥 STATS
    const total = pickups.length;
    const completed = pickups.filter(p => p.status === "completed").length;

    // 🔥 TYPE-WISE DATA
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

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">📊 Analytics</h2>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-3">
                <Stat title="Total Pickups" value={total} />
                <Stat title="Completed" value={completed} />
            </div>

            {/* CHART */}
            <div className="bg-[#111827] border border-white/10 p-4 rounded-xl">
                <h3 className="text-sm text-gray-400 mb-3">
                    Waste Distribution
                </h3>

                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="type" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="weight" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

function Stat({ title, value }) {
    return (
        <div className="bg-[#111827] border border-white/10 p-4 rounded-xl">
            <p className="text-xs text-gray-400">{title}</p>
            <p className="text-xl font-bold mt-1">{value}</p>
        </div>
    );
}

export default AdminOverview;
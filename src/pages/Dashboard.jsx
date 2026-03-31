import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Trophy, History, Lightbulb, Bell } from "lucide-react";
import CountUp from "react-countup";
import { useApp } from "../context/AppContext";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

function Dashboard() {
    const { availablePoints, treesPlanted } = useApp();
    const navigate = useNavigate();
    const hour = new Date().getHours();

    const { currentUser, userData } = useAuth();
    const [pickups, setPickups] = useState([]);

    // 🔥 REALTIME LISTENER
    useEffect(() => {
        if (!currentUser) return;

        const q = query(
            collection(db, "pickups"),
            where("userId", "==", currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setPickups(data);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const greeting =
        hour < 12
            ? "Good Morning"
            : hour < 18
                ? "Good Afternoon"
                : "Good Evening";

    return (
        <div className="relative space-y-8 overflow-hidden">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">ReValue 🌱</h1>
                <Bell className="text-gray-400" />
            </div>

            {/* HERO */}
            <motion.div
                key={availablePoints}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10 p-6 rounded-3xl shadow-2xl"
            >
                <h2 className="text-2xl font-semibold">
                    {greeting}, {userData?.name || "User"} 👋
                </h2>

                <p className="mt-2 text-gray-400">Available Points</p>

                <h3 className="text-4xl font-bold mt-1 text-primary">
                    <CountUp end={availablePoints} duration={1.5} />
                </h3>
            </motion.div>

            {/* PICKUP STATUS */}
            <div className="bg-[#111827] border border-white/10 p-5 rounded-2xl">
                <h3 className="text-lg font-semibold mb-2">Pickup Status</h3>

                {pickups.length === 0 ? (
                    <p className="text-gray-400 text-sm">
                        No pickup scheduled yet.
                    </p>
                ) : (
                    <div className="text-sm space-y-1">
                        <p>
                            Status:{" "}
                            <span className="text-primary font-medium">
                                {pickups[pickups.length - 1]?.status}
                            </span>
                        </p>
                        <p className="text-gray-400">
                            Date: {pickups[pickups.length - 1]?.scheduledDate}
                        </p>
                    </div>
                )}
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid grid-cols-3 gap-3">
                <QuickAction icon={Trophy} label="Leaderboard" path="/leaderboard" />
                <QuickAction icon={History} label="History" path="/history" />
                <QuickAction icon={Lightbulb} label="Tips" path="/tips" />
            </div>

            {/* ECO CARD */}
            <motion.div className="bg-gradient-to-r from-emerald-700 to-green-500 p-6 rounded-3xl flex justify-between">
                <div>
                    <h3 className="text-xl font-bold">Trees Planted 🌳</h3>
                </div>
                <div className="text-4xl font-bold">
                    <CountUp end={treesPlanted} duration={1.5} />
                </div>
            </motion.div>
        </div>
    );
}

function QuickAction({ icon: Icon, label, path }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(path)}
            className="bg-[#111827] border border-white/10 rounded-xl py-3 flex flex-col items-center gap-2 cursor-pointer"
        >
            <Icon size={20} className="text-primary" />
            <span className="text-sm">{label}</span>
        </div>
    );
}

export default Dashboard;
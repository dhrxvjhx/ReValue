import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Trophy, History, Lightbulb, Truck, Star } from "lucide-react";
import CountUp from "react-countup";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import PickupTimeline from "../components/PickupTimeline";

function Dashboard() {
    const navigate = useNavigate();
    const hour = new Date().getHours();

    const { currentUser, userData } = useAuth();

    const [pickups, setPickups] = useState([]);
    const [pointsData, setPointsData] = useState({
        totalPoints: 0,
        redeemedPoints: 0
    });

    /* 🔥 USER POINTS */
    useEffect(() => {
        if (!currentUser) return;

        const userRef = doc(db, "users", currentUser.uid);

        return onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();

                setPointsData({
                    totalPoints: data.totalPoints || 0,
                    redeemedPoints: data.redeemedPoints || 0
                });
            }
        });
    }, [currentUser]);

    /* 🔥 PICKUPS */
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

    /* 🔥 CALCULATIONS */
    const availablePoints =
        pointsData.totalPoints - pointsData.redeemedPoints;

    const treesPlanted = Math.floor(pointsData.totalPoints / 100);

    const greeting =
        hour < 12
            ? "Good Morning"
            : hour < 18
                ? "Good Afternoon"
                : "Good Evening";

    /* 🔥 FIXED ACTIVE PICKUP */
    const activePickup = pickups
        .filter(p => p.status !== "completed")
        .sort((a, b) => {
            const dateA = new Date(a.scheduledDate?.split("|")[0] || 0);
            const dateB = new Date(b.scheduledDate?.split("|")[0] || 0);
            return dateA - dateB;
        })[0];

    const totalPickups = pickups.length;

    return (
        <div className="space-y-8">

            {/* HEADER */}
            <h1 className="text-3xl font-bold">ReValue 🌱</h1>

            {/* HERO */}
            <motion.div
                key={availablePoints}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/10 p-6 rounded-3xl"
            >
                <h2 className="text-2xl font-semibold">
                    {greeting}, {userData?.name || "User"} 👋
                </h2>

                <p className="mt-2 text-gray-400">Available Points</p>

                <h3 className="text-4xl font-bold mt-1 text-primary">
                    <CountUp end={availablePoints} duration={1.5} />
                </h3>
            </motion.div>


            {/* 🔥 PICKUP CARD */}
            <div className="bg-[#111827] border border-white/10 p-5 rounded-2xl">

                <h3 className="text-lg font-semibold mb-2">🚚 Next Pickup</h3>

                {!activePickup ? (
                    <p className="text-gray-400 text-sm">
                        No upcoming pickups
                    </p>
                ) : (
                    <div className="space-y-3">

                        <p className="text-gray-400 text-sm">
                            {activePickup.scheduledDate}
                        </p>

                        <PickupTimeline
                            status={activePickup.status}
                            pickup={activePickup}
                        />

                    </div>
                )}

            </div>

            {/* QUICK ACTIONS */}
            <div className="grid grid-cols-3 gap-3">
                <QuickAction icon={Trophy} label="Leaderboard" path="/leaderboard" />
                <QuickAction icon={History} label="History" path="/history" />
                <QuickAction icon={Lightbulb} label="Tips" path="/tips" />
            </div>

            {/* 🔥 IMPACT CARD */}
            <motion.div className="bg-gradient-to-r from-emerald-700 to-green-500 p-6 rounded-3xl flex justify-between">

                <div>
                    <h3 className="text-xl font-bold">Impact 🌍</h3>
                    <p className="text-sm opacity-80 mt-1">
                        You’ve helped recycle waste sustainably
                    </p>
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
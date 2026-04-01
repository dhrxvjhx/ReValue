import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { LEVELS, BADGES } from "../config/gamification";
import { useNavigate } from "react-router-dom";

function Profile() {
    const { currentUser, userData, logout } = useAuth();
    const [pickups, setPickups] = useState([]);
    const [showBadges, setShowBadges] = useState(false);
    const navigate = useNavigate();

    const role = userData?.role || "user";

    useEffect(() => {
        if (!currentUser) return;

        let q;

        if (role === "admin") {
            q = collection(db, "pickups");
        } else if (role === "agent") {
            q = query(
                collection(db, "pickups"),
                where("assignedAgentId", "==", currentUser.uid)
            );
        } else {
            q = query(
                collection(db, "pickups"),
                where("userId", "==", currentUser.uid)
            );
        }

        return onSnapshot(q, (snap) => {
            setPickups(snap.docs.map(d => d.data()));
        });
    }, [currentUser, role]);

    const totalPoints = userData?.totalPoints || 0;
    const pickupCount = pickups.length;
    const completed = pickups.filter(p => p.status === "completed").length;
    const trees = Math.floor(totalPoints / 100);

    const level =
        LEVELS.find(l => totalPoints >= l.min && totalPoints < l.max) ||
        LEVELS[LEVELS.length - 1];

    const progress =
        ((totalPoints - level.min) / (level.max - level.min)) * 100;

    const badgeState = BADGES.map(b => ({
        ...b,
        unlocked: b.condition({
            pickups: pickupCount,
            points: totalPoints,
            trees,
        }),
    }));

    return (
        <div className="space-y-6">

            {/* HERO */}
            <div className="bg-gradient-to-br from-[#1e293b] to-[#020617] p-6 rounded-3xl relative">

                <button
                    onClick={() => navigate("/settings")}
                    className="absolute top-4 right-4 text-xs bg-white/10 px-3 py-1 rounded-xl"
                >
                    ⚙️ Settings
                </button>

                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-xl">
                        {role === "user" && "♻️"}
                        {role === "agent" && "🚚"}
                        {role === "admin" && "🧠"}
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold">{userData?.name}</h2>

                        {role === "user" && (
                            <p className="text-sm text-primary">
                                Level {level.level} • {level.title}
                            </p>
                        )}

                        {role !== "user" && (
                            <p className="text-sm text-primary capitalize">{role}</p>
                        )}
                    </div>
                </div>

                {/* USER PROGRESS */}
                {role === "user" && (
                    <div className="mt-5">
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>{totalPoints} pts</span>
                            <span>{level.max}</span>
                        </div>

                        <div className="h-2 bg-[#111827] rounded-full mt-1">
                            <div
                                className="h-2 bg-primary rounded-full"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-3">

                {role === "user" && (
                    <>
                        <Stat label="Points" value={totalPoints} />
                        <Stat label="Pickups" value={pickupCount} />
                        <Stat label="Trees" value={trees} />
                    </>
                )}

                {role === "agent" && (
                    <>
                        <Stat label="Assigned" value={pickupCount} />
                        <Stat label="Completed" value={completed} />
                        <Stat label="Earnings" value={`₹${userData?.earnings || 0}`} />
                    </>
                )}

                {role === "admin" && (
                    <>
                        <Stat label="Total" value={pickupCount} />
                        <Stat label="Completed" value={completed} />
                        <Stat label="Pending" value={pickupCount - completed} />
                    </>
                )}
            </div>

            {/* BADGES */}
            {role === "user" && (
                <div
                    className="bg-[#020617] p-4 rounded-2xl cursor-pointer"
                    onClick={() => setShowBadges(true)}
                >
                    <p className="text-xs text-gray-400 mb-2">Badges</p>

                    <div className="flex gap-3">
                        {badgeState.slice(0, 4).map(b => (
                            <div
                                key={b.id}
                                className={`p-3 rounded-xl text-center ${b.unlocked ? "bg-[#111827]" : "bg-gray-800 opacity-40"
                                    }`}
                            >
                                <div>{b.icon}</div>
                                <p className="text-xs">{b.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 🔥 FIXED MODAL */}
            {showBadges && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">

                    <div className="bg-[#020617] w-full max-w-sm rounded-2xl flex flex-col max-h-[80vh]">

                        {/* HEADER (STICKY) */}
                        <div className="p-4 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#020617] z-10">
                            <h3 className="font-semibold">🏆 All Badges</h3>
                            <button
                                onClick={() => setShowBadges(false)}
                                className="text-sm text-gray-400"
                            >
                                ✕
                            </button>
                        </div>

                        {/* SCROLLABLE CONTENT */}
                        <div className="p-4 overflow-y-auto">

                            <div className="grid grid-cols-2 gap-3">
                                {badgeState.map(b => (
                                    <div
                                        key={b.id}
                                        className={`p-4 rounded-xl text-center ${b.unlocked
                                                ? "bg-[#111827]"
                                                : "bg-gray-800 opacity-40 grayscale"
                                            }`}
                                    >
                                        <div className="text-lg">{b.icon}</div>
                                        <p className="text-xs mt-1">{b.label}</p>
                                    </div>
                                ))}
                            </div>

                        </div>

                    </div>
                </div>
            )}

            {/* LOGOUT */}
            <button
                onClick={logout}
                className="w-full py-3 bg-red-500/20 text-red-400 rounded-xl"
            >
                Logout
            </button>
        </div>
    );
}

function Stat({ label, value }) {
    return (
        <div className="bg-[#111827] p-4 rounded-xl text-center">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-lg font-semibold">{value}</p>
        </div>
    );
}

export default Profile;
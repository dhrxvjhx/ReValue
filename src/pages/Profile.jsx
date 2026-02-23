import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Profile() {
    const {
        totalPoints,
        redeemedPoints,
        availablePoints,
        treesPlanted,
        userLevel,
        pickupRequests,
        userData,
    } = useApp();

    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const completedPickups = pickupRequests.filter(
        (req) => req.status === "completed"
    ).length;

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const displayName =
        userData?.name ||
        currentUser?.displayName ||
        currentUser?.email?.split("@")[0] ||
        "User";

    const avatarLetter = displayName.charAt(0).toUpperCase();

    return (
        <div className="space-y-6">

            {/* USER CARD */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-glass backdrop-blur-lg border border-white/10 rounded-3xl p-6 text-center"
            >
                <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                    {avatarLetter}
                </div>

                <h2 className="mt-4 text-xl font-semibold">
                    {displayName}
                </h2>

                <p className="text-primary text-sm mt-1">
                    {userLevel?.title}
                </p>

                <span className="text-xs text-gray-400">
                    Level {userLevel?.level}
                </span>
            </motion.div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4">
                <StatCard label="Total Earned" value={totalPoints} />
                <StatCard label="Redeemed" value={redeemedPoints} />
                <StatCard label="Available Balance" value={availablePoints} />
                <StatCard label="Trees Planted" value={treesPlanted} />
            </div>

            {/* ACTIONS */}
            <div className="space-y-3">
                <ActionRow
                    icon={Settings}
                    label="Settings"
                    onClick={() => navigate("/settings")}
                />
                <ActionRow
                    icon={LogOut}
                    label="Logout"
                    onClick={handleLogout}
                    danger
                />
            </div>

        </div>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="bg-glass backdrop-blur-lg border border-white/10 rounded-2xl p-4">
            <p className="text-gray-400 text-sm">{label}</p>
            <p className="text-xl font-bold mt-1 text-primary">{value}</p>
        </div>
    );
}

function ActionRow({ icon: Icon, label, onClick, danger }) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-3 bg-glass backdrop-blur-lg border border-white/10 rounded-xl p-4 cursor-pointer transition 
        hover:bg-white/5 ${danger ? "hover:border-red-500/40" : ""}`}
        >
            <Icon
                size={18}
                className={danger ? "text-red-400" : "text-primary"}
            />
            <span className={danger ? "text-red-400" : ""}>
                {label}
            </span>
        </div>
    );
}

export default Profile;
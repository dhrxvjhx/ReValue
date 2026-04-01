import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getLeaderboard } from "../firebase/firestoreService";
import { useAuth } from "../context/AuthContext";

function Leaderboard() {
    const [users, setUsers] = useState([]);
    const { currentUser } = useAuth();

    useEffect(() => {
        getLeaderboard().then(setUsers);
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Leaderboard</h2>

            {users.map((user, index) => (
                <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex justify-between items-center p-4 rounded-2xl border 
                        ${user.id === currentUser?.uid
                            ? "bg-primary/10 border-primary"
                            : "bg-[#111827] border-white/10"
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <span className="text-lg font-bold w-6">
                            {index === 0 ? "🥇" :
                                index === 1 ? "🥈" :
                                    index === 2 ? "🥉" :
                                        `#${index + 1}`}
                        </span>

                        <div>
                            <p className="font-medium">
                                {user.name || "Anonymous"}
                            </p>
                        </div>
                    </div>

                    <span className="font-semibold text-primary">
                        {user.totalPoints || 0} pts
                    </span>
                </motion.div>
            ))}
        </div>
    );
}

export default Leaderboard;
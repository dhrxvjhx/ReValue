import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { subscribeToRewards } from "../firebase/rewardService";

function RewardHistory() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = subscribeToRewards(
            currentUser.uid,
            setHistory
        );

        return () => unsubscribe();
    }, [currentUser]);

    return (
        <div className="space-y-6">

            <div className="flex items-center gap-3">
                <ArrowLeft
                    className="cursor-pointer text-gray-400"
                    onClick={() => navigate(-1)}
                />
                <h2 className="text-xl font-semibold">
                    Redemption History
                </h2>
            </div>

            {history.length === 0 ? (
                <p className="text-gray-400 text-sm">
                    No rewards redeemed yet.
                </p>
            ) : (
                history.map(item => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#111827] border border-white/10 p-4 rounded-xl flex justify-between items-center"
                    >
                        <div>
                            <p className="font-medium">{item.name}</p>
                        </div>

                        <span className="text-primary font-semibold">
                            -{item.cost} pts
                        </span>
                    </motion.div>
                ))
            )}
        </div>
    );
}

export default RewardHistory;
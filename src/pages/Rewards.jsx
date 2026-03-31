import { motion } from "framer-motion";
import { History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { redeemRewardFirestore } from "../firebase/rewardService";

function Rewards() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [pointsData, setPointsData] = useState({
        totalPoints: 0,
        redeemedPoints: 0
    });

    // 🔥 USER POINTS
    useEffect(() => {
        if (!currentUser) return;

        const userRef = doc(db, "users", currentUser.uid);

        return onSnapshot(userRef, (snap) => {
            if (snap.exists()) {
                const data = snap.data();

                setPointsData({
                    totalPoints: data.totalPoints || 0,
                    redeemedPoints: data.redeemedPoints || 0
                });
            }
        });
    }, [currentUser]);

    const availablePoints =
        pointsData.totalPoints - pointsData.redeemedPoints;

    const rewards = [
        { id: 1, name: "₹50 Amazon Voucher", cost: 200 },
        { id: 2, name: "Plant a Tree 🌳", cost: 300 },
        { id: 3, name: "Eco T-Shirt", cost: 500 },
    ];

    const handleRedeem = async (reward) => {
        if (!currentUser) return;

        await redeemRewardFirestore(currentUser.uid, reward);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Rewards</h2>

                <History
                    className="cursor-pointer text-gray-400 hover:text-primary transition"
                    onClick={() => navigate("/reward-history")}
                />
            </div>

            <p className="text-sm text-gray-400">
                Available Points:{" "}
                <span className="text-primary font-semibold">
                    {availablePoints}
                </span>
            </p>

            {rewards.map((reward) => (
                <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#111827] border border-white/10 rounded-2xl p-5 flex justify-between items-center"
                >
                    <div>
                        <p className="font-medium">
                            {reward.name}
                        </p>
                        <p className="text-sm text-gray-400">
                            {reward.cost} pts
                        </p>
                    </div>

                    <button
                        onClick={() => handleRedeem(reward)}
                        disabled={availablePoints < reward.cost}
                        className={`
              px-4 py-2 rounded-xl text-sm font-medium
              ${availablePoints >= reward.cost
                                ? "bg-primary"
                                : "bg-gray-600 cursor-not-allowed"
                            }
            `}
                    >
                        Redeem
                    </button>
                </motion.div>
            ))}
        </div>
    );
}

export default Rewards;
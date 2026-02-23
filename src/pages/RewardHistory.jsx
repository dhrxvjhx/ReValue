import { useApp } from "../context/AppContext"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

function RewardHistory() {
    const { redemptionHistory } = useApp()
    const navigate = useNavigate()

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex items-center gap-3">
                <ArrowLeft
                    className="cursor-pointer text-gray-400"
                    onClick={() => navigate(-1)}
                />
                <h2 className="text-xl font-semibold">
                    Redemption History
                </h2>
            </div>

            {redemptionHistory.length === 0 ? (
                <p className="text-gray-400 text-sm">
                    No rewards redeemed yet.
                </p>
            ) : (
                redemptionHistory
                    .slice()
                    .reverse()
                    .map(item => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#111827] border border-white/10 p-4 rounded-xl flex justify-between items-center"
                        >
                            <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-xs text-gray-400">
                                    {item.date}
                                </p>
                            </div>

                            <span className="text-primary font-semibold">
                                -{item.cost} pts
                            </span>
                        </motion.div>
                    ))
            )}

        </div>
    )
}

export default RewardHistory
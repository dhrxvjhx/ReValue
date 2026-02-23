import { motion } from "framer-motion"
import { useApp } from "../context/AppContext"

function Leaderboard() {
    const { totalPoints, userLevel } = useApp()

    // Simulated users
    const users = [
        { name: "Aarav", points: 850 },
        { name: "Meera", points: 420 },
        { name: "Rohan", points: 300 },
        { name: "Sanya", points: 150 },
    ]

    // Add current user dynamically
    const currentUser = {
        name: "Dhruv",
        points: totalPoints,
        level: userLevel.title,
    }

    const leaderboard = [...users, currentUser]
        .sort((a, b) => b.points - a.points)

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Leaderboard</h2>

            {leaderboard.map((user, index) => {
                const isCurrentUser = user.name === "Dhruv"

                return (
                    <motion.div
                        key={user.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`
              flex justify-between items-center
              p-4 rounded-2xl
              border
              ${isCurrentUser
                                ? "bg-primary/10 border-primary"
                                : "bg-[#111827] border-white/10"
                            }
            `}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-bold w-6">
                                #{index + 1}
                            </span>

                            <div>
                                <p className="font-medium">
                                    {user.name}
                                </p>

                                {isCurrentUser && (
                                    <p className="text-xs text-primary">
                                        {userLevel.title}
                                    </p>
                                )}
                            </div>
                        </div>

                        <span className="font-semibold text-primary">
                            {user.points} pts
                        </span>
                    </motion.div>
                )
            })}
        </div>
    )
}

export default Leaderboard
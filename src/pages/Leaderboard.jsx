import { Trophy } from "lucide-react"

const users = [
    { name: "Dhruv", points: 1500 },
    { name: "Trisha", points: 1300 },
    { name: "Rahul", points: 1100 },
]

function Leaderboard() {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-8">
                Leaderboard 🏆
            </h2>

            <div className="space-y-4">
                {users.map((user, index) => (
                    <div
                        key={index}
                        className="glass-card p-5 flex justify-between items-center"
                    >
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/20 p-3 rounded-xl">
                                <Trophy className="text-primary" size={18} />
                            </div>
                            <div>
                                <p className="font-semibold">
                                    {index + 1}. {user.name}
                                </p>
                            </div>
                        </div>

                        <p className="text-primary font-bold">
                            {user.points} pts
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Leaderboard
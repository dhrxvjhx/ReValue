import { Gift } from "lucide-react"

const rewards = [
    { title: "Amazon Voucher", points: 500 },
    { title: "Plant a Tree Donation", points: 300 },
    { title: "Eco Bottle", points: 700 },
]

function Rewards() {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-8">
                Redeem Rewards 🎁
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {rewards.map((reward, index) => (
                    <div
                        key={index}
                        className="glass-card p-6 flex flex-col justify-between"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <Gift className="text-primary" size={24} />
                            <h3 className="text-lg font-semibold">
                                {reward.title}
                            </h3>
                        </div>

                        <p className="text-gray-400 mb-6">
                            {reward.points} Points Required
                        </p>

                        <button className="bg-primary hover:bg-green-600 transition py-2 rounded-xl font-semibold">
                            Redeem
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Rewards
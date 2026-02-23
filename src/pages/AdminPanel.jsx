import { useApp } from "../context/AppContext"
import { useState } from "react"
import { motion } from "framer-motion"

function AdminPanel() {
    const { pickupRequests, completePickup } = useApp()

    const scheduled = pickupRequests.filter(
        (req) => req.status === "scheduled"
    )

    if (scheduled.length === 0) {
        return (
            <div className="text-center text-gray-400 mt-10">
                No scheduled pickups.
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Admin Panel</h2>

            {scheduled.map((request) => (
                <PickupCard
                    key={request.id}
                    request={request}
                    onComplete={completePickup}
                />
            ))}
        </div>
    )
}

function PickupCard({ request, onComplete }) {
    const [updatedItems, setUpdatedItems] = useState(
        request.items.map((item) => ({
            ...item,
            actual: item.estimated,
        }))
    )

    const updateActual = (index, value) => {
        const copy = [...updatedItems]
        copy[index].actual = Number(value)
        setUpdatedItems(copy)
    }

    const handleComplete = () => {
        onComplete(request.id, updatedItems)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="
        bg-[#111827]
        border border-white/10
        rounded-2xl
        p-5
        space-y-4
      "
        >
            <div className="text-sm text-gray-400">
                {request.pickupDate}
            </div>

            {updatedItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                    <span className="capitalize">{item.type}</span>

                    <input
                        type="number"
                        value={item.actual}
                        onChange={(e) => updateActual(index, e.target.value)}
                        className="w-20 p-1 bg-[#1f2937] rounded text-center"
                    />
                </div>
            ))}

            <button
                onClick={handleComplete}
                className="w-full py-2 bg-primary rounded-xl"
            >
                Mark as Completed
            </button>
        </motion.div>
    )
}

export default AdminPanel
import { motion } from "framer-motion"
import { useApp } from "../context/AppContext"
import { Settings, LogOut } from "lucide-react"

function Profile() {
    const { totalPoints, treesPlanted, pickupRequests } = useApp()

    const completedPickups = pickupRequests.filter(
        (req) => req.status === "completed"
    ).length

    return (
        <div className="space-y-8">

            {/* USER CARD */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="
          bg-[#111827]
          border border-white/10
          rounded-3xl
          p-6
          text-center
        "
            >
                <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold">
                    D
                </div>

                <h2 className="mt-4 text-xl font-semibold">
                    Dhruv Jha
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                    Eco Warrior 🌱
                </p>
            </motion.div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4">

                <StatCard label="Total Points" value={totalPoints} />
                <StatCard label="Trees Planted" value={treesPlanted} />
                <StatCard label="Completed Pickups" value={completedPickups} />
                <StatCard label="Scheduled Pickups" value={pickupRequests.length - completedPickups} />

            </div>

            {/* SETTINGS SECTION */}
            <div className="space-y-4">

                <ActionRow icon={Settings} label="Settings" />
                <ActionRow icon={LogOut} label="Logout" />

            </div>

        </div>
    )
}

function StatCard({ label, value }) {
    return (
        <div className="
      bg-[#111827]
      border border-white/10
      rounded-2xl
      p-4
    ">
            <p className="text-gray-400 text-sm">
                {label}
            </p>
            <p className="text-xl font-bold mt-1 text-primary">
                {value}
            </p>
        </div>
    )
}

function ActionRow({ icon: Icon, label }) {
    return (
        <div className="
      flex items-center gap-3
      bg-[#111827]
      border border-white/10
      rounded-xl
      p-4
      cursor-pointer
      hover:bg-white/5
      transition
    ">
            <Icon size={18} className="text-primary" />
            <span>{label}</span>
        </div>
    )
}

export default Profile
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Trophy, History, Lightbulb, Bell } from "lucide-react"
import CountUp from "react-countup"
import { useApp } from "../context/AppContext"

function Dashboard() {
    const { totalPoints, treesPlanted, pickupRequests } = useApp()
    const navigate = useNavigate()
    const hour = new Date().getHours()

    const greeting =
        hour < 12
            ? "Good Morning"
            : hour < 18
                ? "Good Afternoon"
                : "Good Evening"

    return (
        <div className="relative space-y-8 overflow-hidden">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">
                    ReValue 🌱
                </h1>
                <Bell className="text-gray-400" />
            </div>

            {/* HERO CARD */}
            <motion.div
                key={totalPoints}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="
          relative
          bg-gradient-to-br from-[#1E293B] to-[#0F172A]
          border border-white/10
          p-6
          rounded-3xl
          overflow-hidden
          shadow-2xl
        "
            >
                <h2 className="text-2xl font-semibold">
                    {greeting}, Dhruv 👋
                </h2>

                <p className="mt-2 text-gray-400">
                    Total Points
                </p>

                <h3 className="text-4xl font-bold mt-1 text-primary">
                    <CountUp end={totalPoints} duration={1.5} />
                </h3>

                <motion.svg
                    viewBox="0 0 1440 320"
                    className="absolute bottom-0 left-0 w-full h-20"
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                >
                    <path
                        fill="rgba(255,255,255,0.1)"
                        d="M0,224L60,208C120,192,240,160,360,154.7C480,149,600,171,720,186.7C840,203,960,213,1080,192C1200,171,1320,117,1380,90.7L1440,64L1440,320L0,320Z"
                    />
                </motion.svg>
            </motion.div>

            {/* Pickup Status */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="
    bg-[#111827] border border-white/10
    p-5 rounded-2xl
  "
            >
                <h3 className="text-lg font-semibold mb-2">
                    Pickup Status
                </h3>

                {pickupRequests.length === 0 ? (
                    <p className="text-gray-400 text-sm">
                        No pickup scheduled yet.
                    </p>
                ) : (
                    <div className="text-sm space-y-1">
                        <p>
                            Status:{" "}
                            <span className="text-primary font-medium">
                                {pickupRequests[pickupRequests.length - 1].status}
                            </span>
                        </p>
                        <p className="text-gray-400">
                            Date: {pickupRequests[pickupRequests.length - 1].pickupDate}
                        </p>
                    </div>
                )}
            </motion.div>

            {/* QUICK ACTIONS */}
            <div className="grid grid-cols-3 gap-3">
                <QuickAction icon={Trophy} label="Leaderboard" path="/leaderboard" />
                <QuickAction icon={History} label="History" path="/history" />
                <QuickAction icon={Lightbulb} label="Tips" path="/tips" />
            </div>

            {/* ECO CARD */}
            <motion.div
                key={treesPlanted}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                whileTap={{ scale: 0.98 }}
                className="
          bg-gradient-to-r from-emerald-700 to-green-500
          p-6
          rounded-3xl
          shadow-xl
          flex justify-between items-center
        "
            >
                <div>
                    <h3 className="text-xl font-bold">
                        Trees Planted 🌳
                    </h3>
                    <p className="text-green-100 text-sm mt-1">
                        Thanks for making the world greener!
                    </p>
                </div>

                <div className="text-4xl font-bold">
                    <CountUp end={treesPlanted} duration={1.5} />
                </div>
            </motion.div>
        </div>
    )
}

function Action({ icon, label }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="
        bg-[#111827] border border-white/10 rounded-2xl
        p-3
        flex flex-col items-center
        justify-center
        gap-2
        cursor-pointer
      "
        >
            <div className="text-primary">{icon}</div>
            <p className="text-sm text-gray-300">{label}</p>
        </motion.div>
    )
}

function QuickAction({ icon: Icon, label, path }) {
    const navigate = useNavigate()

    return (
        <div
            onClick={() => navigate(path)}
            className="
        bg-[#111827]
        border border-white/10
        rounded-xl
        py-3
        flex flex-col items-center justify-center
        gap-2
        cursor-pointer
        hover:bg-white/5
        transition
      "
        >
            <Icon size={20} className="text-primary" />
            <span className="text-sm">{label}</span>
        </div>
    )
}

export default Dashboard
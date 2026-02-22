import { NavLink } from "react-router-dom"
import {
    LayoutDashboard,
    Upload,
    Gift,
    Trophy,
} from "lucide-react"

function BottomNav() {
    const linkStyle = ({ isActive }) =>
        `flex flex-col items-center text-xs ${isActive ? "text-primary" : "text-gray-400"
        }`

    return (
        <div className="
  fixed bottom-6 left-1/2 -translate-x-1/2
  w-full max-w-md mx-auto
  bg-white/5 backdrop-blur-2xl
  border border-white/10
  rounded-3xl
  py-4 px-8
  flex justify-between
  shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
">
            <NavLink to="/" className={linkStyle}>
                <LayoutDashboard size={20} />
                Home
            </NavLink>

            <NavLink to="/submit" className={linkStyle}>
                <Upload size={20} />
                Submit
            </NavLink>

            <NavLink to="/rewards" className={linkStyle}>
                <Gift size={20} />
                Rewards
            </NavLink>

            <NavLink to="/leaderboard" className={linkStyle}>
                <Trophy size={20} />
                Rank
            </NavLink>
        </div>
    )
}

export default BottomNav
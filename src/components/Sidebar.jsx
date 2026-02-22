import { NavLink } from "react-router-dom"
import {
    LayoutDashboard,
    Upload,
    Gift,
    Trophy,
    Shield,
} from "lucide-react"

function Sidebar() {
    const linkStyle = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive
            ? "bg-primary text-white shadow-md"
            : "text-gray-600 hover:bg-gray-100"
        }`

    return (
        <div className="w-72 bg-white p-8 shadow-sm border-r">
            <h1 className="text-3xl font-bold text-primary mb-12">
                ReValue 🌱
            </h1>

            <nav className="flex flex-col gap-4">
                <NavLink to="/" className={linkStyle}>
                    <LayoutDashboard size={20} />
                    Dashboard
                </NavLink>

                <NavLink to="/submit" className={linkStyle}>
                    <Upload size={20} />
                    Submit Waste
                </NavLink>

                <NavLink to="/rewards" className={linkStyle}>
                    <Gift size={20} />
                    Rewards
                </NavLink>

                <NavLink to="/leaderboard" className={linkStyle}>
                    <Trophy size={20} />
                    Leaderboard
                </NavLink>

                <NavLink to="/admin" className={linkStyle}>
                    <Shield size={20} />
                    Admin
                </NavLink>
            </nav>
        </div>
    )
}

export default Sidebar
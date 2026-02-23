import { Home, Recycle, Gift, User } from "lucide-react"
import { NavLink } from "react-router-dom"

function BottomNav() {
    return (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">
            <div
                className="
          w-full max-w-md
          bg-[#111827]/80 backdrop-blur-md
          border border-white/10
          rounded-2xl
          py-3 px-2
          flex justify-between
          shadow-2xl
        "
            >
                <NavItem to="/" icon={Home} label="Home" />
                <NavItem to="/submit" icon={Recycle} label="Recycle" />
                <NavItem to="/rewards" icon={Gift} label="Rewards" />
                <NavItem to="/profile" icon={User} label="Profile" />
            </div>
        </div>
    )
}

function NavItem({ to, icon: Icon, label }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `
        flex flex-col items-center justify-center
        flex-1
        transition
        ${isActive ? "text-primary" : "text-gray-400"}
        `
            }
        >
            <Icon size={20} />
            <span className="text-[11px] mt-1">{label}</span>
        </NavLink>
    )
}

export default BottomNav
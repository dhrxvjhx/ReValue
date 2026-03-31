import {
    Home,
    Recycle,
    Gift,
    User,
    Shield,
    Truck,
    BarChart3,
    ClipboardList
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function BottomNav() {
    const { userData } = useAuth();

    const role = userData?.role?.toLowerCase()?.trim();

    if (!role) return null;

    return (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">
            <div className="w-full max-w-md bg-[#111827]/80 backdrop-blur-md border border-white/10 rounded-2xl py-3 px-2 flex justify-between shadow-2xl">

                {/* USER */}
                {role === "user" && (
                    <>
                        <NavItem to="/" icon={Home} label="Home" />
                        <NavItem to="/submit" icon={Recycle} label="Recycle" />
                        <NavItem to="/rewards" icon={Gift} label="Rewards" />
                        <NavItem to="/profile" icon={User} label="Profile" />
                    </>
                )}

                {/* ADMIN */}
                {role === "admin" && (
                    <>
                        <NavItem to="/admin" icon={Shield} label="Assign" />
                        <NavItem to="/admin/overview" icon={BarChart3} label="Overview" />
                        <NavItem to="/admin/pickups" icon={ClipboardList} label="Pickups" />
                        <NavItem to="/profile" icon={User} label="Profile" />
                    </>
                )}

                {/* AGENT */}
                {role === "agent" && (
                    <>
                        <NavItem to="/agent" icon={Truck} label="Assigned" />
                        <NavItem to="/agent/history" icon={ClipboardList} label="History" />
                        <NavItem to="/agent/earnings" icon={BarChart3} label="Earnings" />
                        <NavItem to="/profile" icon={User} label="Profile" />
                    </>
                )}

            </div>
        </div>
    );
}

function NavItem({ to, icon: Icon, label }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 transition ${isActive ? "text-primary" : "text-gray-400"
                }`
            }
        >
            <Icon size={20} />
            <span className="text-[11px] mt-1">{label}</span>
        </NavLink>
    );
}

export default BottomNav;
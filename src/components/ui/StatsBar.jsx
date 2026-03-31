export default function StatsBar({ pending, assigned, completed }) {
    return (
        <div className="grid grid-cols-3 gap-3">
            <Stat label="Pending" value={pending} color="text-yellow-400" />
            <Stat label="Assigned" value={assigned} color="text-blue-400" />
            <Stat label="Completed" value={completed} color="text-green-400" />
        </div>
    );
}

function Stat({ label, value, color }) {
    return (
        <div className="bg-[#111827] border border-white/10 p-3 rounded-xl text-center">
            <p className={`text-lg font-bold ${color}`}>{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
        </div>
    );
}
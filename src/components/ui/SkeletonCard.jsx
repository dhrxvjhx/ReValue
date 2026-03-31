export default function SkeletonCard() {
    return (
        <div className="bg-[#111827] border border-white/10 p-4 rounded-xl animate-pulse space-y-3">
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-3 bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-700 rounded w-2/3"></div>
        </div>
    );
}
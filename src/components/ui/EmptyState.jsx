export default function EmptyState({ text = "No data available" }) {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-sm">{text}</p>
        </div>
    );
}
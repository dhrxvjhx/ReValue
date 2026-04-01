import { Inbox } from "lucide-react";

function EmptyState({ title = "Nothing here yet", subtitle = "Try again later" }) {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-center">

            <Inbox className="text-gray-500 mb-3" size={28} />

            <p className="text-sm font-medium text-gray-300">
                {title}
            </p>

            <p className="text-xs text-gray-500 mt-1">
                {subtitle}
            </p>
        </div>
    );
}

export default EmptyState;
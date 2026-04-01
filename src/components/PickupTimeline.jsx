export default function PickupTimeline({ status, pickup }) {
    const steps = [
        {
            key: "pending",
            label: "Requested",
            time: pickup?.createdAt,
        },
        {
            key: "assigned",
            label: "Assigned",
            time: pickup?.assignedAt || null,
        },
        {
            key: "completed",
            label: "Completed",
            time: pickup?.completedAt,
        },
    ];

    const currentIndex = steps.findIndex(s => s.key === status);

    const formatTime = (ts) => {
        if (!ts) return "";
        const date = ts.toDate ? ts.toDate() : new Date(ts);

        return date.toLocaleDateString([], { day: "numeric", month: "short" }) +
            " • " +
            date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div className="mt-4">

            <div className="relative flex justify-between items-start">

                {/* LINE */}
                <div className="absolute top-[6px] left-0 right-0 h-[2px] bg-gray-700" />

                {/* ACTIVE LINE */}
                <div
                    className="absolute top-[6px] left-0 h-[2px] bg-primary transition-all"
                    style={{
                        width: `${(currentIndex / (steps.length - 1)) * 100}%`,
                    }}
                />

                {steps.map((step, index) => {
                    const active = index <= currentIndex;

                    return (
                        <div key={step.key} className="flex flex-col items-center w-full">

                            {/* DOT */}
                            <div
                                className={`w-4 h-4 rounded-full border-2 z-10 transition 
                                ${active
                                        ? "bg-primary border-primary"
                                        : "bg-[#020617] border-gray-600"
                                    }`}
                            />

                            {/* LABEL */}
                            <p className="text-[11px] mt-2 text-gray-400">
                                {step.label}
                            </p>

                            {/* TIME */}
                            {active && step.time && (
                                <p className="text-[10px] text-gray-500 mt-1 text-center">
                                    {formatTime(step.time)}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
export default function PickupTimeline({ status }) {
    const steps = ["pending", "assigned", "completed"];

    return (
        <div className="flex justify-between items-center text-xs mt-3">
            {steps.map((step, index) => {
                const active = steps.indexOf(status) >= index;

                return (
                    <div key={step} className="flex-1 flex flex-col items-center">
                        <div
                            className={`w-3 h-3 rounded-full ${active ? "bg-primary" : "bg-gray-600"
                                }`}
                        />
                        <span className="mt-1 capitalize text-gray-400">
                            {step}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
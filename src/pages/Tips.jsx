import { useState } from "react";

const tipsData = [
    {
        id: 1,
        title: "♻️ How to Segregate Waste Properly",
        category: "General",
        content:
            "Always separate dry and wet waste. Dry waste includes plastic, paper, and metal, while wet waste includes food scraps. Proper segregation improves recycling efficiency.",
    },
    {
        id: 2,
        title: "🧴 Plastic Recycling Tips",
        category: "Plastic",
        content:
            "Wash plastic containers before recycling. Avoid mixing food waste with plastic. Crush bottles to save space and make transport easier.",
    },
    {
        id: 3,
        title: "📄 Paper Recycling Guide",
        category: "Paper",
        content:
            "Do not recycle oily or wet paper. Flatten cardboard boxes to save space. Keep paper dry for better recycling quality.",
    },
    {
        id: 4,
        title: "🥫 Metal Waste Handling",
        category: "Metal",
        content:
            "Rinse cans and remove food residue. Separate aluminum and steel if possible. Metals are highly recyclable and valuable.",
    },
    {
        id: 5,
        title: "🌱 Reduce Waste at Home",
        category: "Lifestyle",
        content:
            "Use reusable bags, bottles, and containers. Avoid single-use plastics. Compost kitchen waste to reduce landfill impact.",
    },
];

function Tips() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">💡 Recycling Tips</h2>

            <div className="space-y-4">
                {tipsData.map((tip) => (
                    <TipCard key={tip.id} tip={tip} />
                ))}
            </div>
        </div>
    );
}

/* 🔹 TIP CARD */
function TipCard({ tip }) {
    const [open, setOpen] = useState(false);

    return (
        <div
            className="bg-[#111827] border border-white/10 p-5 rounded-2xl cursor-pointer transition"
            onClick={() => setOpen(!open)}
        >
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">{tip.title}</h3>

                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {tip.category}
                </span>
            </div>

            {/* CONTENT */}
            <div
                className={`overflow-hidden transition-all duration-300 ${open ? "max-h-40 mt-3" : "max-h-0"
                    }`}
            >
                <p className="text-sm text-gray-400 leading-relaxed">
                    {tip.content}
                </p>
            </div>
        </div>
    );
}

export default Tips;
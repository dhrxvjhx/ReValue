import { UploadCloud } from "lucide-react"

function SubmitWaste() {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-8">
                Submit Waste ♻️
            </h2>

            <div className="glass-card p-6 space-y-6">
                <select className="w-full p-3 rounded-xl bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Select Waste Type</option>
                    <option>Plastic</option>
                    <option>Paper</option>
                    <option>Metal</option>
                </select>

                <input
                    type="number"
                    placeholder="Quantity (kg)"
                    className="w-full p-3 rounded-xl bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <div className="border-2 border-dashed border-white/20 p-8 rounded-2xl text-center hover:border-primary transition cursor-pointer">
                    <UploadCloud
                        className="mx-auto text-primary mb-3"
                        size={32}
                    />
                    <p className="text-gray-400">
                        Upload proof image
                    </p>
                </div>

                <button className="w-full bg-primary py-3 rounded-xl font-semibold hover:bg-green-600 transition">
                    Submit
                </button>
            </div>
        </div>
    )
}

export default SubmitWaste
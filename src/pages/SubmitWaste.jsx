import { useState } from "react"
import { useNavigate } from "react-router-dom"

function SubmitWaste() {
    const navigate = useNavigate()

    const [items, setItems] = useState([
        { type: "plastic", estimated: "" }
    ])

    const addItem = () => {
        setItems([...items, { type: "plastic", estimated: "" }])
    }

    const updateItem = (index, field, value) => {
        const updated = [...items]
        updated[index][field] = value
        setItems(updated)
    }

    const handleNext = () => {
        if (items.some(item => !item.estimated || item.estimated <= 0)) {
            alert("Please enter valid estimated weights")
            return
        }

        navigate("/schedule", { state: { items } })
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Estimate Waste</h2>

            {items.map((item, index) => (
                <div
                    key={index}
                    className="space-y-3 bg-[#111827] p-4 rounded-xl border border-white/10"
                >
                    <select
                        value={item.type}
                        onChange={(e) => updateItem(index, "type", e.target.value)}
                        className="w-full p-2 bg-[#1f2937] rounded"
                    >
                        <option value="plastic">Plastic</option>
                        <option value="paper">Paper</option>
                        <option value="metal">Metal</option>
                        <option value="cardboard">Cardboard</option>
                    </select>

                    <input
                        type="number"
                        placeholder="Estimated weight (kg)"
                        value={item.estimated}
                        onChange={(e) => updateItem(index, "estimated", e.target.value)}
                        className="w-full p-2 bg-[#1f2937] rounded"
                    />
                </div>
            ))}

            <button
                onClick={addItem}
                className="w-full py-2 bg-white/10 rounded-xl"
            >
                + Add Another Item
            </button>

            <button
                onClick={handleNext}
                className="w-full py-3 bg-primary rounded-xl"
            >
                Continue to Schedule
            </button>
        </div>
    )
}

export default SubmitWaste
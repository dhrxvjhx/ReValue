import { useState } from "react"
import { useApp } from "../context/AppContext"

function SubmitWaste() {
    const { addSubmission } = useApp()
    const [type, setType] = useState("plastic")
    const [quantity, setQuantity] = useState("")

    const handleSubmit = () => {
        if (!quantity || quantity <= 0) return
        addSubmission(type, Number(quantity))
        setQuantity("")
        alert("Submission successful!")
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Submit Waste</h2>

            <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full p-3 bg-[#111827] rounded-xl"
            >
                <option value="plastic">Plastic</option>
                <option value="paper">Paper</option>
                <option value="metal">Metal</option>
            </select>

            <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="Quantity (kg)"
                className="w-full p-3 bg-[#111827] rounded-xl"
            />

            <button
                onClick={handleSubmit}
                className="w-full bg-primary py-3 rounded-xl"
            >
                Submit
            </button>
        </div>
    )
}

export default SubmitWaste
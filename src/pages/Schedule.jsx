import { useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useApp } from "../context/AppContext"

function Schedule() {
    const location = useLocation()
    const navigate = useNavigate()
    const { createPickupRequest } = useApp()

    const items = location.state?.items

    const [date, setDate] = useState("")
    const [timeSlot, setTimeSlot] = useState("9AM - 11AM")

    // Prevent direct access without estimate step
    useEffect(() => {
        if (!items) {
            navigate("/submit")
        }
    }, [items, navigate])

    if (!items) return null

    const handleConfirm = () => {
        if (!date) {
            alert("Please select a date")
            return
        }

        const pickupDateTime = `${date} | ${timeSlot}`

        createPickupRequest(items, pickupDateTime)

        navigate("/")
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Schedule Pickup</h2>

            <div>
                <label className="text-sm text-gray-400">Select Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full mt-2 p-2 bg-[#1f2937] rounded"
                />
            </div>

            <div>
                <label className="text-sm text-gray-400">Select Time Slot</label>
                <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full mt-2 p-2 bg-[#1f2937] rounded"
                >
                    <option>9AM - 11AM</option>
                    <option>11AM - 1PM</option>
                    <option>2PM - 4PM</option>
                    <option>4PM - 6PM</option>
                </select>
            </div>

            <button
                onClick={handleConfirm}
                className="w-full py-3 bg-primary rounded-xl"
            >
                Confirm Pickup
            </button>
        </div>
    )
}

export default Schedule
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { createPickup } from "../firebase/pickupService";

function Schedule() {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const items = location.state?.items;

    const [date, setDate] = useState("");
    const [timeSlot, setTimeSlot] = useState("9AM - 11AM");
    const [loading, setLoading] = useState(false);

    // Prevent direct access without estimate step
    useEffect(() => {
        if (!items) {
            navigate("/submit");
        }
    }, [items, navigate]);

    if (!items) return null;

    const handleConfirm = async () => {
        if (!date) {
            alert("Please select a date");
            return;
        }

        if (!currentUser) {
            alert("You must be logged in");
            return;
        }

        const pickupDateTime = `${date} | ${timeSlot}`;

        try {
            setLoading(true);

            await createPickup({
                userId: currentUser.uid,
                items,
                scheduledDate: pickupDateTime,
            });

            navigate("/");
        } catch (error) {
            console.error("Pickup creation failed:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

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
                disabled={loading}
                className="w-full py-3 bg-primary rounded-xl disabled:opacity-50"
            >
                {loading ? "Creating Pickup..." : "Confirm Pickup"}
            </button>
        </div>
    );
}

export default Schedule;
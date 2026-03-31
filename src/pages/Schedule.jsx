import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { createPickup } from "../firebase/pickupService";
import { useAuth } from "../context/AuthContext";

function Schedule() {
    const location = useLocation();
    const navigate = useNavigate();

    const { currentUser, userData } = useAuth(); // 🔥 IMPORTANT

    const items = location.state?.items;

    const [date, setDate] = useState("");
    const [timeSlot, setTimeSlot] = useState("9AM - 11AM");

    // Prevent direct access
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

        // 🔥 ADDRESS CHECK (VERY IMPORTANT)
        if (!userData?.address) {
            alert("Please add your address in Profile before scheduling pickup");
            navigate("/profile");
            return;
        }

        const scheduledDate = `${date} | ${timeSlot}`;

        try {
            await createPickup({
                userId: currentUser.uid,
                items,
                scheduledDate,
                address: userData.address, // 🔥 ADD THIS
            });

            navigate("/");
        } catch (error) {
            console.error("Error creating pickup:", error);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Schedule Pickup</h2>

            {/* DATE */}
            <div>
                <label className="text-sm text-gray-400">Select Date</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full mt-2 p-2 bg-[#1f2937] rounded"
                />
            </div>

            {/* TIME SLOT */}
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

            {/* CONFIRM BUTTON */}
            <button
                onClick={handleConfirm}
                className="w-full py-3 bg-primary rounded-xl"
            >
                Confirm Pickup
            </button>
        </div>
    );
}

export default Schedule;
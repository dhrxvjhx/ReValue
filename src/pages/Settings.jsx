import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import toast from "react-hot-toast";

function Settings() {
    const { currentUser, userData } = useAuth();
    const [name, setName] = useState(userData?.name || "");

    const handleSave = async () => {
        try {
            await updateDoc(doc(db, "users", currentUser.uid), {
                name,
            });

            toast.success("Profile updated!");
        } catch (error) {
            toast.error("Update failed");
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Settings</h2>

            <div className="bg-glass backdrop-blur-lg border border-white/10 rounded-2xl p-6 space-y-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 bg-[#1f2937] text-white rounded-xl border border-white/10"
                />

                <button
                    onClick={handleSave}
                    className="w-full py-3 bg-primary text-black rounded-xl font-semibold"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}

export default Settings;
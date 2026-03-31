import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function Profile() {
    const { currentUser, userData, logout } = useAuth();

    const [activeField, setActiveField] = useState(null);
    const [value, setValue] = useState("");

    const openEditor = (field, currentValue) => {
        setActiveField(field);
        setValue(currentValue || "");
    };

    const handleSave = async () => {
        try {
            await updateDoc(doc(db, "users", currentUser.uid), {
                [activeField]: value,
            });

            toast.success("Updated!");
            setActiveField(null);
        } catch {
            toast.error("Failed to update");
        }
    };

    const total = userData?.totalPoints || 0;
    const redeemed = userData?.redeemedPoints || 0;
    const available = total - redeemed;

    const level = Math.floor(total / 100);

    const badge =
        level < 2
            ? "Beginner 🌱"
            : level < 5
                ? "Recycler ♻"
                : "Eco Pro 🌍";

    return (
        <div className="space-y-6">

            {/* 🔥 HEADER */}
            <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 text-center space-y-4">

                {/* Avatar */}
                <div className="w-16 h-16 mx-auto rounded-full bg-primary flex items-center justify-center text-xl font-bold">
                    {userData?.name?.[0] || "U"}
                </div>

                <h2 className="text-xl font-bold">{userData?.name}</h2>
                <p className="text-primary">{badge}</p>
                <p className="text-sm text-gray-400">Level {level}</p>

                {/* 🔥 STATS STRIP */}
                <div className="bg-[#1f2937] rounded-2xl p-4 flex justify-between items-center mt-4">

                    {/* Total */}
                    <div className="text-center flex-1">
                        <p className="text-xs text-gray-400">Total</p>
                        <p className="text-lg font-semibold">{total}</p>
                    </div>

                    {/* Available */}
                    <div className="text-center flex-1">
                        <p className="text-xs text-gray-400">Available</p>
                        <p className="text-2xl font-bold text-primary">{available}</p>
                    </div>

                    {/* Redeemed */}
                    <div className="text-center flex-1">
                        <p className="text-xs text-gray-400">Redeemed</p>
                        <p className="text-lg font-semibold">{redeemed}</p>
                    </div>

                </div>
            </div>

            {/* ⚙ SETTINGS LIST */}
            <div className="bg-[#111827] border border-white/10 rounded-2xl divide-y divide-white/10">

                <SettingsItem
                    label="Name"
                    value={userData?.name}
                    onClick={() => openEditor("name", userData?.name)}
                />

                <SettingsItem
                    label="Email"
                    value={userData?.email}
                    disabled
                />

                <SettingsItem
                    label="Phone"
                    value={userData?.phone}
                    onClick={() => openEditor("phone", userData?.phone)}
                />

                <SettingsItem
                    label="Address"
                    value={userData?.address}
                    onClick={() => openEditor("address", userData?.address)}
                />
            </div>

            {/* 🚪 LOGOUT */}
            <button
                onClick={logout}
                className="w-full py-3 bg-red-500/20 text-red-400 rounded-xl"
            >
                Logout
            </button>

            {/* ✨ MODAL */}
            {activeField && (
                <EditModal
                    field={activeField}
                    value={value}
                    setValue={setValue}
                    onClose={() => setActiveField(null)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}

/* 🔹 SETTINGS ROW */
function SettingsItem({ label, value, onClick, disabled }) {
    return (
        <div
            onClick={!disabled ? onClick : undefined}
            className={`flex justify-between items-center p-4 ${disabled ? "opacity-50" : "cursor-pointer hover:bg-white/5"
                }`}
        >
            <span>{label}</span>

            <span className="text-gray-400 text-sm text-right max-w-[60%] break-words">
                {value || "Not set"}
            </span>
        </div>
    );
}

/* 🔹 MODAL */
function EditModal({ field, value, setValue, onClose, onSave }) {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#111827] p-6 rounded-2xl w-[90%] max-w-sm space-y-4"
            >
                <h3 className="text-lg font-semibold capitalize">
                    Edit {field}
                </h3>

                {/* 🔥 MULTILINE FOR ADDRESS */}
                {field === "address" ? (
                    <textarea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        rows={3}
                        className="w-full p-2 bg-[#1f2937] rounded"
                        placeholder="Enter full pickup address..."
                    />
                ) : (
                    <input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full p-2 bg-[#1f2937] rounded"
                    />
                )}

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-400"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onSave}
                        className="px-4 py-2 bg-primary rounded"
                    >
                        Save
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default Profile;
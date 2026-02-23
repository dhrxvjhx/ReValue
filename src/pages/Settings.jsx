import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    doc,
    updateDoc
} from "firebase/firestore";
import {
    updateProfile,
    updatePassword,
    sendPasswordResetEmail,
    deleteUser
} from "firebase/auth";
import { db } from "../firebase/firebase";
import toast from "react-hot-toast";

function Settings() {
    const { currentUser, userData } = useAuth();

    const [name, setName] = useState(userData?.name || "");
    const [newPassword, setNewPassword] = useState("");

    const handleProfileUpdate = async () => {
        try {
            await updateDoc(doc(db, "users", currentUser.uid), { name });

            await updateProfile(currentUser, {
                displayName: name,
            });

            toast.success("Profile updated!");
        } catch {
            toast.error("Update failed");
        }
    };

    const handlePasswordChange = async () => {
        if (!newPassword || newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        try {
            await updatePassword(currentUser, newPassword);
            toast.success("Password updated!");
            setNewPassword("");
        } catch {
            toast.error("Re-login required to change password");
        }
    };

    const handleResetEmail = async () => {
        try {
            await sendPasswordResetEmail(currentUser.auth, currentUser.email);
            toast.success("Password reset email sent");
        } catch {
            toast.error("Failed to send reset email");
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteUser(currentUser);
            toast.success("Account deleted");
        } catch {
            toast.error("Re-login required to delete account");
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-10">

            <h1 className="text-3xl font-bold">Settings</h1>

            {/* PROFILE */}
            <section className="space-y-6 border-b border-white/10 pb-8">
                <h2 className="text-lg font-semibold text-primary">Profile</h2>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full mt-2 p-3 bg-[#1f2937] rounded-lg border border-white/10 text-white"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-400">Email</label>
                        <input
                            type="email"
                            value={currentUser?.email || ""}
                            disabled
                            className="w-full mt-2 p-3 bg-[#111827] rounded-lg border border-white/10 text-gray-400"
                        />
                    </div>

                    <button
                        onClick={handleProfileUpdate}
                        className="px-6 py-2 bg-primary text-black rounded-lg font-semibold"
                    >
                        Save Changes
                    </button>
                </div>
            </section>

            {/* SECURITY */}
            <section className="space-y-6 border-b border-white/10 pb-8">
                <h2 className="text-lg font-semibold text-primary">Security</h2>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-400">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full mt-2 p-3 bg-[#1f2937] rounded-lg border border-white/10 text-white"
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handlePasswordChange}
                            className="px-6 py-2 bg-primary text-black rounded-lg font-semibold"
                        >
                            Change Password
                        </button>

                        <button
                            onClick={handleResetEmail}
                            className="px-6 py-2 bg-white/10 rounded-lg"
                        >
                            Send Reset Email
                        </button>
                    </div>
                </div>
            </section>

            {/* DANGER ZONE */}
            <section className="space-y-6">
                <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>

                <button
                    onClick={handleDeleteAccount}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold"
                >
                    Delete Account
                </button>
            </section>

        </div>
    );
}

export default Settings;
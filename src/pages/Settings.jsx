import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

function Settings() {
    const { currentUser, userData } = useAuth();

    const [form, setForm] = useState({
        name: "",
        phone: "",
        address: "",
        notifications: true,
    });

    useEffect(() => {
        if (userData) {
            setForm({
                name: userData.name || "",
                phone: userData.phone || "",
                address: userData.address || "",
                notifications: userData.notifications ?? true,
            });
        }
    }, [userData]);

    const save = async () => {
        await updateDoc(doc(db, "users", currentUser.uid), form);
    };

    return (
        <div className="space-y-6">

            <h2 className="text-xl font-semibold">⚙️ Settings</h2>

            <Section title="Profile">
                <Input label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
                <Input label="Phone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
            </Section>

            <Section title="Address">
                <Input label="Address" value={form.address} onChange={v => setForm({ ...form, address: v })} />
            </Section>

            <Section title="Preferences">
                <Toggle label="Notifications" value={form.notifications} onChange={v => setForm({ ...form, notifications: v })} />
            </Section>

            <Section title="About">
                <p className="text-sm text-gray-400">
                    Made with ❤️ by{" "}
                    <a
                        href="https://github.com/dhrxvjhx"
                        target="_blank"
                        className="text-primary underline"
                    >
                        Dhruv Jha
                    </a>
                </p>
                <p className="text-xs text-gray-500 mt-1">Version 1.0.0</p>
            </Section>

            <button
                onClick={save}
                className="w-full py-3 bg-primary rounded-xl"
            >
                Save Changes
            </button>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="bg-[#020617] p-4 rounded-2xl space-y-3">
            <p className="text-xs text-gray-400">{title}</p>
            {children}
        </div>
    );
}

function Input({ label, value, onChange }) {
    return (
        <div>
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-[#111827] p-3 rounded-xl"
            />
        </div>
    );
}

function Toggle({ label, value, onChange }) {
    return (
        <div className="flex justify-between items-center">
            <p>{label}</p>
            <div
                onClick={() => onChange(!value)}
                className={`w-10 h-5 rounded-full p-1 cursor-pointer ${value ? "bg-primary" : "bg-gray-600"
                    }`}
            >
                <div className="w-4 h-4 bg-white rounded-full" />
            </div>
        </div>
    );
}

export default Settings;
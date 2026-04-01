import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

function AdminPickups() {
    const [pickups, setPickups] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "pickups"),
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setPickups(data);
            }
        );

        return () => unsubscribe();
    }, []);

    return (
        <div className="space-y-6">

            <h2 className="text-2xl font-bold">📦 All Pickups</h2>

            {pickups.map(p => (
                <div
                    key={p.id}
                    className="bg-[#111827] border border-white/10 p-4 rounded-xl"
                >
                    <p className="text-sm text-gray-400">
                        {p.scheduledDate}
                    </p>

                    <p className="mt-1">
                        Status:{" "}
                        <span className="text-primary font-medium">
                            {p.status}
                        </span>
                    </p>
                </div>
            ))}

        </div>
    );
}

export default AdminPickups;
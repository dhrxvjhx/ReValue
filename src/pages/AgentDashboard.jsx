import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getPickups } from "../firebase/pickupService";

const AgentDashboard = () => {
    const { currentUser, userData } = useAuth();
    const [pickups, setPickups] = useState([]);

    useEffect(() => {
        if (!currentUser || !userData) return;

        getPickups(currentUser.uid, userData.role)
            .then(setPickups)
            .catch(console.error);
    }, [currentUser, userData]);

    return (
        <div>
            <h1>Assigned Pickups</h1>

            {pickups.map(pickup => (
                <div key={pickup.id}>
                    <p>Status: {pickup.status}</p>
                    <p>Scheduled: {pickup.scheduledDate}</p>
                </div>
            ))}
        </div>
    );
};

export default AgentDashboard;
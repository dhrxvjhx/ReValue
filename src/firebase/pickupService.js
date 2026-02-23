import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const createPickup = async (pickupData) => {
    try {
        const pickupRef = await addDoc(collection(db, "pickups"), {
            ...pickupData,
            status: "pending",
            actualWeights: null,
            pointsEarned: 0,
            createdAt: serverTimestamp(),
        });

        console.log("✅ Pickup created with ID:", pickupRef.id);
        return pickupRef.id;
    } catch (error) {
        console.error("❌ Error creating pickup:", error);
        throw error;
    }
};
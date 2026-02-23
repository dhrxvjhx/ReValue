import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const createPickup = async (pickupData) => {
    const pickupRef = await addDoc(collection(db, "pickups"), {
        ...pickupData,
        status: "pending",
        actualWeights: null,
        pointsEarned: 0,
        createdAt: serverTimestamp()
    });

    return pickupRef.id;
};
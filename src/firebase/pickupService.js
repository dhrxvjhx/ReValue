import {
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    query,
    where,
    updateDoc,
    doc
} from "firebase/firestore";
import { db } from "./firebase";

export const createPickup = async (pickupData) => {
    const pickupRef = await addDoc(collection(db, "pickups"), {
        ...pickupData,
        status: "pending",
        assignedAgentId: null,
        actualWeights: null,
        pointsEarned: 0,
        proofImageUrl: null,
        completedAt: null,
        completedBy: null,
        createdAt: serverTimestamp(),
    });

    return pickupRef.id;
};

export const getPickups = async (uid, role) => {
    const pickupsRef = collection(db, "pickups");

    if (role === "admin") {
        const snapshot = await getDocs(pickupsRef);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    if (role === "agent") {
        const q = query(
            pickupsRef,
            where("assignedAgentId", "==", uid)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    const q = query(
        pickupsRef,
        where("userId", "==", uid)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const completePickup = async (pickupId, actualWeights, adminId) => {
    const pickupRef = doc(db, "pickups", pickupId);

    await updateDoc(pickupRef, {
        status: "completed",
        actualWeights,
        completedAt: serverTimestamp(),
        completedBy: adminId,
    });
};
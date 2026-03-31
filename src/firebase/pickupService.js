import {
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    query,
    where,
    updateDoc,
    doc,
    increment
} from "firebase/firestore";
import { db } from "./firebase";

/* 🔹 CREATE PICKUP */
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

/* 🔹 GET PICKUPS */
export const getPickups = async (uid, role) => {
    const pickupsRef = collection(db, "pickups");

    if (role === "admin") {
        const snapshot = await getDocs(pickupsRef);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    }

    if (role === "agent") {
        const q = query(
            pickupsRef,
            where("assignedAgentId", "==", uid)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    }

    const q = query(
        pickupsRef,
        where("userId", "==", uid)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

/* 🔹 ASSIGN AGENT */
export const assignAgentToPickup = async (pickupId, agentId) => {
    const pickupRef = doc(db, "pickups", pickupId);

    await updateDoc(pickupRef, {
        assignedAgentId: agentId,
        status: "assigned",
    });
};

/* 🔥 COMPLETE FLOW (CORE LOGIC) */
const POINTS_RATE = {
    plastic: 2,
    paper: 1,
    glass: 3,
    metal: 4,
};

export const completePickupFlow = async (pickup, weights, imageUrl) => {
    const pickupRef = doc(db, "pickups", pickup.id);

    let totalPoints = 0;

    weights.forEach((item) => {
        const rate = POINTS_RATE[item.type] || 1;
        totalPoints += item.actual * rate;
    });

    // ✅ update pickup
    await updateDoc(pickupRef, {
        status: "completed",
        actualWeights: weights,
        pointsEarned: totalPoints,
        proofImageUrl: imageUrl || null,
        completedAt: serverTimestamp(),
    });

    // ✅ update user points
    const userRef = doc(db, "users", pickup.userId);

    await updateDoc(userRef, {
        totalPoints: increment(totalPoints),
    });
};
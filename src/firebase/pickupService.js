import {
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    query,
    where,
    updateDoc,
    doc,
    increment,
    onSnapshot
} from "firebase/firestore";
import { createNotification } from "./notificationService";
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

/* 🔹 GET PICKUPS (fallback if needed) */
export const getPickups = async (uid, role) => {
    const pickupsRef = collection(db, "pickups");

    let q;

    if (role === "admin") {
        q = query(pickupsRef);
    } else if (role === "agent") {
        q = query(pickupsRef, where("assignedAgentId", "==", uid));
    } else {
        q = query(pickupsRef, where("userId", "==", uid));
    }

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

/* 🔴 REAL-TIME SUBSCRIBE */
export const subscribeToPickups = (uid, role, callback) => {
    const pickupsRef = collection(db, "pickups");

    let q;

    if (role === "admin") {
        q = query(pickupsRef); // ✅ IMPORTANT FIX
    } else if (role === "agent") {
        q = query(pickupsRef, where("assignedAgentId", "==", uid));
    } else {
        q = query(pickupsRef, where("userId", "==", uid));
    }

    return onSnapshot(
        q,
        (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            callback(data);
        },
        (error) => {
            console.error("Realtime error:", error);
        }
    );
};

/* 🔹 ASSIGN AGENT */
export const assignAgentToPickup = async (pickupId, agentId) => {
    const pickupRef = doc(db, "pickups", pickupId);

    await updateDoc(pickupRef, {
        assignedAgentId: agentId,
        status: "assigned",
    });

    // 🔔 notify agent
    await createNotification(
        agentId,
        "🚚 New pickup assigned to you",
        "assigned"
    );
};

/* 🔥 COMPLETE FLOW */
const POINTS_RATE = {
    plastic: 2,
    paper: 1,
    glass: 3,
    metal: 4,
};

export const completePickupFlow = async (
    pickup,
    weights,
    imageUrl,
    agentId
) => {
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
        completedBy: agentId, // 🔥 IMPORTANT FIX
    });

    // ✅ update user points
    const userRef = doc(db, "users", pickup.userId);

    await updateDoc(userRef, {
        totalPoints: increment(totalPoints),
    });

    // 🔔 notify user
    await createNotification(
        pickup.userId,
        "✅ Your pickup has been completed",
        "completed"
    );
};
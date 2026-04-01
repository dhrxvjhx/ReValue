import {
    doc,
    getDoc,
    setDoc,
    collection,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    updateDoc
} from "firebase/firestore";
import { db } from "./firebase";

/* 🔹 GET AGENTS */
export const getAgents = async () => {
    const q = query(
        collection(db, "users"),
        where("role", "==", "agent")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

/* 🔹 CREATE USER */
export const createUserIfNotExists = async (user) => {
    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                email: user.email,
                name: user.displayName || "User",
                role: "user",
                totalPoints: 0,
                redeemedPoints: 0,
                treesPlanted: 0,
                phone: "",
                address: "",
                createdAt: new Date(),
            });
        } else {
            // 🔥 SAFETY: ensure fields exist (IMPORTANT)
            const data = userSnap.data();

            const updates = {};

            if (data.totalPoints === undefined) updates.totalPoints = 0;
            if (data.redeemedPoints === undefined) updates.redeemedPoints = 0;
            if (data.treesPlanted === undefined) updates.treesPlanted = 0;

            if (Object.keys(updates).length > 0) {
                await updateDoc(userRef, updates);
            }
        }
    } catch (error) {
        console.error("Firestore error:", error);
    }
};

/* 🔥 LEADERBOARD (FILTERED + CLEAN) */
export const getLeaderboard = async () => {
    const q = query(
        collection(db, "users"),
        where("role", "==", "user"),
        orderBy("totalPoints", "desc"),
        limit(10)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};
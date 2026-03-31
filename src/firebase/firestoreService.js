import {
    doc,
    getDoc,
    setDoc,
    collection,
    getDocs,
    query,
    where,
    orderBy,
    limit
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
        }
    } catch (error) {
        console.error("Firestore error:", error);
    }
};

/* 🔥 LEADERBOARD */
export const getLeaderboard = async () => {
    const q = query(
        collection(db, "users"),
        orderBy("totalPoints", "desc"),
        limit(10)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};
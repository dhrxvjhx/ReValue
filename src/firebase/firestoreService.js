import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export const getAgents = async () => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("role", "==", "agent"));

    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));
};


export const createUserIfNotExists = async (user) => {
    try {
        console.log("🔥 Checking Firestore for user:", user.uid);

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        console.log("Snapshot exists:", userSnap.exists());

        if (!userSnap.exists()) {
            console.log("🟢 Creating new user document...");

            await setDoc(userRef, {
                email: user.email,
                name: user.displayName || "User",
                role: "user",
                totalPoints: 0,
                redeemedPoints: 0,
                treesPlanted: 0,
                createdAt: new Date()
            });

            console.log("✅ User document created successfully.");
        } else {
            console.log("User already exists.");
        }

    } catch (error) {
        console.error("❌ Firestore error:", error);
    }
};
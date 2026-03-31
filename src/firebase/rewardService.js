import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    serverTimestamp,
    doc,
    updateDoc,
    increment
} from "firebase/firestore";
import { db } from "./firebase";

/* 🔥 SUBSCRIBE TO REWARD HISTORY */
export const subscribeToRewards = (uid, callback) => {
    const q = query(
        collection(db, "rewards"),
        where("userId", "==", uid)
    );

    return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        callback(data);
    });
};

/* 🔥 REDEEM REWARD */
export const redeemRewardFirestore = async (uid, reward) => {
    // 1️⃣ store reward
    await addDoc(collection(db, "rewards"), {
        userId: uid,
        name: reward.name,
        cost: reward.cost,
        createdAt: serverTimestamp()
    });

    // 2️⃣ deduct points
    const userRef = doc(db, "users", uid);

    await updateDoc(userRef, {
        redeemedPoints: increment(reward.cost)
    });
};
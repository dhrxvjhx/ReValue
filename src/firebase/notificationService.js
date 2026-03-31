import {
    collection,
    query,
    where,
    onSnapshot,
    updateDoc,
    doc,
    orderBy
} from "firebase/firestore";
import { db } from "./firebase";

/* 🔥 REAL-TIME SUBSCRIBE */
export const subscribeToNotifications = (uid, callback) => {
    const q = query(
        collection(db, "notifications"),
        where("userId", "==", uid),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        callback(data);
    });
};

/* ✅ MARK AS READ */
export const markNotificationAsRead = async (id) => {
    const ref = doc(db, "notifications", id);

    await updateDoc(ref, {
        read: true,
    });
};
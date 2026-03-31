import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// 🔔 FCM SETUP
export const messaging = getMessaging(app);

// 🔑 GET TOKEN
export const requestNotificationPermission = async () => {
    if (Notification.permission === "denied") {
        console.log("Notifications are blocked by user");
        return null;
    }

    if (Notification.permission === "granted") {
        return null; // already granted
    }

    try {
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
            return true;
        }
    } catch (err) {
        console.error("Notification error:", err);
    }
};

// 🔔 FOREGROUND LISTENER
export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });


export const saveFcmToken = async (uid, token) => {
    if (!uid || !token) return;

    const userRef = doc(db, "users", uid);

    await updateDoc(userRef, {
        fcmToken: token
    });
};
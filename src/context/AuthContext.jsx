import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { createUserIfNotExists } from "../firebase/firestoreService";
import { doc, onSnapshot } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = async () => {
        await signOut(auth);
    };

    useEffect(() => {
        let unsubscribeUserDoc = null;

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            setLoading(true);

            if (user) {
                try {
                    await createUserIfNotExists(user);

                    const userDocRef = doc(db, "users", user.uid);

                    // 🔥 REAL-TIME LISTENER (FIX)
                    unsubscribeUserDoc = onSnapshot(userDocRef, (docSnap) => {
                        if (docSnap.exists()) {
                            setUserData(docSnap.data());
                        } else {
                            setUserData(null);
                        }
                    });

                    setCurrentUser(user);
                } catch (error) {
                    console.error("Auth error:", error);
                    setCurrentUser(null);
                    setUserData(null);
                }
            } else {
                setCurrentUser(null);
                setUserData(null);

                if (unsubscribeUserDoc) {
                    unsubscribeUserDoc();
                }
            }

            setLoading(false);
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeUserDoc) unsubscribeUserDoc();
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                userData,
                loading,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
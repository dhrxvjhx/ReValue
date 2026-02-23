import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { createUserIfNotExists } from "../firebase/firestoreService";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = async () => {
        await signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true);

            if (user) {
                try {
                    await createUserIfNotExists(user);

                    const userDocRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        setUserData(userDoc.data());
                    } else {
                        setUserData(null);
                    }

                    setCurrentUser(user);
                } catch (error) {
                    console.error("AuthContext error:", error);
                    setCurrentUser(null);
                    setUserData(null);
                }
            } else {
                setCurrentUser(null);
                setUserData(null);
            }

            setLoading(false);
        });

        return unsubscribe;
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
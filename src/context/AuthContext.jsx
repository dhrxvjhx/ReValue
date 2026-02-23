import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { createUserIfNotExists } from "../firebase/firestoreService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { signOut } from "firebase/auth";

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
            console.log("Auth state changed:", user);

            if (user) {
                console.log("Calling createUserIfNotExists...");

                await createUserIfNotExists(user);

                const userDoc = await getDoc(doc(db, "users", user.uid));
                setUserData(userDoc.data());
            } else {
                setUserData(null);
            }

            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, userData, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
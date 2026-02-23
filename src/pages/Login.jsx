import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    useEffect(() => {
        if (currentUser) {
            navigate("/");
        }
    }, [currentUser, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleLogin} className="p-6 bg-white rounded shadow">
                <h2 className="mb-4 text-xl font-bold">Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    className="block mb-3 w-full border p-2"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="block mb-3 w-full border p-2"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="bg-green-500 text-white px-4 py-2 w-full">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
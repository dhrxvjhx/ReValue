import { useState } from "react";
import { motion } from "framer-motion";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const redirectPath = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                toast.success("Welcome back!");
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
                toast.success("Account created successfully!");
            }

            setSuccess(true);

            setTimeout(() => {
                navigate(redirectPath, { replace: true });
            }, 800);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-darkBg flex items-center justify-center px-4 text-white">
            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-glass backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full max-w-md space-y-6 overflow-hidden"
            >
                {success && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-primary/10 backdrop-blur-sm flex items-center justify-center z-20"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="text-primary text-5xl font-bold"
                        >
                            ✓
                        </motion.div>
                    </motion.div>
                )}

                <h2 className="text-2xl font-bold text-center text-white">
                    {isLogin ? "Welcome Back" : "Create Account"}
                </h2>

                {/* Toggle */}
                <div className="relative flex bg-white/5 rounded-xl p-1">
                    <motion.div
                        layout
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="absolute top-1 bottom-1 w-1/2 bg-primary rounded-lg"
                        style={{ left: isLogin ? "4px" : "50%" }}
                    />

                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 rounded-lg text-sm z-10 transition ${isLogin
                                ? "text-black font-semibold"
                                : "text-gray-300 hover:text-white"
                            }`}
                    >
                        Login
                    </button>

                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 rounded-lg text-sm z-10 transition ${!isLogin
                                ? "text-black font-semibold"
                                : "text-gray-300 hover:text-white"
                            }`}
                    >
                        Register
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 bg-[#1f2937] text-white placeholder-gray-400 rounded-xl border border-white/10 focus:outline-none focus:border-primary"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 bg-[#1f2937] text-white placeholder-gray-400 rounded-xl border border-white/10 focus:outline-none focus:border-primary"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button
                        disabled={loading}
                        className="w-full py-3 bg-primary text-black rounded-xl font-semibold disabled:opacity-50 transition"
                    >
                        {loading
                            ? "Please wait..."
                            : isLogin
                                ? "Login"
                                : "Create Account"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

export default Auth;
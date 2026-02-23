import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form
                onSubmit={handleRegister}
                className="bg-glass backdrop-blur-lg border border-white/10 p-6 rounded-2xl w-80 space-y-4"
            >
                <h2 className="text-xl font-bold text-center">Register</h2>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 bg-[#1f2937] rounded"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 bg-[#1f2937] rounded"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    disabled={loading}
                    className="w-full py-2 bg-primary rounded-xl"
                >
                    {loading ? "Creating Account..." : "Register"}
                </button>

                <p
                    className="text-sm text-center text-gray-400 cursor-pointer"
                    onClick={() => navigate("/login")}
                >
                    Already have an account? Login
                </p>
            </form>
        </div>
    );
}

export default Register;
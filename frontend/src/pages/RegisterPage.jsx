import { useState } from "react";
import { useDispatch } from "react-redux";
import api from "../api";
import SocialLoginButtons from "../components/SocialLoginButtons";
import { Link } from "react-router-dom";

export default function RegisterPage() {
    const dispatch = useDispatch();
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");
        try {
            const res = await api.post("/auth/register/", form);
            setMsg(res.message || "Registered. Check email to verify.");
        } catch (err) {
            setMsg("Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#231846] via-purple-800 to-[#86307f]">
            <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-6 text-pink-300">
                    Create Account
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none"
                    />
                    <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none"
                    />
                    <input
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 rounded-lg bg-gray-800 text-gray-200 focus:outline-none"
                    />
                    <button
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg text-white font-semibold"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <div className="mt-6 text-center text-gray-300">
                    Or sign up with
                </div>
                <div>
                    <SocialLoginButtons className="flex gap-3 items-center justify-center mt-5" />
                </div>

                <p className="mt-6 text-center text-gray-300">
                    Already have an account?{" "}
                    <Link to="/login" className="text-pink-400 font-semibold">
                        Login
                    </Link>
                </p>
                {msg && (
                    <p className="mt-3 text-center text-sm text-green-300">
                        {msg}
                    </p>
                )}
            </div>
        </div>
    );
}

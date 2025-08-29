import { useState } from "react";
import { useDispatch } from "react-redux";
import { setAccess, setUser } from "../store/authSlice";
import SocialLoginButtons from "../components/SocialLoginButtons";
import api from "../api";
import { Link } from "react-router-dom";

export default function LoginPage() {
    const dispatch = useDispatch();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");
        try {
            const res = await api.post("/auth/login/", form);
            dispatch(setAccess(res.access));
            dispatch(setUser(res.user));
        } catch (err) {
            setMsg("Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#231846] via-purple-800 to-[#86307f]">
            <div className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md text-white">
                <h1 className="text-3xl font-bold text-center mb-6 text-pink-300">
                    Welcome Back
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                {msg && <p className="mt-3 text-sm text-red-400">{msg}</p>}
                <div className="mt-6 text-center text-gray-300">
                    Or continue with
                </div>
                <div className="mt-4">
                    <SocialLoginButtons className="flex gap-3 items-center justify-center mt-5" />
                </div>
                <p className="mt-6 text-center text-gray-400">
                    New here?{" "}
                    <Link
                        to="/register"
                        className="text-pink-400 font-semibold"
                    >
                        Create account
                    </Link>
                </p>
            </div>
        </div>
    );
}

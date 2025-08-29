import { useState } from "react";
import { useDispatch } from "react-redux";
import { setAccess, setUser } from "../store/authSlice";
import api from "../api";
import SocialLoginButtons from "../components/SocialLoginButtons";

export default function Login() {
    const dispatch = useDispatch();
    const [form, setForm] = useState({ email: "", password: "" });
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let res = await api.post("/auth/login/", form);
            dispatch(setAccess(res.access));
            dispatch(setUser(res.user));
        } catch (err) {
            setMsg("Invalid credentials");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Login</h1>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleChange}
                    className="w-full border p-2"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    className="w-full border p-2"
                />
                <button
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            {msg && <p className="mt-2 text-sm text-red-500">{msg}</p>}
            <div className="mt-4">
                <SocialLoginButtons />
            </div>
        </div>
    );
}

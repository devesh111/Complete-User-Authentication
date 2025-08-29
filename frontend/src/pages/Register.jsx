import { useState } from "react";
import api from "../api";

export default function Register() {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let res = await api.post("/auth/register/", form);
            setMsg(res.message + " Check email to verify.");
        } catch (err) {
            setMsg("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Register</h1>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                    className="w-full border p-2"
                />
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
                    className="w-full bg-green-500 text-white py-2 rounded"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
            {msg && <p className="mt-2 text-sm">{msg}</p>}
        </div>
    );
}

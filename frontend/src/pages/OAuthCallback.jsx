import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAccess, setUser } from "../store/authSlice";

function parseQuery(q) {
    const params = new URLSearchParams(q);
    const obj = {};
    for (const [k, v] of params.entries()) obj[k] = v;
    return obj;
}

export default function OAuthCallback() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [msg, setMsg] = useState("Processing OAuth callback...");

    useEffect(() => {
        async function handle() {
            try {
                const qs = parseQuery(location.search);
                const { code, state, error, error_description } = qs;
                if (error) {
                    setMsg(`Provider error: ${error_description || error}`);
                    return;
                }
                if (!code || !state) {
                    setMsg("Missing code or state");
                    return;
                }
                const decoded = JSON.parse(atob(state));
                const { nonce, provider } = decoded;
                const saved = localStorage.getItem("oauth_state_" + nonce);
                if (!saved) {
                    setMsg("Missing saved oauth state (possible CSRF)");
                    return;
                }
                const savedObj = JSON.parse(saved);
                if (
                    savedObj.nonce !== nonce ||
                    savedObj.provider !== provider
                ) {
                    setMsg("Invalid state (possible CSRF)");
                    return;
                }
                const code_verifier =
                    localStorage.getItem("pkce_" + nonce) || null;
                const apiUrlBase =
                    import.meta.env.VITE_API_URL || "http://localhost:8000/api";
                const body = { code };
                if (code_verifier) body.code_verifier = code_verifier;
                const res = await fetch(
                    `${apiUrlBase}/auth/social/${provider}/`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify(body),
                    },
                );
                if (!res.ok) {
                    const t = await res.text();
                    setMsg("Backend error: " + t);
                    return;
                }
                const data = await res.json();
                dispatch(setAccess(data.access));
                dispatch(setUser(data.user));
                localStorage.removeItem("oauth_state_" + nonce);
                localStorage.removeItem("pkce_" + nonce);
                setMsg("Login successful, redirecting...");
                setTimeout(() => navigate("/dashboard"), 800);
            } catch (e) {
                console.error(e);
                setMsg("OAuth callback failed: " + e.message);
            }
        }
        handle();
    }, []);

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-700">
            <div className="p-6 max-w-lg mx-auto">
                <h1 className="text-gray-300 text-lg font-semibold">OAuth Callback</h1>
                <p className="mt-4 text-gray-300">{msg}</p>
            </div>
        </div>
    );
}

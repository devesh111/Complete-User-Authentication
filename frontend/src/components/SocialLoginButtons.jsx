import React from "react";
import { randomString, generateCodeChallenge } from "../utils/pkce";
import { FaGoogle, FaGithub, FaFacebook, FaLinkedin } from "react-icons/fa";

function saveState(obj) {
    const nonce = randomString(12);
    const stateObj = { nonce, ...obj };
    localStorage.setItem("oauth_state_" + nonce, JSON.stringify(stateObj));
    return btoa(JSON.stringify(stateObj));
}

export default function SocialLoginButtons({ className = "" }) {
    const redirectUri = encodeURIComponent(
        import.meta.env.VITE_OAUTH_REDIRECT_URI,
    );

    const openProvider = async (provider) => {
        const state = saveState({ provider });
        const code_verifier = randomString(64);
        const code_challenge = await generateCodeChallenge(code_verifier);
        const decoded = JSON.parse(atob(state));
        localStorage.setItem("pkce_" + decoded.nonce, code_verifier);

        let url = "";
        if (provider === "google") {
            const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
            const scope = encodeURIComponent("openid email profile");
            url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&code_challenge=${code_challenge}&code_challenge_method=S256&access_type=offline&prompt=select_account`;
        } else if (provider === "github") {
            const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
            const scope = encodeURIComponent("read:user user:email");
            url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&code_challenge=${code_challenge}&code_challenge_method=S256`;
        } else if (provider === "facebook") {
            const clientId = import.meta.env.VITE_FACEBOOK_CLIENT_ID;
            const scope = encodeURIComponent("email public_profile");
            url = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}&response_type=code`;
        } else if (provider === "linkedin") {
            const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
            const scope = encodeURIComponent("r_liteprofile r_emailaddress");
            url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&code_challenge=${code_challenge}&code_challenge_method=S256`;
        } else {
            alert("Unsupported provider");
            return;
        }

        window.location.href = url;
    };

    const providers = [
        {
            id: "google",
            label: "Google",
            color: "bg-red-500",
            icon: <FaGoogle />,
        },
        {
            id: "github",
            label: "GitHub",
            color: "bg-gray-800",
            icon: <FaGithub />,
        },
        {
            id: "facebook",
            label: "Facebook",
            color: "bg-blue-700",
            icon: <FaFacebook />,
        },
        {
            id: "linkedin",
            label: "LinkedIn",
            color: "bg-blue-500",
            icon: <FaLinkedin />,
        },
    ];

    return (
        <div className={className}>
            {providers.map((p) => (
                <button
                    key={p.id}
                    onClick={() => openProvider(p.id)}
                    className={`${p.color} flex items-center justify-center gap-2 text-white py-2 px-4 rounded-xl shadow-lg hover:opacity-90 transition mb-3`}
                >
                    {/* {p.icon} <span>Continue with {p.label}</span> */}
                    {p.icon}
                </button>
            ))}
        </div>
    );
}

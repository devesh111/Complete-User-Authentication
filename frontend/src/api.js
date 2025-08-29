const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function request(endpoint, options = {}) {
    const res = await fetch(API_URL + endpoint, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });
    if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Request failed");
    }
    return res.json();
}

export default {
    get: (url, opts) => request(url, { method: "GET", ...opts }),
    post: (url, body, opts) =>
        request(url, { method: "POST", body: JSON.stringify(body), ...opts }),
};

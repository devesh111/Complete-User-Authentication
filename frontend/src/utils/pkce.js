export function randomString(length = 64) {
    const charset =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-._~";
    let result = "";
    const values = new Uint8Array(length);
    crypto.getRandomValues(values);
    for (let i = 0; i < length; i++)
        result += charset[values[i] % charset.length];
    return result;
}

export async function generateCodeChallenge(code_verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(code_verifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    const base64 = btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    return base64;
}

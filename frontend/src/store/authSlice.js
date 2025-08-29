import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const refreshToken = createAsyncThunk("auth/refresh", async () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
    const res = await fetch(apiUrl + "/auth/token/refresh/", {
        method: "POST",
        credentials: "include",
    });
    if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Refresh failed");
    }
    const data = await res.json();
    return data.access;
});

export const loginUser = createAsyncThunk("auth/login", async (credentials) => {
    const res = await api.post("/auth/login/", credentials);
    return res;
});

export const registerUser = createAsyncThunk(
    "auth/register",
    async (payload) => {
        const res = await api.post("/auth/register/", payload);
        return res;
    },
);

export const logoutAsync = createAsyncThunk("auth/logout", async () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
    await fetch(apiUrl + "/auth/logout/", {
        method: "POST",
        credentials: "include",
    });
    return true;
});

export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
    const res = await fetch(apiUrl + "/auth/token/refresh/", {
        method: "POST",
        credentials: "include",
    });
    if (res.ok) {
        const data = await res.json();
        const userRes = await fetch(apiUrl + "/auth/me/", {
            method: "GET",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${data.access}`,
            },
        });
        const user = await userRes.json();
        console.log(user);
        return { access: data.access, user };
    } 
    else {
        throw new Error("Not authenticated");
    }
    // const res = await fetch("http://127.0.0.1:8000/api/auth/token/refresh/", {
    //     method: "POST",
    //     credentials: "include", // important for cookies
    // });

    // if (res.ok) {
    //     const data = await res.json();
    //     // fetch user profile
    //     const userRes = await fetch("http://127.0.0.1:8000/api/auth/me/", {
    //         credentials: "include",
    //         headers: {
    //             Authorization: `Bearer ${data.access}`,
    //         },
    //     });
    //     const user = await userRes.json();
    //     console.log(user);
    //     return { access: data.access, user };
    // } else {
    //     throw new Error("Not authenticated");
    // }
});


const initialState = { user: null, access: null, status: "idle", error: null };

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        access: null,
        status: "idle",
    },
    reducers: {
        setAccess: (state, action) => {
            state.access = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        clearAuth: (state) => {
            state.user = null;
            state.access = null;
        },
        logout: (state) => {
            state.user = null;
            state.access = null;
            fetch("http://127.0.0.1:8000/api/logout/", {
                method: "POST",
                credentials: "include",
            });
        },
    },
    extraReducers: (builder) => {
        builder.addCase(refreshToken.pending, (state) => {
            state.status = "loading";
        });
        builder.addCase(refreshToken.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.access = action.payload;
        });
        builder.addCase(refreshToken.rejected, (state, action) => {
            state.status = "failed";
            state.access = null;
            state.user = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            const res = action.payload;
            state.access = res.access;
            state.user = res.user;
        });
        builder.addCase(registerUser.fulfilled, (state, action) => {
            /* registration message handled in UI */
        });
        builder.addCase(logoutAsync.fulfilled, (state) => {
            state.user = null;
            state.access = null;
        });
        builder.addCase(checkAuth.fulfilled, (state, action) =>{
            state.user = action.payload.user;
            state.access = action.payload.access;
            state.status = "authenticated";
        }).addCase(checkAuth.rejected, (state) => {
            state.user = null;
            state.access = null;
            state.status = "unauthenticated";
        });

    },
});

export const { setAccess, setUser, clearAuth, logout } = authSlice.actions;
export default authSlice.reducer;

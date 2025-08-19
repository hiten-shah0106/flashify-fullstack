// src/context/AuthContext.js
"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { apiService } from "@/services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true); // ✅ NEW

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            setToken(savedToken);
            // ✅ Fetch user details so Navbar can show email immediately
            apiService.getUser(savedToken).then((res) => {
                if (res.user) setUser(res.user);
                setLoadingAuth(false);
            });
        } else {
            setLoadingAuth(false);
        }
    }, []);

    async function signup(email, password) {
        const res = await apiService.signup(email, password);
        console.log(res);
        return res;
    }

    async function login(email, password) {
        const res = await apiService.login(email, password);
        if (res.session?.access_token) {
            localStorage.setItem("token", res.session.access_token);
            setToken(res.session.access_token);
            setUser(res.user);
        }
        return res;
    }

    function logout() {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{ token, user, signup, login, logout, loadingAuth }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
    const { token } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            // No token? → Go to login
            router.replace("/login");
        } else {
            setLoading(false); // Token found → render children
        }
    }, [token, router]);

    if (loading) {
        // Optional loading state
        return <p className="text-center mt-20">Loading...</p>;
    }

    return children;
}

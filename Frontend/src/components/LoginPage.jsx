"use client"; // ✅ Needed for hooks (useState, useRouter, useAuth)
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // ✅ Use your Auth context
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
    const { login, token, loadingAuth } = useAuth(); // ✅ Get login function from AuthContext
    const router = useRouter();

    // ✅ Local state for controlled inputs and feedback
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!loadingAuth && token) {
            router.replace("/dashboard");
        }
    }, [token, loadingAuth, router]);

    // ✅ Submit handler that calls your Flask backend via AuthContext
    async function handleSubmit(e) {
        e.preventDefault();
        setMessage("");

        const res = await login(email, password); // calls /auth/login under the hood

        if (res?.session?.access_token) {
            // ✅ Logged in successfully; token persisted by AuthContext
            router.push("/dashboard"); // redirect to your dashboard
        } else {
            // ✅ Friendly error message
            const err =
                res?.error ||
                res?.message ||
                "Login failed. Please check your credentials or confirm your email.";
            setMessage(err);
        }
    }

    return (
        <section className="flex min-h-screen px-4 py-16 md:py-32 dark:bg-transparent">
            {/* ✅ Hooked up onSubmit; styles unchanged */}
            <form
                onSubmit={handleSubmit}
                className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]"
            >
                <div className="p-8 pb-6">
                    <div>
                        <Link href="/" aria-label="go home"></Link>
                        <h1 className="text-title mb-1 mt-4 text-xl font-semibold">
                            Sign in to Flashify
                        </h1>
                        <p className="text-sm">
                            Welcome Back! Sign in to continue
                        </p>
                    </div>

                    <hr className="my-4 border-dashed" />

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="block text-sm">
                                Email
                            </Label>
                            <Input
                                type="email"
                                required
                                name="email"
                                id="email"
                                // ✅ Controlled input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pwd" className="text-title text-sm">
                                Password
                            </Label>
                            <Input
                                type="password"
                                required
                                name="pwd"
                                id="pwd"
                                className="input sz-md variant-mixed"
                                // ✅ Controlled input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* ✅ Button triggers form submit */}
                        <Button type="submit" className="w-full">
                            Continue
                        </Button>

                        {/* ✅ Inline feedback (errors, etc.) */}
                        {message && (
                            <p className="text-sm text-center mt-2">
                                {message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="bg-muted rounded-(--radius) border p-3">
                    <p className="text-accent-foreground text-center text-sm">
                        Don't have an account?
                        <Button asChild variant="link" className="px-2">
                            <Link href="/signup">Sign Up</Link>
                        </Button>
                    </p>
                </div>
            </form>
        </section>
    );
}

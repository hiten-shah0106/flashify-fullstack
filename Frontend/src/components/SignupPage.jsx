"use client";
import { useState, useEffect } from "react"; // ✅ Added useEffect for redirect
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignupPage() {
    const { signup, token, loadingAuth } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!loadingAuth && token) {
            router.replace("/dashboard");
        }
    }, [token, loadingAuth, router]);

    if (loadingAuth) {
        return null; // prevent UI flash before auth state is known
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        const res = await signup(email, password);

        if (res.error) {
            setMessage(res.error || "Something went wrong.");
        } else {
            setMessage("Check your email for confirmation mail.");
            setTimeout(() => router.push("/login"), 3000);
        }
    }

    return (
        <section className="flex min-h-screen px-4 py-16 md:py-32 dark:bg-transparent">
            <form
                onSubmit={handleSubmit}
                className="bg-card m-auto h-fit w-full max-w-sm rounded-[calc(var(--radius)+.125rem)] border p-0.5 shadow-md dark:[--color-muted:var(--color-zinc-900)]"
            >
                <div className="p-8 pb-6">
                    <div>
                        <Link href="/" aria-label="go home"></Link>
                        <h1 className="text-title mb-1 mt-4 text-xl font-semibold">
                            Create a Flashify Account
                        </h1>
                        <p className="text-sm">
                            Welcome! Create an account to get started
                        </p>
                        <p className="text-sm">
                            You will receive a confirmation email after
                            registration.
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="confirm-pwd"
                                className="text-title text-sm"
                            >
                                Confirm Password
                            </Label>
                            <Input
                                type="password"
                                required
                                name="confirm-pwd"
                                id="confirm-pwd"
                                className="input sz-md variant-mixed"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Continue
                        </Button>

                        {message && (
                            <p className="text-sm text-center mt-2">
                                {message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="bg-muted rounded-(--radius) border p-3">
                    <p className="text-accent-foreground text-center text-sm">
                        Have an account ?
                        <Button asChild variant="link" className="px-2">
                            <Link href="/login">Sign In</Link>
                        </Button>
                    </p>
                </div>
            </form>
        </section>
    );
}

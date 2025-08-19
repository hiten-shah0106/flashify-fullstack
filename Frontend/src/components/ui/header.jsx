"use client";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Menu, MoveRight, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext"; // ✅ Import Auth Context

function Navbar() {
    const navigationItems = [
        {
            title: "Home",
            href: "/",
            description: "",
        },
        {
            title: "Dashboard",
            href: "/dashboard",
            description: "",
        },
    ];

    const [isOpen, setOpen] = useState(false);

    // ✅ Access token, user, and logout function
    const { token, user, logout, loadingAuth } = useAuth();

    if (loadingAuth) {
        return null; // or show a skeleton
    }

    return (
        <header className="w-full z-40 fixed top-0 left-0 bg-surface-0">
            <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center">
                {/* Left: Logo */}
                <Link href="/">
                    <div className="flex lg:justify-start">
                        <p className="font-bold text-2xl">Flashify</p>
                    </div>
                </Link>

                {/* Center: Navigation Items */}
                <div className="justify-center items-center gap-4 lg:flex hidden flex-row">
                    <NavigationMenu className="flex justify-start items-start">
                        <NavigationMenuList className="flex justify-start gap-4 flex-row">
                            {navigationItems.map((item) => (
                                <NavigationMenuItem key={item.title}>
                                    <NavigationMenuLink>
                                        <Link href={item.href}>
                                            <Button
                                                variant="ghost"
                                                className="text-lg cursor-pointer font-semibold"
                                            >
                                                {item.title}
                                            </Button>
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Right: Auth Buttons or User Info */}
                <div className="flex justify-end w-full gap-4">
                    <div className="border-r hidden md:inline"></div>

                    {token && user ? (
                        // ✅ If logged in, show email & Logout button
                        <>
                            <span className="hidden md:inline self-center text-sm font-medium">
                                {user.email}
                            </span>
                            <Button
                                variant="outline"
                                onClick={logout} // ✅ Call logout from context
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        // ✅ If not logged in, show Sign in & Get started
                        <>
                            <Link href="/login">
                                <Button variant="outline">Sign in</Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button>Get started</Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu */}
                <div className="flex w-12 shrink lg:hidden items-end justify-end mx-auto">
                    <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
                        {isOpen ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <Menu className="w-5 h-5" />
                        )}
                    </Button>
                    {isOpen && (
                        <div className="absolute top-20 border-t flex flex-col w-full right-0 bg-background shadow-lg py-4 container gap-8">
                            {navigationItems.map((item) => (
                                <div key={item.title}>
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            href={item.href}
                                            className="flex justify-between items-center"
                                        >
                                            <span className="text-lg">
                                                {item.title}
                                            </span>
                                            <MoveRight className="w-4 h-4 stroke-1 text-muted-foreground" />
                                        </Link>
                                    </div>
                                </div>
                            ))}

                            {/* ✅ Mobile view auth buttons */}
                            {token && user ? (
                                <>
                                    <span className="px-2 text-sm font-medium">
                                        {user.email}
                                    </span>
                                    <Button
                                        variant="outline"
                                        onClick={logout}
                                        className="mx-2"
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button
                                            variant="outline"
                                            className="mx-2"
                                        >
                                            Sign in
                                        </Button>
                                    </Link>
                                    <Link href="/signup">
                                        <Button className="mx-2">
                                            Get started
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export { Navbar };

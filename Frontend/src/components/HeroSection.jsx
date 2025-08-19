import { Scene } from "@/components/ui/hero-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

import { ShieldCheck, Layers, BookOpen, Smartphone } from "lucide-react";

const features = [
    {
        icon: Layers,
        title: "Smart Deck Management",
        description:
            "Create, edit, and organize decks for any subject in seconds.",
    },
    {
        icon: ShieldCheck,
        title: "Secure Cloud Sync",
        description:
            "All your flashcards are safely stored and accessible anytime.",
    },
    {
        icon: BookOpen,
        title: "Flexible Study Modes",
        description:
            "Quiz yourself, review cards, and boost your memory retention.",
    },
    {
        icon: Smartphone,
        title: "Cross-Device Access",
        description:
            "Learn on desktop, tablet, or mobile — your progress stays in sync.",
    },
];

const DemoOne = () => {
    return (
        <div className="min-h-svh w-screen bg-linear-to-br from-[#000] to-[#1A2428] text-white flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-6xl space-y-12 relative z-10">
                <div className="flex flex-col items-center text-center space-y-8">
                    <div className="space-y-6 flex items-center justify-center flex-col ">
                        <h1 className=" text-3xl mt-10 md:text-6xl font-semibold tracking-tight max-w-3xl">
                            Master Any Topic with Flashify
                        </h1>
                        <p className="text-lg text-neutral-300 max-w-2xl">
                            Organize your learning with decks, track your
                            progress, and access your study material from
                            anywhere — powered by speed, security, and
                            simplicity.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <Link href="/dashboard">
                                <Button className="text-sm px-8 py-3 rounded-xl bg-white text-black border border-white/10 shadow-none hover:bg-white/90 transition-none">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 h-40 md:h-48 flex flex-col justify-start items-start space-y-2 md:space-y-3"
                        >
                            <feature.icon
                                size={18}
                                className="text-white/80 md:w-5 md:h-5"
                            />
                            <h3 className="text-sm md:text-base font-medium">
                                {feature.title}
                            </h3>
                            <p className="text-xs md:text-sm text-neutral-400">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="absolute inset-0">
                <Scene />
            </div>
        </div>
    );
};

export { DemoOne };

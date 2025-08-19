"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiService } from "@/services/api";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function StudyPage() {
    const { deckId } = useParams();
    const router = useRouter();
    const { token } = useAuth();

    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [sessionEnded, setSessionEnded] = useState(false);

    useEffect(() => {
        async function fetchCards() {
            const res = await apiService.getCards(token, deckId);
            setCards(res || []);
            setLoading(false);
        }
        fetchCards();
    }, [token, deckId]);

    const handleFlip = () => setShowAnswer((prev) => !prev);

    const handleNext = useCallback(() => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setShowAnswer(false);
        } else {
            setSessionEnded(true); // Auto-end on last card
        }
    }, [currentIndex, cards.length]);

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
            setShowAnswer(false);
        }
    };

    const handleAnswer = (isCorrect) => {
        if (isCorrect) setCorrectCount((c) => c + 1);
        else setIncorrectCount((c) => c + 1);
        handleNext();
    };

    const handleEndSession = () => setSessionEnded(true);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === "Space") {
                e.preventDefault();
                handleFlip();
            } else if (e.code === "ArrowRight") {
                handleNext();
            } else if (e.code === "ArrowLeft") {
                handlePrev();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleNext]);

    if (loading)
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <p className="text-center">Loading...</p>
            </div>
        );

    if (cards.length === 0)
        return <p className="text-center mt-10">No cards to study.</p>;

    if (sessionEnded) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">Study Session Ended</h1>
                <p className="mb-2">✅ Correct: {correctCount}</p>
                <p className="mb-6">❌ Incorrect: {incorrectCount}</p>
                <Button onClick={() => router.push("/dashboard")}>
                    Back to Dashboard
                </Button>
            </div>
        );
    }

    const currentCard = cards[currentIndex];

    return (
        <ProtectedRoute>
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <h1 className="text-2xl font-bold mb-6">Study Mode</h1>

                {/* Flip Card */}
                <div
                    className={`relative w-80 h-48 perspective`}
                    onClick={handleFlip}
                >
                    <div
                        className={`absolute w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
                            showAnswer ? "rotate-y-180" : ""
                        }`}
                    >
                        {/* Front */}
                        <div className="absolute w-full h-full bg-card border p-6 rounded-xl shadow-md flex items-center justify-center backface-hidden">
                            <p className="text-lg font-medium">
                                {currentCard.question}
                            </p>
                        </div>
                        {/* Back */}
                        <div className="absolute w-full h-full bg-card border p-6 rounded-xl shadow-md flex items-center justify-center rotate-y-180 backface-hidden">
                            <p className="text-lg font-medium">
                                {currentCard.answer}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-4 mt-6">
                    {!showAnswer ? (
                        <Button onClick={handleFlip}>Show Answer</Button>
                    ) : (
                        <>
                            <Button
                                className="bg-secondary/60"
                                variant="success"
                                onClick={() => handleAnswer(true)}
                            >
                                Correct
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => handleAnswer(false)}
                            >
                                Incorrect
                            </Button>
                        </>
                    )}
                    <Button variant="outline" onClick={handlePrev}>
                        Previous
                    </Button>
                    <Button variant="outline" onClick={handleNext}>
                        Next
                    </Button>
                </div>

                {/* Progress & End Session */}
                <div className="mt-4 flex flex-col items-center">
                    <p className="text-sm text-muted-foreground">
                        Card {currentIndex + 1} of {cards.length}
                    </p>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="mt-2"
                        onClick={handleEndSession}
                    >
                        End Session
                    </Button>
                </div>
            </div>
        </ProtectedRoute>
    );
}

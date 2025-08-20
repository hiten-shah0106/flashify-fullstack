"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { apiService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const { token, user } = useAuth();
    const [decks, setDecks] = useState([]);
    const [newDeckName, setNewDeckName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            apiService.getDecks(token).then((data) => {
                setDecks(data || []);
                setLoading(false);
            });
        }
    }, [token]);

    const handleCreateDeck = async () => {
        if (!newDeckName.trim()) return;
        const res = await apiService.createDeck(token, newDeckName);
        if (!res.error) {
            setDecks((prev) => [...prev, ...res]);
            setNewDeckName("");
        }
    };

    const handleDeleteDeck = async (deckId) => {
        const res = await apiService.deleteDeck(token, deckId);
        if (!res.error) {
            setDecks((prev) => prev.filter((deck) => deck.id !== deckId));
        }
    };

    return (
        <ProtectedRoute>
            <section className="container mx-auto mt-20 px-4 py-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Welcome, {user?.email || "User"} 👋
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your decks and start studying
                        </p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Input
                            placeholder="New deck name..."
                            value={newDeckName}
                            onChange={(e) => setNewDeckName(e.target.value)}
                            className="flex-1"
                        />
                        <Button onClick={handleCreateDeck}>
                            <PlusCircle className="w-4 h-4 mr-1" /> Add
                        </Button>
                    </div>
                </div>

                {loading && (
                    <p className="text-center text-muted-foreground">
                        Loading...
                    </p>
                )}

                {!loading && decks.length === 0 && (
                    <p className="text-center text-muted-foreground">
                        No decks yet. Create one above!
                    </p>
                )}

                {!loading && decks.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {decks.map((deck) => (
                            <Card
                                key={deck.id}
                                className="flex flex-col justify-between"
                            >
                                <CardHeader>
                                    <CardTitle>{deck.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex justify-between items-center">
                                    <Button
                                        asChild
                                        variant="secondary"
                                        size="sm"
                                    >
                                        <Link href={`/decks/${deck.id}`}>
                                            View
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        className="cursor-pointer"
                                        size="icon"
                                        onClick={() =>
                                            handleDeleteDeck(deck.id)
                                        }
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline">
                                        <Link href={`/study/${deck.id}`}>
                                            Study
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </section>
        </ProtectedRoute>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiService } from "@/services/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Edit } from "lucide-react";

export default function DeckDetailsPage() {
    const { deckId } = useParams();
    const { token } = useAuth();

    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editCard, setEditCard] = useState(null);

    // Form States
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const [deckName, setDeckName] = useState("");

    useEffect(() => {
        async function loadData() {
            const deckData = await apiService.getDeckById(token, deckId);
            setDeckName(deckData.name);
            const cardsData = await apiService.getCards(token, deckId);
            setCards(cardsData);
            setLoading(false);
        }
        loadData();
    }, [deckId, token]);

    // Handle Add Card
    const handleAddCard = async () => {
        const res = await apiService.createCard(
            token,
            deckId,
            question,
            answer
        );
        setCards([...cards, ...res]);
        setIsAddOpen(false);
        setQuestion("");
        setAnswer("");
    };

    // Handle Edit Card
    const handleEditCard = async () => {
        const res = await fetch(
            `${
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
            }/cards/${editCard.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ question, answer }),
            }
        );
        const updated = await res.json();
        setCards(cards.map((c) => (c.id === editCard.id ? updated[0] : c)));
        setIsEditOpen(false);
        setEditCard(null);
        setQuestion("");
        setAnswer("");
    };

    // Handle Delete Card
    const handleDeleteCard = async (id) => {
        await apiService.deleteCard(token, id);
        setCards(cards.filter((c) => c.id !== id));
    };

    // Open edit modal with data
    const openEditModal = (card) => {
        setEditCard(card);
        setQuestion(card.question);
        setAnswer(card.answer);
        setIsEditOpen(true);
    };

    return (
        <ProtectedRoute>
            <section className="container mx-auto py-24">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <h1 className="text-2xl font-bold break-all">
                        Deck: {deckName}
                    </h1>

                    {/* Add Card Button */}
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto">
                                Add Card
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Card</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label>Question</Label>
                                    <Input
                                        value={question}
                                        onChange={(e) =>
                                            setQuestion(e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>Answer</Label>
                                    <Textarea
                                        value={answer}
                                        onChange={(e) =>
                                            setAnswer(e.target.value)
                                        }
                                    />
                                </div>
                                <Button
                                    onClick={handleAddCard}
                                    className="w-full"
                                >
                                    Save
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {loading ? (
                    <p>Loading cards...</p>
                ) : cards.length === 0 ? (
                    <p className="text-muted-foreground">No cards yet.</p>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {cards.map((card) => (
                            <Card
                                key={card.id}
                                className="flex flex-col justify-between"
                            >
                                <CardHeader>
                                    <CardTitle>{card.question}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm mb-4">
                                        {card.answer}
                                    </p>
                                    <div className="flex justify-between">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openEditModal(card)}
                                        >
                                            <Edit className="w-4 h-4 mr-1" />{" "}
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                handleDeleteCard(card.id)
                                            }
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />{" "}
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Edit Card Modal */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Card</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Question</Label>
                                <Input
                                    value={question}
                                    onChange={(e) =>
                                        setQuestion(e.target.value)
                                    }
                                />
                            </div>
                            <div>
                                <Label>Answer</Label>
                                <Textarea
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleEditCard} className="w-full">
                                Update
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </section>
        </ProtectedRoute>
    );
}

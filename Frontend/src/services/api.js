const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const apiService = {
    login: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        return response.json();
    },

    signup: async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        return response.json();
    },

    getDecks: async (token) => {
        const response = await fetch(`${API_BASE_URL}/decks/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json();
    },

    getDeckById: async (token, deckId) => {
        const response = await fetch(`${API_BASE_URL}/decks/${deckId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json();
    },

    createDeck: async (token, name) => {
        const response = await fetch(`${API_BASE_URL}/decks/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name }),
        });
        return response.json();
    },

    deleteDeck: async (token, deckId) => {
        const response = await fetch(`${API_BASE_URL}/decks/${deckId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json();
    },

    getCards: async (token, deckId) => {
        const response = await fetch(`${API_BASE_URL}/cards/${deckId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json();
    },

    createCard: async (token, deckId, question, answer) => {
        const response = await fetch(`${API_BASE_URL}/cards/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ deck_id: deckId, question, answer }),
        });
        return response.json();
    },

    deleteCard: async (token, cardId) => {
        const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json();
    },

    getUser: async (token) => {
        const response = await fetch(`${API_BASE_URL}/auth/user`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json();
    },
};

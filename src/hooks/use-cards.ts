import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

export interface FlashCard {
  id: string;
  front: string;
  back: string;
  difficulty: "easy" | "medium" | "hard";
  reviewCount: number;
  lastReviewed: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deckId: string;
}

interface UseCardsReturn {
  cards: FlashCard[];
  loading: boolean;
  error: string | null;
  createCard: (deckId: string, front: string, back: string, difficulty?: "easy" | "medium" | "hard") => Promise<FlashCard | null>;
  updateCard: (deckId: string, cardId: string, front: string, back: string, difficulty?: "easy" | "medium" | "hard") => Promise<FlashCard | null>;
  deleteCard: (deckId: string, cardId: string) => Promise<boolean>;
  refreshCards: (deckId: string) => Promise<void>;
}

export function useCards(deckId?: string): UseCardsReturn {
  const { data: session } = useSession();
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = useCallback(async (targetDeckId: string) => {
    if (!session?.user || !targetDeckId) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/decks/${targetDeckId}/cards`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch cards");
      }
      
      const data = await response.json();
      setCards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cards");
    } finally {
      setLoading(false);
    }
  }, [session?.user]);

  const createCard = useCallback(async (
    targetDeckId: string, 
    front: string, 
    back: string, 
    difficulty: "easy" | "medium" | "hard" = "medium"
  ): Promise<FlashCard | null> => {
    if (!session?.user) return null;

    try {
      setError(null);
      
      const response = await fetch(`/api/decks/${targetDeckId}/cards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ front, back, difficulty }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create card");
      }
      
      const newCard = await response.json();
      setCards(prev => [newCard, ...prev]);
      return newCard;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create card");
      return null;
    }
  }, [session?.user]);

  const updateCard = useCallback(async (
    targetDeckId: string,
    cardId: string, 
    front: string, 
    back: string, 
    difficulty: "easy" | "medium" | "hard" = "medium"
  ): Promise<FlashCard | null> => {
    if (!session?.user) return null;

    try {
      setError(null);
      
      const response = await fetch(`/api/decks/${targetDeckId}/cards/${cardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ front, back, difficulty }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update card");
      }
      
      const updatedCard = await response.json();
      setCards(prev => prev.map(card => card.id === cardId ? updatedCard : card));
      return updatedCard;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update card");
      return null;
    }
  }, [session?.user]);

  const deleteCard = useCallback(async (targetDeckId: string, cardId: string): Promise<boolean> => {
    if (!session?.user) return false;

    try {
      setError(null);
      
      const response = await fetch(`/api/decks/${targetDeckId}/cards/${cardId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete card");
      }
      
      setCards(prev => prev.filter(card => card.id !== cardId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete card");
      return false;
    }
  }, [session?.user]);

  const refreshCards = useCallback(async (targetDeckId: string) => {
    await fetchCards(targetDeckId);
  }, [fetchCards]);

  useEffect(() => {
    if (session?.user && deckId) {
      fetchCards(deckId);
    } else {
      setCards([]);
      setLoading(false);
    }
  }, [session?.user, deckId, fetchCards]);

  return {
    cards,
    loading,
    error,
    createCard,
    updateCard,
    deleteCard,
    refreshCards,
  };
} 
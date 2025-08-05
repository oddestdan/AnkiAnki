import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

export interface Deck {
  id: string;
  name: string;
  description: string | null;
  cardCount: number;
  lastStudied: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface UseDecksReturn {
  decks: Deck[];
  loading: boolean;
  error: string | null;
  createDeck: (name: string, description?: string) => Promise<Deck | null>;
  updateDeck: (id: string, name: string, description?: string) => Promise<Deck | null>;
  deleteDeck: (id: string) => Promise<boolean>;
  refreshDecks: () => Promise<void>;
}

export function useDecks(): UseDecksReturn {
  const { data: session } = useSession();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDecks = useCallback(async () => {
    if (!session?.user) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/decks");
      
      if (!response.ok) {
        throw new Error("Failed to fetch decks");
      }
      
      const data = await response.json();
      setDecks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch decks");
    } finally {
      setLoading(false);
    }
  }, [session?.user]);

  const createDeck = useCallback(async (name: string, description?: string): Promise<Deck | null> => {
    if (!session?.user) return null;

    try {
      setError(null);
      
      const response = await fetch("/api/decks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create deck");
      }
      
      const newDeck = await response.json();
      setDecks(prev => [newDeck, ...prev]);
      return newDeck;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create deck");
      return null;
    }
  }, [session?.user]);

  const updateDeck = useCallback(async (id: string, name: string, description?: string): Promise<Deck | null> => {
    if (!session?.user) return null;

    try {
      setError(null);
      
      const response = await fetch(`/api/decks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update deck");
      }
      
      const updatedDeck = await response.json();
      setDecks(prev => prev.map(deck => deck.id === id ? updatedDeck : deck));
      return updatedDeck;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update deck");
      return null;
    }
  }, [session?.user]);

  const deleteDeck = useCallback(async (id: string): Promise<boolean> => {
    if (!session?.user) return false;

    try {
      setError(null);
      
      const response = await fetch(`/api/decks/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete deck");
      }
      
      setDecks(prev => prev.filter(deck => deck.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete deck");
      return false;
    }
  }, [session?.user]);

  const refreshDecks = useCallback(async () => {
    await fetchDecks();
  }, [fetchDecks]);

  useEffect(() => {
    if (session?.user) {
      fetchDecks();
    } else {
      setDecks([]);
      setLoading(false);
    }
  }, [session?.user, fetchDecks]);

  return {
    decks,
    loading,
    error,
    createDeck,
    updateDeck,
    deleteDeck,
    refreshDecks,
  };
} 
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface FlashCard {
  id: string;
  front: string;
  back: string;
  difficulty: "easy" | "medium" | "hard";
  lastReviewed?: Date;
  reviewCount: number;
}

interface AppContextType {
  selectedDeck: string | null;
  setSelectedDeck: (deckId: string | null) => void;
  currentCardIndex: number;
  setCurrentCardIndex: (index: number) => void;
  isStudying: boolean;
  setIsStudying: (studying: boolean) => void;
  context: "deck" | "card" | "study";
  setContext: (context: "deck" | "card" | "study") => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isStudying, setIsStudying] = useState(false);
  const [context, setContext] = useState<"deck" | "card" | "study">("deck");

  const value: AppContextType = {
    selectedDeck,
    setSelectedDeck,
    currentCardIndex,
    setCurrentCardIndex,
    isStudying,
    setIsStudying,
    context,
    setContext,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
} 
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Deck {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  lastStudied?: Date;
}

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
  decks: Deck[];
  setDecks: (decks: Deck[]) => void;
  cards: FlashCard[];
  setCards: (cards: FlashCard[]) => void;
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
  const [decks, setDecks] = useState<Deck[]>([
    {
      id: "1",
      name: "JavaScript Fundamentals",
      description: "Core concepts of JavaScript programming",
      cardCount: 25,
      lastStudied: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "React Hooks",
      description: "Understanding React hooks and their usage",
      cardCount: 18,
      lastStudied: new Date("2024-01-10"),
    },
    {
      id: "3",
      name: "TypeScript Basics",
      description: "Introduction to TypeScript features",
      cardCount: 32,
    },
  ]);

  const [cards, setCards] = useState<FlashCard[]>([
    {
      id: "1",
      front: "What is a closure in JavaScript?",
      back: "A closure is a function that has access to variables in its outer scope even after the outer function has returned.",
      difficulty: "medium",
      reviewCount: 3,
    },
    {
      id: "2",
      front: "What is the difference between let, const, and var?",
      back: "let and const are block-scoped, var is function-scoped. const cannot be reassigned, let can be reassigned, var can be redeclared.",
      difficulty: "easy",
      reviewCount: 5,
    },
    {
      id: "3",
      front: "What is the event loop in JavaScript?",
      back: "The event loop is a mechanism that allows JavaScript to perform non-blocking operations by offloading operations to the system kernel whenever possible.",
      difficulty: "hard",
      reviewCount: 1,
    },
  ]);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isStudying, setIsStudying] = useState(false);
  const [context, setContext] = useState<"deck" | "card" | "study">("deck");

  const value: AppContextType = {
    selectedDeck,
    setSelectedDeck,
    decks,
    setDecks,
    cards,
    setCards,
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
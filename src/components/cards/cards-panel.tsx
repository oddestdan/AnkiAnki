"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, RotateCcw, Eye, EyeOff, Check, X, ArrowLeft, ArrowRight } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";

export function CardsPanel() {
  const { 
    selectedDeck, 
    decks, 
    cards, 
    setCards, 
    currentCardIndex, 
    setCurrentCardIndex, 
    isStudying, 
    setIsStudying,
    setContext 
  } = useApp();

  const [isFlipped, setIsFlipped] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardFront, setNewCardFront] = useState("");
  const [newCardBack, setNewCardBack] = useState("");

  const selectedDeckData = decks.find(deck => deck.id === selectedDeck);
  const currentCard = cards[currentCardIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleStartStudy = () => {
    setIsStudying(true);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setContext("study");
  };

  const handleStopStudy = () => {
    setIsStudying(false);
    setIsFlipped(false);
    setContext("deck");
  };

  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleDifficultyRating = (difficulty: "easy" | "medium" | "hard") => {
    // Update card difficulty and move to next card
    setCards(cards.map((card, index) => 
      index === currentCardIndex 
        ? { ...card, difficulty, reviewCount: card.reviewCount + 1, lastReviewed: new Date() }
        : card
    ));
    
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      // Study session complete
      setIsStudying(false);
      setContext("deck");
    }
  };

  const handleAddCard = () => {
    if (newCardFront.trim() && newCardBack.trim()) {
      const newCard = {
        id: Date.now().toString(),
        front: newCardFront,
        back: newCardBack,
        difficulty: "medium" as const,
        reviewCount: 0,
      };
      setCards([...cards, newCard]);
      setNewCardFront("");
      setNewCardBack("");
      setIsAddingCard(false);
    }
  };

  if (!selectedDeck) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p className="text-lg mb-2">No deck selected</p>
          <p>Select a deck from the left panel to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{selectedDeckData?.name}</h1>
            <p className="text-muted-foreground">{cards.length} cards</p>
          </div>
          <div className="flex gap-2">
            {!isStudying ? (
              <>
                <Button onClick={handleStartStudy}>
                  Start Study Session
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddingCard(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Card
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={handleStopStudy}>
                Stop Study Session
              </Button>
            )}
          </div>
        </div>

        {/* Add Card Form */}
        {isAddingCard && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="card-front">Front</Label>
                  <Input
                    id="card-front"
                    value={newCardFront}
                    onChange={(e) => setNewCardFront(e.target.value)}
                    placeholder="Enter card front"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="card-back">Back</Label>
                  <Input
                    id="card-back"
                    value={newCardBack}
                    onChange={(e) => setNewCardBack(e.target.value)}
                    placeholder="Enter card back"
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddCard}>
                    Add Card
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsAddingCard(false);
                      setNewCardFront("");
                      setNewCardBack("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        {cards.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <p className="text-lg mb-2">No cards in this deck</p>
            <p>Add some cards to get started</p>
          </div>
        ) : (
          <div className="w-full max-w-2xl">
            {/* Card Display */}
            <Card className="mb-6">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="mb-4 text-sm text-muted-foreground">
                    Card {currentCardIndex + 1} of {cards.length}
                  </div>
                  <div className="min-h-[200px] flex items-center justify-center">
                    <p className="text-lg leading-relaxed">
                      {isFlipped ? currentCard.back : currentCard.front}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleFlip}
                    className="mt-4"
                  >
                    {isFlipped ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    {isFlipped ? "Show Front" : "Show Answer"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Navigation and Study Controls */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevCard}
                disabled={currentCardIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {isStudying && isFlipped && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDifficultyRating("hard")}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Hard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDifficultyRating("medium")}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Medium
                  </Button>
                  <Button
                    variant="outline"
                    className="text-green-600 hover:text-green-700"
                    onClick={() => handleDifficultyRating("easy")}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Easy
                  </Button>
                </div>
              )}

              <Button
                variant="outline"
                onClick={handleNextCard}
                disabled={currentCardIndex === cards.length - 1}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* Card Info */}
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <span>Difficulty: {currentCard.difficulty}</span>
              <span className="mx-2">•</span>
              <span>Reviewed {currentCard.reviewCount} times</span>
              {currentCard.lastReviewed && (
                <>
                  <span className="mx-2">•</span>
                  <span>Last: {currentCard.lastReviewed.toLocaleDateString()}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
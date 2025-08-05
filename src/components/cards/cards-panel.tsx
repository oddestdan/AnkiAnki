"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, RotateCcw, Eye, EyeOff, Check, X, ArrowLeft, ArrowRight, Loader2, Edit, Trash2 } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { useCards, FlashCard } from "@/hooks/use-cards";

export function CardsPanel() {
  const { 
    selectedDeck, 
    currentCardIndex, 
    setCurrentCardIndex, 
    isStudying, 
    setIsStudying,
    setContext 
  } = useApp();

  const { 
    cards, 
    loading, 
    error, 
    createCard, 
    updateCard, 
    deleteCard 
  } = useCards(selectedDeck || undefined);

  const [isFlipped, setIsFlipped] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [newCardFront, setNewCardFront] = useState("");
  const [newCardBack, setNewCardBack] = useState("");
  const [newCardDifficulty, setNewCardDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (currentCard && selectedDeck) {
      updateCard(selectedDeck, currentCard.id, currentCard.front, currentCard.back, difficulty);
    }
    
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      // Study session complete
      setIsStudying(false);
      setContext("deck");
    }
  };

  const handleAddCard = async () => {
    if (newCardFront.trim() && newCardBack.trim() && selectedDeck && !isSubmitting) {
      setIsSubmitting(true);
      const success = await createCard(selectedDeck, newCardFront, newCardBack, newCardDifficulty);
      if (success) {
        setNewCardFront("");
        setNewCardBack("");
        setNewCardDifficulty("medium");
        setIsAddingCard(false);
      }
      setIsSubmitting(false);
    }
  };

  const handleEditCard = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (card) {
      setNewCardFront(card.front);
      setNewCardBack(card.back);
      setNewCardDifficulty(card.difficulty);
      setEditingCard(cardId);
    }
  };

  const handleSaveEdit = async () => {
    if (editingCard && newCardFront.trim() && newCardBack.trim() && selectedDeck && !isSubmitting) {
      setIsSubmitting(true);
      const success = await updateCard(selectedDeck, editingCard, newCardFront, newCardBack, newCardDifficulty);
      if (success) {
        setNewCardFront("");
        setNewCardBack("");
        setNewCardDifficulty("medium");
        setEditingCard(null);
      }
      setIsSubmitting(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (selectedDeck && !isSubmitting) {
      setIsSubmitting(true);
      await deleteCard(selectedDeck, cardId);
      setIsSubmitting(false);
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
            <h1 className="text-2xl font-bold">Selected Deck</h1>
            <p className="text-muted-foreground">{cards.length} cards</p>
          </div>
          <div className="flex gap-2">
            {!isStudying ? (
              <>
                <Button onClick={handleStartStudy} disabled={loading || cards.length === 0}>
                  Start Study Session
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddingCard(true)}
                  disabled={loading}
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

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Add/Edit Card Form */}
        {(isAddingCard || editingCard) && (
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="card-difficulty">Difficulty</Label>
                  <select
                    id="card-difficulty"
                    value={newCardDifficulty}
                    onChange={(e) => setNewCardDifficulty(e.target.value as "easy" | "medium" | "hard")}
                    className="w-full p-2 border rounded mt-1"
                    disabled={isSubmitting}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={isAddingCard ? handleAddCard : handleSaveEdit}
                    disabled={isSubmitting || !newCardFront.trim() || !newCardBack.trim()}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      isAddingCard ? "Add Card" : "Save Changes"
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsAddingCard(false);
                      setEditingCard(null);
                      setNewCardFront("");
                      setNewCardBack("");
                      setNewCardDifficulty("medium");
                    }}
                    disabled={isSubmitting}
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
        {loading ? (
          <div className="text-center text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading cards...</p>
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center text-muted-foreground">
            <p className="text-lg mb-2">No cards in this deck</p>
            <p>Add some cards to get started</p>
          </div>
        ) : (
          <div className="w-full max-w-2xl">
            {/* Card Display */}
            <Card className="mb-6 relative group">
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
                  <div className="flex justify-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={handleFlip}
                    >
                      {isFlipped ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      {isFlipped ? "Show Front" : "Show Answer"}
                    </Button>
                    {!isStudying && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditCard(currentCard.id)}
                          disabled={isSubmitting}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteCard(currentCard.id)}
                          disabled={isSubmitting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
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
                  <span>Last: {new Date(currentCard.lastReviewed).toLocaleDateString()}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
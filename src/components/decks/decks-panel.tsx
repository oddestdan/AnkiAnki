"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";

export function DecksPanel() {
  const { 
    decks, 
    setDecks, 
    selectedDeck, 
    setSelectedDeck,
    setContext 
  } = useApp();

  const [isAddingDeck, setIsAddingDeck] = useState(false);
  const [editingDeck, setEditingDeck] = useState<string | null>(null);
  const [newDeckName, setNewDeckName] = useState("");
  const [newDeckDescription, setNewDeckDescription] = useState("");

  const handleAddDeck = () => {
    if (newDeckName.trim()) {
      const newDeck = {
        id: Date.now().toString(),
        name: newDeckName,
        description: newDeckDescription,
        cardCount: 0,
      };
      setDecks([...decks, newDeck]);
      setNewDeckName("");
      setNewDeckDescription("");
      setIsAddingDeck(false);
    }
  };

  const handleEditDeck = (deckId: string) => {
    const deck = decks.find(d => d.id === deckId);
    if (deck) {
      setNewDeckName(deck.name);
      setNewDeckDescription(deck.description);
      setEditingDeck(deckId);
    }
  };

  const handleSaveEdit = () => {
    if (editingDeck && newDeckName.trim()) {
      setDecks(decks.map(deck => 
        deck.id === editingDeck 
          ? { ...deck, name: newDeckName, description: newDeckDescription }
          : deck
      ));
      setNewDeckName("");
      setNewDeckDescription("");
      setEditingDeck(null);
    }
  };

  const handleDeleteDeck = (deckId: string) => {
    setDecks(decks.filter(deck => deck.id !== deckId));
    if (selectedDeck === deckId) {
      setSelectedDeck(null);
    }
  };

  const handleSelectDeck = (deckId: string) => {
    setSelectedDeck(deckId);
    setContext("deck");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-sidebar-foreground">Decks</h2>
          <Button
            size="sm"
            onClick={() => setIsAddingDeck(true)}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Add/Edit Deck Form */}
        {(isAddingDeck || editingDeck) && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="deck-name">Name</Label>
                  <Input
                    id="deck-name"
                    value={newDeckName}
                    onChange={(e) => setNewDeckName(e.target.value)}
                    placeholder="Enter deck name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="deck-description">Description</Label>
                  <Input
                    id="deck-description"
                    value={newDeckDescription}
                    onChange={(e) => setNewDeckDescription(e.target.value)}
                    placeholder="Enter deck description"
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={isAddingDeck ? handleAddDeck : handleSaveEdit}
                  >
                    {isAddingDeck ? "Add Deck" : "Save Changes"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsAddingDeck(false);
                      setEditingDeck(null);
                      setNewDeckName("");
                      setNewDeckDescription("");
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

      {/* Decks List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {decks.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No decks yet</p>
            <p className="text-sm">Create your first deck to get started</p>
          </div>
        ) : (
          decks.map((deck) => (
            <Card
              key={deck.id}
              className={`cursor-pointer transition-colors hover:bg-sidebar-accent group ${
                selectedDeck === deck.id ? "bg-sidebar-accent border-sidebar-ring" : ""
              }`}
              onClick={() => handleSelectDeck(deck.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-sidebar-foreground mb-1">
                      {deck.name}
                    </h3>
                    <p className="text-sm text-sidebar-accent-foreground mb-2">
                      {deck.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-sidebar-accent-foreground">
                      <span>{deck.cardCount} cards</span>
                      {deck.lastStudied && (
                        <span>
                          Last studied: {deck.lastStudied.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditDeck(deck.id);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDeck(deck.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 
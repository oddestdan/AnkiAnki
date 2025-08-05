"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, BookOpen, Loader2 } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { useDecks } from "@/hooks/use-decks";

export function DecksPanel() {
  const { 
    selectedDeck, 
    setSelectedDeck,
    setContext 
  } = useApp();

  const { 
    decks, 
    loading, 
    error, 
    createDeck, 
    updateDeck, 
    deleteDeck 
  } = useDecks();

  const [isAddingDeck, setIsAddingDeck] = useState(false);
  const [editingDeck, setEditingDeck] = useState<string | null>(null);
  const [newDeckName, setNewDeckName] = useState("");
  const [newDeckDescription, setNewDeckDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddDeck = async () => {
    if (newDeckName.trim() && !isSubmitting) {
      setIsSubmitting(true);
      const success = await createDeck(newDeckName, newDeckDescription);
      if (success) {
        setNewDeckName("");
        setNewDeckDescription("");
        setIsAddingDeck(false);
      }
      setIsSubmitting(false);
    }
  };

  const handleEditDeck = (deckId: string) => {
    const deck = decks.find(d => d.id === deckId);
    if (deck) {
      setNewDeckName(deck.name);
      setNewDeckDescription(deck.description || "");
      setEditingDeck(deckId);
    }
  };

  const handleSaveEdit = async () => {
    if (editingDeck && newDeckName.trim() && !isSubmitting) {
      setIsSubmitting(true);
      const success = await updateDeck(editingDeck, newDeckName, newDeckDescription);
      if (success) {
        setNewDeckName("");
        setNewDeckDescription("");
        setEditingDeck(null);
      }
      setIsSubmitting(false);
    }
  };

  const handleDeleteDeck = async (deckId: string) => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      const success = await deleteDeck(deckId);
      if (success && selectedDeck === deckId) {
        setSelectedDeck(null);
      }
      setIsSubmitting(false);
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
            disabled={loading}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
        
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={isAddingDeck ? handleAddDeck : handleSaveEdit}
                    disabled={isSubmitting || !newDeckName.trim()}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      isAddingDeck ? "Add Deck" : "Save Changes"
                    )}
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

      {/* Decks List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="text-center text-muted-foreground py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading decks...</p>
          </div>
        ) : decks.length === 0 ? (
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
                      {deck.description || "No description"}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-sidebar-accent-foreground">
                      <span>{deck.cardCount} cards</span>
                      {deck.lastStudied && (
                        <span>
                          Last studied: {new Date(deck.lastStudied).toLocaleDateString()}
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
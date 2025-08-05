"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  HelpCircle, 
  MessageSquare, 
  Settings, 
  BookOpen, 
  Lightbulb, 
  Send,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";

export function ActionsPanel() {
  const { context, selectedDeck, currentCardIndex } = useApp();
  const [activeTab, setActiveTab] = useState("help");
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", message: "Hello! I'm here to help you with your flashcards. How can I assist you today?" }
  ]);

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = { role: "user" as const, message: chatMessage };
      setChatHistory([...chatHistory, newMessage]);
      setChatMessage("");
      
      // Simulate AI response
      setTimeout(() => {
        const responses = [
          "That's a great question! Let me help you with that.",
          "I understand what you're asking. Here's what I can tell you...",
          "Based on your question, I'd recommend focusing on...",
          "That's an interesting point. Here's some additional context...",
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        setChatHistory(prev => [...prev, { role: "assistant", message: randomResponse }]);
      }, 1000);
    }
  };

  const renderHelpContent = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-4 w-4 mt-0.5 text-yellow-500" />
            <div>
              <p className="font-medium text-sm">Spaced Repetition</p>
              <p className="text-xs text-muted-foreground">
                Cards you find difficult will appear more frequently in your study sessions.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Lightbulb className="h-4 w-4 mt-0.5 text-yellow-500" />
            <div>
              <p className="font-medium text-sm">Active Recall</p>
              <p className="text-xs text-muted-foreground">
                Try to recall the answer before flipping the card for better retention.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Lightbulb className="h-4 w-4 mt-0.5 text-yellow-500" />
            <div>
              <p className="font-medium text-sm">Consistent Study</p>
              <p className="text-xs text-muted-foreground">
                Study a little each day rather than cramming for better long-term retention.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Tutorials
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Getting Started with AnkiAnki
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Creating Effective Flashcards
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Study Techniques & Best Practices
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Advanced Features Guide
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderChatContent = () => (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p className="text-sm">{message.message}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Ask me anything..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button size="sm" onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderPropertiesContent = () => (
    <div className="space-y-4">
      {context === "deck" && selectedDeck && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Deck Properties
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="deck-name">Name</Label>
              <Input id="deck-name" placeholder="Deck name" />
            </div>
            <div>
              <Label htmlFor="deck-description">Description</Label>
              <Input id="deck-description" placeholder="Deck description" />
            </div>
            <div>
              <Label htmlFor="study-interval">Study Interval (days)</Label>
              <Input id="study-interval" type="number" defaultValue="1" />
            </div>
            <div>
              <Label htmlFor="max-cards">Max Cards per Session</Label>
              <Input id="max-cards" type="number" defaultValue="20" />
            </div>
          </CardContent>
        </Card>
      )}

      {context === "card" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Card Properties
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="card-front">Front</Label>
              <Input id="card-front" placeholder="Card front" />
            </div>
            <div>
              <Label htmlFor="card-back">Back</Label>
              <Input id="card-back" placeholder="Card back" />
            </div>
            <div>
              <Label htmlFor="card-tags">Tags</Label>
              <Input id="card-tags" placeholder="javascript, closures, advanced" />
            </div>
            <div>
              <Label htmlFor="card-difficulty">Difficulty</Label>
              <select id="card-difficulty" className="w-full p-2 border rounded" defaultValue="medium">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <Label htmlFor="card-notes">Notes</Label>
              <textarea
                id="card-notes"
                className="w-full p-2 border rounded min-h-[80px]"
                placeholder="Additional notes about this card..."
              />
            </div>
          </CardContent>
        </Card>
      )}

      {context === "study" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Study Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="study-mode">Study Mode</Label>
              <select id="study-mode" className="w-full p-2 border rounded" defaultValue="review">
                <option value="new">New Cards</option>
                <option value="review">Review</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            <div>
              <Label htmlFor="auto-advance">Auto Advance (seconds)</Label>
              <Input id="auto-advance" type="number" defaultValue="0" />
            </div>
            <div>
              <Label htmlFor="show-answer">Show Answer After</Label>
              <Input id="show-answer" type="number" defaultValue="3" />
            </div>
            <div>
              <Label htmlFor="study-progress">Study Progress</Label>
              <div className="text-sm text-muted-foreground">
                {currentCardIndex + 1} cards completed
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-sidebar-foreground">Actions & Help</h2>
        {context && (
          <p className="text-sm text-sidebar-accent-foreground mt-1">
            Context: {context.charAt(0).toUpperCase() + context.slice(1)}
          </p>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="help">Help</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="help" className="h-full p-4">
            {renderHelpContent()}
          </TabsContent>
          
          <TabsContent value="chat" className="h-full">
            {renderChatContent()}
          </TabsContent>
          
          <TabsContent value="properties" className="h-full p-4">
            {renderPropertiesContent()}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
} 
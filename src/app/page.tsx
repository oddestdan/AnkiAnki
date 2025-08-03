import { DecksPanel } from "@/components/decks/decks-panel";
import { CardsPanel } from "@/components/cards/cards-panel";
import { ActionsPanel } from "@/components/actions/actions-panel";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <div className="h-12 border-b border-border bg-background flex items-center justify-between px-4">
        <h1 className="text-lg font-semibold">AnkiAnki</h1>
        <ThemeToggle />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Column - Decks Panel */}
        <div className="w-80 border-r border-border bg-sidebar">
          <DecksPanel />
        </div>
        
        {/* Center Column - Cards Panel */}
        <div className="flex-1 bg-background">
          <CardsPanel />
        </div>
        
        {/* Right Column - Actions Panel */}
        <div className="w-96 border-l border-border bg-sidebar">
          <ActionsPanel />
        </div>
      </div>
    </div>
  );
}

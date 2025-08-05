"use client";

import { DecksPanel } from "@/components/decks/decks-panel";
import { CardsPanel } from "@/components/cards/cards-panel";
import { ActionsPanel } from "@/components/actions/actions-panel";
import { ThemeToggle } from "@/components/theme-toggle/theme-toggle";
import { UserProfile } from "@/components/auth/user-profile";
import { AuthGuard } from "@/components/auth/auth-guard";
import { ResizableColumns, ResizableColumnsRef } from "@/components/ui/resizable-columns";
import { LayoutToggles } from "@/components/ui/layout-toggles";
import { useRef } from "react";

export default function Home() {
  const resizableColumnsRef = useRef<ResizableColumnsRef>(null);

  return (
    <AuthGuard>
      <div className="h-screen w-screen flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex-shrink-0 h-12 border-b border-border bg-background flex items-center justify-between px-4">
          <h1 className="text-lg font-semibold">AnkiAnki</h1>
          
          <div className="flex items-center gap-4">
            <LayoutToggles
              leftWidth={resizableColumnsRef.current?.getLeftWidth() ?? 320}
              rightWidth={resizableColumnsRef.current?.getRightWidth() ?? 384}
              onLeftToggle={() => resizableColumnsRef.current?.toggleLeftVisibility()}
              onRightToggle={() => resizableColumnsRef.current?.toggleRightVisibility()}
            />
            <ThemeToggle />
            <UserProfile />
          </div>
        </div>
        
        {/* Main Content - 3 Columns */}
        <ResizableColumns 
          storageKey="anki-columns"
          ref={resizableColumnsRef}
        >
          <DecksPanel />
          <CardsPanel />
          <ActionsPanel />
        </ResizableColumns>
      </div>
    </AuthGuard>
  );
}

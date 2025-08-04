"use client";

import { Button } from "@/components/ui/button";
import { PanelLeft, PanelLeftOpen, PanelRight, PanelRightOpen } from "lucide-react";

interface LayoutTogglesProps {
  onLeftToggle: () => void;
  onRightToggle: () => void;
  leftWidth: number;
  rightWidth: number;
}

export function LayoutToggles({
  onLeftToggle,
  onRightToggle,
  leftWidth,
  rightWidth
}: LayoutTogglesProps) {
  const leftVisible = leftWidth > 0;
  const rightVisible = rightWidth > 0;

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={onLeftToggle}
        className="h-8 w-8 p-0"
        title={leftVisible ? "Hide left panel" : "Show left panel"}
      >
          <PanelLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={onRightToggle}
        className="h-8 w-8 p-0"
        title={rightVisible ? "Hide right panel" : "Show right panel"}
      >
          <PanelRight className="h-4 w-4" />
      </Button>
    </div>
  );
} 
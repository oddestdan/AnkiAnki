"use client";

import { useEffect, useState, useRef, ReactNode, forwardRef, useImperativeHandle } from "react";

interface ResizableColumnsProps {
  children: [ReactNode, ReactNode, ReactNode]; // left, center, right
  leftWidth?: number;
  rightWidth?: number;
  minWidth?: number;
  storageKey?: string;
  onWidthsChange?: (leftWidth: number, rightWidth: number) => void;
  onLeftVisibilityChange?: (visible: boolean) => void;
  onRightVisibilityChange?: (visible: boolean) => void;
}

export interface ResizableColumnsRef {
  toggleLeftVisibility: () => void;
  toggleRightVisibility: () => void;
  getLeftWidth: () => number;
  getRightWidth: () => number;
}

export const ResizableColumns = forwardRef<ResizableColumnsRef, ResizableColumnsProps>(({
  children,
  leftWidth: initialLeftWidth = 320,
  rightWidth: initialRightWidth = 384,
  minWidth = 200,
  storageKey = "resizable-columns",
  onWidthsChange,
  onLeftVisibilityChange,
  onRightVisibilityChange
}, ref) => {
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const [rightWidth, setRightWidth] = useState(initialRightWidth);
  const [lastLeftWidth, setLastLeftWidth] = useState(initialLeftWidth);
  const [lastRightWidth, setLastRightWidth] = useState(initialRightWidth);
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Expose methods through ref
  useImperativeHandle(ref, () => ({
    toggleLeftVisibility,
    toggleRightVisibility,
    getLeftWidth: () => leftWidth,
    getRightWidth: () => rightWidth
  }));

  // Load saved widths from localStorage
  useEffect(() => {
    const savedLeftWidth = localStorage.getItem(`${storageKey}-left-width`);
    const savedRightWidth = localStorage.getItem(`${storageKey}-right-width`);
    
    if (savedLeftWidth) {
      const width = parseInt(savedLeftWidth);
      setLeftWidth(width);
      if (width > 0) setLastLeftWidth(width);
    }
    if (savedRightWidth) {
      const width = parseInt(savedRightWidth);
      setRightWidth(width);
      if (width > 0) setLastRightWidth(width);
    }
  }, [storageKey]);

  // Save widths to localStorage
  const saveWidths = (left: number, right: number) => {
    localStorage.setItem(`${storageKey}-left-width`, left.toString());
    localStorage.setItem(`${storageKey}-right-width`, right.toString());
    onWidthsChange?.(left, right);
  };

  // Toggle visibility by setting width to 0 or restoring last width
  const toggleLeftVisibility = () => {
    if (leftWidth === 0) {
      setLeftWidth(lastLeftWidth);
      saveWidths(lastLeftWidth, rightWidth);
      onLeftVisibilityChange?.(true);
    } else {
      setLastLeftWidth(leftWidth);
      setLeftWidth(0);
      saveWidths(0, rightWidth);
      onLeftVisibilityChange?.(false);
    }
  };

  const toggleRightVisibility = () => {
    if (rightWidth === 0) {
      setRightWidth(lastRightWidth);
      saveWidths(leftWidth, lastRightWidth);
      onRightVisibilityChange?.(true);
    } else {
      setLastRightWidth(rightWidth);
      setRightWidth(0);
      saveWidths(leftWidth, 0);
      onRightVisibilityChange?.(false);
    }
  };

  const handleMouseDown = (type: 'left' | 'right') => {
    setIsDragging(true);
    setDragType(type);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const mouseX = e.clientX - containerRect.left;
    
    // Calculate minimum center column width (40% of screen or 350px, whichever is larger)
    const minCenterWidth = Math.max(containerWidth * 0.4, 350);
    const maxLeftWidth = containerWidth - (rightWidth > 0 ? rightWidth : 0) - minCenterWidth;
    const maxRightWidth = containerWidth - (leftWidth > 0 ? leftWidth : 0) - minCenterWidth;

    if (dragType === 'left') {
      const newLeftWidth = Math.max(minWidth, Math.min(mouseX, maxLeftWidth));
      setLeftWidth(newLeftWidth);
      setLastLeftWidth(newLeftWidth);
      saveWidths(newLeftWidth, rightWidth);
    } else if (dragType === 'right') {
      const newRightWidth = Math.max(minWidth, Math.min(containerWidth - mouseX, maxRightWidth));
      setRightWidth(newRightWidth);
      setLastRightWidth(newRightWidth);
      saveWidths(leftWidth, newRightWidth);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragType(null);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragType, leftWidth, rightWidth, minWidth]);

  const [leftColumn, centerColumn, rightColumn] = children;

  return (
    <div ref={containerRef} className="flex-1 flex overflow-hidden">
      {/* Left Column */}
      {leftWidth > 0 && (
        <>
          <div 
            className="bg-sidebar overflow-y-auto border-r border-border"
            style={{ width: `${leftWidth}px` }}
          >
            {leftColumn}
          </div>
          
          {/* Left Resize Handle */}
          <div
            className="w-2 cursor-col-resize flex justify-center"
            onMouseDown={() => handleMouseDown('left')}
          >
            <div className="w-1 h-full bg-border hover:bg-border/80 transition-colors" />
          </div>
        </>
      )}
      
      {/* Center Column */}
      <div className="flex-1 bg-background overflow-y-auto">
        {centerColumn}
      </div>
      
      {/* Right Resize Handle */}
      {rightWidth > 0 && (
        <>
          <div
            className="w-2 cursor-col-resize flex justify-center"
            onMouseDown={() => handleMouseDown('right')}
          >
            <div className="w-1 h-full bg-border hover:bg-border/80 transition-colors" />
          </div>
          
          {/* Right Column */}
          <div 
            className="bg-sidebar overflow-y-auto border-l border-border"
            style={{ width: `${rightWidth}px` }}
          >
            {rightColumn}
          </div>
        </>
      )}
    </div>
  );
});

ResizableColumns.displayName = "ResizableColumns"; 
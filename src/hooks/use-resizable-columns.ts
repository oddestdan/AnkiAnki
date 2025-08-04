import { useEffect, useState, useRef } from "react";

interface UseResizableColumnsOptions {
  leftWidth?: number;
  rightWidth?: number;
  minWidth?: number;
  storageKey?: string;
  onWidthsChange?: (leftWidth: number, rightWidth: number) => void;
}

export function useResizableColumns({
  leftWidth: initialLeftWidth = 320,
  rightWidth: initialRightWidth = 384,
  minWidth = 200,
  storageKey = "resizable-columns",
  onWidthsChange
}: UseResizableColumnsOptions = {}) {
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const [rightWidth, setRightWidth] = useState(initialRightWidth);
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load saved widths from localStorage
  useEffect(() => {
    const savedLeftWidth = localStorage.getItem(`${storageKey}-left-width`);
    const savedRightWidth = localStorage.getItem(`${storageKey}-right-width`);
    
    if (savedLeftWidth) setLeftWidth(parseInt(savedLeftWidth));
    if (savedRightWidth) setRightWidth(parseInt(savedRightWidth));
  }, [storageKey]);

  // Save widths to localStorage
  const saveWidths = (left: number, right: number) => {
    localStorage.setItem(`${storageKey}-left-width`, left.toString());
    localStorage.setItem(`${storageKey}-right-width`, right.toString());
    onWidthsChange?.(left, right);
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

    if (dragType === 'left') {
      const newLeftWidth = Math.max(minWidth, Math.min(mouseX, containerWidth - rightWidth - minWidth));
      setLeftWidth(newLeftWidth);
      saveWidths(newLeftWidth, rightWidth);
    } else if (dragType === 'right') {
      const newRightWidth = Math.max(minWidth, Math.min(containerWidth - mouseX, containerWidth - leftWidth - minWidth));
      setRightWidth(newRightWidth);
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

  return {
    leftWidth,
    rightWidth,
    isDragging,
    dragType,
    containerRef,
    handleMouseDown
  };
} 
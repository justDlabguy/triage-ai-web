"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Skip link component for keyboard navigation
export function SkipLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4",
        "bg-primary text-primary-foreground px-4 py-2 rounded-md",
        "z-50 font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      )}
    >
      {children}
    </a>
  );
}

// Focus trap for modals and dialogs
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Let parent components handle escape
        e.stopPropagation();
      }
    };

    container.addEventListener('keydown', handleTabKey);
    container.addEventListener('keydown', handleEscapeKey);
    
    // Focus first element when trap becomes active
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
      container.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isActive]);

  return containerRef;
}

// Announce changes to screen readers
export function useAnnouncer() {
  const announcerRef = useRef<HTMLDivElement>(null);

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announcerRef.current) {
      announcerRef.current.setAttribute('aria-live', priority);
      announcerRef.current.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = '';
        }
      }, 1000);
    }
  };

  const AnnouncerComponent = () => (
    <div
      ref={announcerRef}
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );

  return { announce, AnnouncerComponent };
}

// Responsive breakpoint hook
export function useResponsive() {
  const checkBreakpoint = (breakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl') => {
    if (typeof window === 'undefined') return false;
    
    const breakpoints = {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    };
    
    return window.innerWidth >= breakpoints[breakpoint];
  };

  return { checkBreakpoint };
}

// High contrast mode detection
export function useHighContrast() {
  const isHighContrast = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-contrast: high)').matches;
  };

  return { isHighContrast: isHighContrast() };
}

// Reduced motion detection
export function useReducedMotion() {
  const prefersReducedMotion = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  return { prefersReducedMotion: prefersReducedMotion() };
}

// Keyboard navigation helper
export function useKeyboardNavigation() {
  const handleKeyDown = (
    e: React.KeyboardEvent,
    handlers: {
      onEnter?: () => void;
      onSpace?: () => void;
      onEscape?: () => void;
      onArrowUp?: () => void;
      onArrowDown?: () => void;
      onArrowLeft?: () => void;
      onArrowRight?: () => void;
    }
  ) => {
    switch (e.key) {
      case 'Enter':
        handlers.onEnter?.();
        break;
      case ' ':
        e.preventDefault(); // Prevent page scroll
        handlers.onSpace?.();
        break;
      case 'Escape':
        handlers.onEscape?.();
        break;
      case 'ArrowUp':
        e.preventDefault();
        handlers.onArrowUp?.();
        break;
      case 'ArrowDown':
        e.preventDefault();
        handlers.onArrowDown?.();
        break;
      case 'ArrowLeft':
        handlers.onArrowLeft?.();
        break;
      case 'ArrowRight':
        handlers.onArrowRight?.();
        break;
    }
  };

  return { handleKeyDown };
}

// Screen reader only text component
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

// Visually hidden but accessible component
export function VisuallyHidden({ 
  children, 
  asChild = false 
}: { 
  children: React.ReactNode;
  asChild?: boolean;
}) {
  const className = "absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0";
  
  if (asChild) {
    return <span className={className}>{children}</span>;
  }
  
  return <div className={className}>{children}</div>;
}
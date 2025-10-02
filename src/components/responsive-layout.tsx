"use client";

import { cn } from "@/lib/utils";
import { SkipLink } from "@/components/accessibility-utils";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  showSkipLink?: boolean;
  mainId?: string;
}

export function ResponsiveLayout({
  children,
  className,
  maxWidth = 'full',
  padding = 'md',
  showSkipLink = true,
  mainId = 'main-content'
}: ResponsiveLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-2 sm:p-4',
    md: 'p-4 sm:p-6 lg:p-8',
    lg: 'p-6 sm:p-8 lg:p-12'
  };

  return (
    <>
      {showSkipLink && (
        <SkipLink href={`#${mainId}`}>
          Skip to main content
        </SkipLink>
      )}
      
      <div
        className={cn(
          "min-h-screen w-full",
          "flex flex-col",
          paddingClasses[padding],
          className
        )}
      >
        <main
          id={mainId}
          className={cn(
            "flex-1 w-full mx-auto",
            maxWidthClasses[maxWidth],
            "focus:outline-none"
          )}
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </>
  );
}

// Container component with responsive breakpoints
export function ResponsiveContainer({
  children,
  className,
  size = 'default'
}: {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'default' | 'lg' | 'xl';
}) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    default: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl'
  };

  return (
    <div
      className={cn(
        "w-full mx-auto px-4 sm:px-6 lg:px-8",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}

// Grid component with responsive columns
export function ResponsiveGrid({
  children,
  className,
  cols = { default: 1, sm: 2, lg: 3 },
  gap = 'md'
}: {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}) {
  const gapClasses = {
    sm: 'gap-2 sm:gap-4',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8'
  };

  const getColsClass = () => {
    const classes = ['grid'];
    
    if (cols.default) classes.push(`grid-cols-${cols.default}`);
    if (cols.sm) classes.push(`sm:grid-cols-${cols.sm}`);
    if (cols.md) classes.push(`md:grid-cols-${cols.md}`);
    if (cols.lg) classes.push(`lg:grid-cols-${cols.lg}`);
    if (cols.xl) classes.push(`xl:grid-cols-${cols.xl}`);
    
    return classes.join(' ');
  };

  return (
    <div
      className={cn(
        getColsClass(),
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
}

// Stack component for vertical layouts
export function ResponsiveStack({
  children,
  className,
  spacing = 'md',
  align = 'stretch'
}: {
  children: React.ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'stretch';
}) {
  const spacingClasses = {
    sm: 'space-y-2 sm:space-y-4',
    md: 'space-y-4 sm:space-y-6',
    lg: 'space-y-6 sm:space-y-8'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  return (
    <div
      className={cn(
        'flex flex-col',
        spacingClasses[spacing],
        alignClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
}

// Responsive text component
export function ResponsiveText({
  children,
  className,
  size = 'base',
  weight = 'normal'
}: {
  children: React.ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
}) {
  const sizeClasses = {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl'
  };

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  return (
    <span
      className={cn(
        sizeClasses[size],
        weightClasses[weight],
        className
      )}
    >
      {children}
    </span>
  );
}
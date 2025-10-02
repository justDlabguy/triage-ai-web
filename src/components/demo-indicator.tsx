"use client";

import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDemoStore } from "@/stores/demo-store";
import { TestTube, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoIndicatorProps {
  variant?: "badge" | "alert" | "banner";
  className?: string;
  showScenario?: boolean;
}

export function DemoIndicator({ 
  variant = "badge", 
  className,
  showScenario = false 
}: DemoIndicatorProps) {
  const { isDemoMode, showDemoIndicators, getCurrentScenario } = useDemoStore();
  
  if (!isDemoMode || !showDemoIndicators) {
    return null;
  }

  const currentScenario = getCurrentScenario();

  if (variant === "badge") {
    return (
      <Badge 
        variant="outline" 
        className={cn(
          "bg-orange-50 text-orange-700 border-orange-200 animate-pulse",
          className
        )}
      >
        <TestTube className="h-3 w-3 mr-1" />
        Demo Mode
        {showScenario && currentScenario && (
          <span className="ml-1 text-xs">
            • {currentScenario.name}
          </span>
        )}
      </Badge>
    );
  }

  if (variant === "alert") {
    return (
      <Alert className={cn("border-orange-200 bg-orange-50", className)}>
        <TestTube className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          <div className="flex items-center justify-between">
            <span>Demo mode is active</span>
            {showScenario && currentScenario && (
              <Badge variant="secondary" className="ml-2">
                {currentScenario.name}
              </Badge>
            )}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (variant === "banner") {
    return (
      <div className={cn(
        "bg-gradient-to-r from-orange-100 to-yellow-100 border-b border-orange-200 px-4 py-2",
        className
      )}>
        <div className="flex items-center justify-center gap-2 text-orange-800">
          <Zap className="h-4 w-4 animate-pulse" />
          <span className="text-sm font-medium">
            Demo Mode Active
          </span>
          {showScenario && currentScenario && (
            <>
              <span className="text-sm">•</span>
              <Badge variant="secondary" className="text-xs">
                {currentScenario.name}
              </Badge>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
}

// Convenience components for specific use cases
export function DemoBadge(props: Omit<DemoIndicatorProps, "variant">) {
  return <DemoIndicator variant="badge" {...props} />;
}

export function DemoAlert(props: Omit<DemoIndicatorProps, "variant">) {
  return <DemoIndicator variant="alert" {...props} />;
}

export function DemoBanner(props: Omit<DemoIndicatorProps, "variant">) {
  return <DemoIndicator variant="banner" {...props} />;
}
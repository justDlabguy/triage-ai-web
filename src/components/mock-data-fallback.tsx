"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDemoStore } from "@/stores/demo-store";
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface MockDataFallbackProps {
  error?: Error | string;
  onRetry?: () => void;
  className?: string;
  showInProduction?: boolean;
}

export function MockDataFallback({ 
  error, 
  onRetry, 
  className,
  showInProduction = false 
}: MockDataFallbackProps) {
  const { isDemoMode } = useDemoStore();
  
  // Only show in demo mode or if explicitly allowed in production
  if (!isDemoMode && !showInProduction) {
    return null;
  }

  const errorMessage = typeof error === 'string' ? error : error?.message || 'Unknown error';
  const isNetworkError = errorMessage.toLowerCase().includes('network') || 
                        errorMessage.toLowerCase().includes('fetch') ||
                        errorMessage.toLowerCase().includes('connection');

  return (
    <Alert className={cn(
      "border-amber-200 bg-amber-50",
      className
    )}>
      <div className="flex items-start gap-3">
        {isNetworkError ? (
          <WifiOff className="h-4 w-4 text-amber-600 mt-0.5" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
        )}
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTitle className="text-amber-800 text-sm">
              {isNetworkError ? 'Connection Issue' : 'API Error'}
            </AlertTitle>
            {isDemoMode && (
              <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                Demo Mode
              </Badge>
            )}
          </div>
          
          <AlertDescription className="text-amber-700 text-sm">
            {isDemoMode ? (
              <div className="space-y-1">
                <p>
                  {isNetworkError 
                    ? 'Unable to connect to the backend service. Using mock data for demonstration.'
                    : 'API request failed. Falling back to mock data for demo purposes.'
                  }
                </p>
                <p className="text-xs text-amber-600">
                  Error: {errorMessage}
                </p>
              </div>
            ) : (
              <p>
                {isNetworkError 
                  ? 'Please check your internet connection and try again.'
                  : `Something went wrong: ${errorMessage}`
                }
              </p>
            )}
          </AlertDescription>

          {onRetry && (
            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="h-7 text-xs border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Try Again
              </Button>
              
              {isDemoMode && (
                <div className="flex items-center gap-1 text-xs text-amber-600">
                  <Wifi className="h-3 w-3" />
                  <span>Mock data active</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Alert>
  );
}

// Hook to handle API errors with mock data fallback
export function useApiWithFallback() {
  const { isDemoMode, useMockData } = useDemoStore();

  const handleApiError = (error: Error | string, mockDataFn?: () => unknown) => {
    console.error('API Error:', error);
    
    // In demo mode, return mock data if available
    if (isDemoMode && mockDataFn) {
      console.log('Demo mode: Using mock data fallback');
      return mockDataFn();
    }
    
    // Otherwise, re-throw the error
    throw error;
  };

  return {
    isDemoMode,
    useMockData,
    handleApiError
  };
}
import React from "react";
import { AlertCircle } from "lucide-react";

interface ErrorFallbackProps {
  error?: Error | null;
  onRetry?: () => void;
  showRetry?: boolean;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  onRetry,
  showRetry = true 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong</h3>
      <p className="text-muted-foreground mb-4 max-w-md">
        {error?.message || "We couldn't load your tasks. Please check your connection and try again."}
      </p>
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
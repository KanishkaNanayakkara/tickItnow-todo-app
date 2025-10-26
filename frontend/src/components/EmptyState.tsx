import { CheckCircle2 } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="text-center py-16 animate-fade-in">
      <div className="relative inline-block mb-6">
        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
        <CheckCircle2 className="w-20 h-20 mx-auto text-primary relative animate-float" data-testid="empty-check-icon" />
      </div>
      <h3 className="text-2xl font-semibold text-foreground mb-2">
        No tasks yet!
      </h3>
      <p className="text-base text-muted-foreground">
        Create your first task to get started 
      </p>
    </div>
  );
};

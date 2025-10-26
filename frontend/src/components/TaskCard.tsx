import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Pencil, Check, X } from "lucide-react";
import { completeTask, updateTask } from "@/service/apiService";
import { ITask } from "@/types/common/types";
import { toast } from "sonner";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

interface TaskCardProps {
  task: ITask;
  refetchTasks: (options?: RefetchOptions) => Promise<QueryObserverResult<ITask[], Error>>;
}

export const TaskCard = ({ task, refetchTasks }: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleSave = async () => {
    if (!editTitle.trim()) return;

    try {
      await updateTask(task.id, editTitle.trim(), editDescription.trim());
      refetchTasks();
      toast.success("Changes saved");
    } catch (error) {
      toast.error("Failed to update task. Please try again.");
    } finally {
      setIsEditing(false);
    }
  };
  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setIsEditing(false);
  };
  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await completeTask(task.id);
      refetchTasks();
      toast.success("Task completed!");
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("Failed to mark task as complete. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <Card 
      className={`p-3 lg:p-4 shadow-card hover:shadow-card-hover transition-all duration-300 border-l-4 border-l-primary/50 hover:border-l-primary bg-gradient-to-br from-card to-card/30 backdrop-blur ${
        isCompleting ? "animate-fade-out" : "animate-fade-in"
      }`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <Input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="font-semibold text-sm lg:text-base"
            autoFocus
          />
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Task description"
            className="min-h-[60px] lg:min-h-[70px] resize-none text-sm lg:text-base"
          />
          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              size="sm" 
              className="flex-1"
            >
              <Check className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button 
              onClick={handleCancel} 
              size="sm" 
              variant="outline"
              className="flex-1"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-base lg:text-lg text-card-foreground mb-1.5">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-muted-foreground text-xs lg:text-sm leading-relaxed line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setIsEditing(true)}
              size="sm"
              variant="outline"
              className="flex-shrink-0 hover:border-primary hover:text-primary transition-colors"
            >
              <Pencil className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              onClick={handleComplete}
              size="sm"
              disabled={isCompleting}
              className="flex-1 gradient-hero hover:opacity-90 transition-opacity font-semibold shadow-md"
            >
              Complete
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

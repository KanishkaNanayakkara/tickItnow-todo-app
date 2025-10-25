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
        <>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Task title"
          />
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Task description"
          />
          <div className="flex gap-2">
            <Button onClick={handleSave} variant="default">
              Save
            </Button>
            <Button onClick={handleCancel} variant="secondary">
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          <h3 className="font-semibold text-lg">{task.title}</h3>
          <p className="text-gray-600">{task.description}</p>
          <div className="flex gap-2">
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Pencil size={16} /> Edit
            </Button>
            <Button
              onClick={handleComplete}
              disabled={isCompleting}
              variant="default"
              className="flex-1 gradient-accent hover:opacity-90 transition-opacity font-semibold shadow-md"
            >
              <Check size={16} /> Complete
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};

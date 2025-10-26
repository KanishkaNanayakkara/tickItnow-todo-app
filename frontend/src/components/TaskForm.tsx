import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { addTask } from "@/service/apiService";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { ITask } from "@/types/common/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TaskFormProps {
  refetchTasks: (options?: RefetchOptions) => Promise<QueryObserverResult<ITask[], Error>>;
}

export const TaskForm = ({refetchTasks}: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasErrors = false;
    if (!title.trim()) {
      setErrors(prev => ({ ...prev, title: "Title is required" }));
      hasErrors = true;
    }
    else if (!description.trim()) {
      setErrors(prev => ({ ...prev, description: "Description is required" }));
      hasErrors = true;
    } else {
      setErrors({ title: "", description: "" });
    }
    
    if (hasErrors) return;

    try {
      setLoading(true);
      await addTask(title.trim(), description.trim());
      toast.success("Task added successfully!");
      refetchTasks();
      setTitle("");
      setDescription("");
    } catch (error) {
      toast.error("Failed to add task:", error);
    } finally {
      setLoading(false);
      setErrors({ title: "", description: "" });
    }
  };

  return (
    <Card className="p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border-2 border-transparent hover:border-primary/20 bg-gradient-to-br from-card to-card/50 backdrop-blur">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            id="title"
            placeholder="Enter task title..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim()) {
                setErrors(prev => ({ ...prev, title: "" }));
              }
            }}
            className={cn(errors.title && "border-red-500")}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title}</p>
          )}
        </div>
        <div className="space-y-2">
          <Textarea
            id="description"
            placeholder="Add details about your task..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (e.target.value.trim()) {
                setErrors(prev => ({ ...prev, description: "" }));
              }
            }}
            className={cn(errors.description && "border-red-500")}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}
        </div>
        <Button type="submit" disabled={loading} className="w-full gradient-primary hover:opacity-90 transition-opacity shadow-glow font-semibold text-base h-12">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          {loading ? "Adding..." : "Add Task"}
        </Button>
      </form>
    </Card>
  );
};


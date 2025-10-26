import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { addTask } from "@/service/apiService";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { ITask } from "@/types/common/types";
import { toast } from "sonner";

interface TaskFormProps {
  refetchTasks: (options?: RefetchOptions) => Promise<QueryObserverResult<ITask[], Error>>;
}

export const TaskForm = ({refetchTasks}: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

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
    }
  };

  return (
    <Card className="p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border-2 border-transparent hover:border-primary/20 bg-gradient-to-br from-card to-card/50 backdrop-blur">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="title"
          data-testid="task-title-input"
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Textarea
          id="description"
          data-testid="task-description-input"
          placeholder="Add details about your task..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button type="submit" disabled={loading} className="w-full gradient-primary hover:opacity-90 transition-opacity shadow-glow font-semibold text-base h-12" data-testid="submit-task-button">
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


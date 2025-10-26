import React from "react";
import { EmptyState } from "@/components/EmptyState";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { useGetRecentTasks } from "@/queries/useGetRecentTasksQuery";
import { ErrorFallback } from "@/components/ui/ErrorFallback";
import Loader from "@/components/ui/Loader";

const Index = () => {
  const { recentTasks = [], isLoadingTasks, tasksError, refetchTasks } = useGetRecentTasks();

  return (
    <div className="min-h-screen">
      <div className="container max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="lg:hidden mb-6 animate-slide-up">
          <div className="flex items-center gap-5">
            <div className="animate-float">
              <div className="w-16 h-16 rounded-2xl gradient-hero shadow-glow flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gradient">
                TickItNow
              </h1>
              <p className="text-muted-foreground text-sm font-medium mt-1">
                Manage your tasks with style
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="hidden lg:flex flex-col lg:min-h-[calc(100vh-8rem)] justify-between space-y-6">
            <div className="animate-slide-up">
              <div className="flex items-center gap-5 lg:gap-6">
                <div className="animate-float">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl gradient-hero shadow-glow flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-8 h-8 lg:w-10 lg:h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gradient">
                    TickItNow
                  </h1>
                  <p className="text-muted-foreground text-sm lg:text-base font-medium mt-1">
                    Manage your tasks with style
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-lg lg:text-xl font-semibold mb-4 text-foreground">
                Create New Task
              </h2>
              <TaskForm refetchTasks={refetchTasks} />
            </div>
          </div>

          <div className="order-1 lg:order-2 flex flex-col lg:h-[calc(100vh-8rem)]">
            <div className="flex items-center gap-2 lg:gap-3 mb-4 lg:mb-6">
              <div className="h-0.5 lg:h-1 flex-1 rounded-full bg-gradient-to-r from-primary via-secondary to-accent"></div>
              <h2 className="text-lg lg:text-xl font-semibold text-foreground whitespace-nowrap">
                Next Up
              </h2>
              <div className="h-0.5 lg:h-1 flex-1 rounded-full bg-gradient-to-l from-primary via-secondary to-accent"></div>
            </div>

            {isLoadingTasks ? (
              <Loader size="lg" text="Loading task..." />
            ) : tasksError ? (
              <ErrorFallback error={tasksError} onRetry={refetchTasks} />
            ) : recentTasks.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {recentTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    refetchTasks={refetchTasks}
                    isLoading={false}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:hidden order-3 mt-6">
            <h2 className="text-lg font-semibold mb-4 text-foreground">
              Create New Task
            </h2>
            <TaskForm refetchTasks={refetchTasks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
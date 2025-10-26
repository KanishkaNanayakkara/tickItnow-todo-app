export interface ITask {
    id: number;
    title: string;
    description: string;
    completed?: boolean;
    createdAt: Date;
}

export interface ITaskCreate {
  title: string;
  description: string;
}

export interface ITaskUpdate {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface IApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}
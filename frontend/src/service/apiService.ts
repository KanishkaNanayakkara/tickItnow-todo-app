import { ITask } from "@/types/common/types";
import axios from "axios";

export const fetchRecentTasks = async (): Promise<ITask[]> => {
  try {
    const { data } = await axios.get('/tasks');
    return data;
  } catch (error) {
    throw new Error("Failed to fetch tasks");
  }
};

export const addTask = async (title: string, description: string): Promise<ITask> => {
  const { data } = await axios.post('/tasks', { title, description });
  return data;
};

export const updateTask = async (id: number, title: string, description: string): Promise<ITask> => {
  const { data } = await axios.patch(`/tasks/${id}`, { title, description });
  return data;
};

export const completeTask = async (id: number): Promise<ITask> => {
  const { data } = await axios.put(`/tasks/${id}`);
  return data;
};
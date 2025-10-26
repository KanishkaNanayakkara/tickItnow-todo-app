import { vi } from 'vitest';

export const addTask = vi.fn();
export const updateTask = vi.fn();
export const completeTask = vi.fn();
export const deleteTask = vi.fn();
export const getTasks = vi.fn();

export const resetAllMocks = () => {
  addTask.mockReset();
  updateTask.mockReset();
  completeTask.mockReset();
  deleteTask.mockReset();
  getTasks.mockReset();
};
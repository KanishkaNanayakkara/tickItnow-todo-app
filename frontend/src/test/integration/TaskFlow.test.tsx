import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';
import * as apiService from '@/service/apiService';
import { ITask } from '@/types/common/types';

vi.mock('@/service/apiService');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Task Flow Integration Tests', () => {
  const mockRefetchTasks = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Complete Task Flow', () => {
    it('allows creating and completing a task', async () => {
      vi.mocked(apiService.addTask).mockResolvedValue(undefined);
      
      render(<TaskForm refetchTasks={mockRefetchTasks} />);

      const titleInput = screen.getByTestId('task-title-input');
      const descriptionInput = screen.getByTestId('task-description-input');
      const submitButton = screen.getByTestId('submit-task-button');
      
      fireEvent.change(titleInput, { target: { value: 'Buy groceries' } });
      fireEvent.change(descriptionInput, { target: { value: 'Milk, bread, eggs' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(apiService.addTask).toHaveBeenCalledWith('Buy groceries', 'Milk, bread, eggs');
        expect(mockRefetchTasks).toHaveBeenCalled();
      });
    });
  });

  describe('Edit Task Flow', () => {
    const mockTask: ITask = {
      id: 1,
      title: 'Original Task',
      description: 'Original Description',
      completed: false,
      createdAt: new Date(),
    };

    it('allows editing and saving a task', async () => {
      vi.mocked(apiService.updateTask).mockResolvedValue(undefined);
      
      render(<TaskCard task={mockTask} refetchTasks={mockRefetchTasks} />);

      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      const titleInput = screen.getByDisplayValue('Original Task');
      fireEvent.change(titleInput, { target: { value: 'Updated Task' } });

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(apiService.updateTask).toHaveBeenCalledWith('1', 'Updated Task', 'Original Description');
        expect(mockRefetchTasks).toHaveBeenCalled();
      });
    });

    it('allows editing and canceling without saving', () => {
      render(<TaskCard task={mockTask} refetchTasks={mockRefetchTasks} />);

      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      const titleInput = screen.getByDisplayValue('Original Task');
      fireEvent.change(titleInput, { target: { value: 'Changed Task' } });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(screen.getByText('Original Task')).toBeInTheDocument();
      expect(screen.queryByDisplayValue('Changed Task')).not.toBeInTheDocument();
      expect(apiService.updateTask).not.toHaveBeenCalled();
    });
  });

  describe('Complete Task Flow', () => {
    const mockTask: ITask = {
      id: 1,
      title: 'Task to Complete',
      description: 'This will be completed',
      completed: false,
      createdAt: new Date(),
    };

    it('allows completing a task', async () => {
      vi.mocked(apiService.completeTask).mockResolvedValue(undefined);
      
      render(<TaskCard task={mockTask} refetchTasks={mockRefetchTasks} />);
      
      const completeButton = screen.getByRole('button', { name: /complete/i });
      fireEvent.click(completeButton);
      
      await waitFor(() => {
        expect(apiService.completeTask).toHaveBeenCalledWith('1');
        expect(mockRefetchTasks).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles API errors gracefully when adding a task', async () => {
      vi.mocked(apiService.addTask).mockRejectedValue(new Error('Network error'));
      
      render(<TaskForm refetchTasks={mockRefetchTasks} />);
      
      const titleInput = screen.getByTestId('task-title-input');
      const descriptionInput = screen.getByTestId('task-description-input');
      const submitButton = screen.getByTestId('submit-task-button');
      
      fireEvent.change(titleInput, { target: { value: 'Test Task' } });
      fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockRefetchTasks).not.toHaveBeenCalled();
      });
    });

    it('handles API errors gracefully when updating a task', async () => {
      vi.mocked(apiService.updateTask).mockRejectedValue(new Error('Update failed'));
      
      const mockTask: ITask = {
        id: 1,
        title: 'Original Task',
        description: 'Original Description',
        completed: false,
        createdAt: new Date(),
      };
      
      render(<TaskCard task={mockTask} refetchTasks={mockRefetchTasks} />);
      
      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);
      
      const titleInput = screen.getByDisplayValue('Original Task');
      fireEvent.change(titleInput, { target: { value: 'Updated Task' } });
      
      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(apiService.updateTask).toHaveBeenCalled();
      });
    });
  });
});
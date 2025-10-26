import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import { TaskCard } from './TaskCard';
import * as apiService from '@/service/apiService';
import { toast } from 'sonner';
import { ITask } from '@/types/common/types';

vi.mock('@/service/apiService', () => ({
  completeTask: vi.fn(),
  updateTask: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('./Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

describe('TaskCard', () => {
  const mockTask: ITask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    createdAt: new Date(),
  };

  const mockRefetchTasks = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Display Mode', () => {
    it('renders task title and description', () => {
      render(<TaskCard task={mockTask} refetchTasks={mockRefetchTasks} />);

      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('renders Edit and Complete buttons', () => {
      render(<TaskCard task={mockTask} refetchTasks={mockRefetchTasks} />);

      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /complete/i })).toBeInTheDocument();
    });

    it('does not show description if task has no description', () => {
      const taskWithoutDescription = { ...mockTask, description: '' };
      render(<TaskCard task={taskWithoutDescription} refetchTasks={mockRefetchTasks} />);

      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
    });

    it('shows loader overlay when isLoading is true', () => {
      render(<TaskCard task={mockTask} refetchTasks={mockRefetchTasks} isLoading={true} />);

      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });
  });

  describe('Edit Mode', () => {
    it('switches to edit mode when Edit button is clicked', () => {
      render(<TaskCard task={mockTask} refetchTasks={mockRefetchTasks} />);

      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('updates title input value when user types', () => {
      render(<TaskCard task={mockTask} refetchTasks={mockRefetchTasks} />);

      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      const titleInput = screen.getByDisplayValue('Test Task') as HTMLInputElement;
      fireEvent.change(titleInput, { target: { value: 'Updated Task' } });

      expect(titleInput.value).toBe('Updated Task');
    });

    it('updates description textarea value when user types', () => {
      render(<TaskCard task={mockTask} refetchTasks={mockRefetchTasks} />);

      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      const descriptionTextarea = screen.getByDisplayValue('Test Description') as HTMLTextAreaElement;
      fireEvent.change(descriptionTextarea, { target: { value: 'Updated Description' } });

      expect(descriptionTextarea.value).toBe('Updated Description');
    });

    it('saves changes when Save button is clicked', async () => {
      vi.mocked(apiService.updateTask).mockResolvedValue(undefined);

      render(<TaskCard task={mockTask} refetchTasks={mockRefetchTasks} />);

      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      const titleInput = screen.getByDisplayValue('Test Task');
      fireEvent.change(titleInput, { target: { value: 'Updated Task' } });

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(apiService.updateTask).toHaveBeenCalledWith('1', 'Updated Task', 'Test Description');
      });

      expect(mockRefetchTasks).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Changes saved');
    });

    it('trims whitespace from title before saving', async () => {
      vi.mocked(apiService.updateTask).mockResolvedValue(undefined);

      render(<TaskCard task={mockTask} refetchTasks={mockRefetchTasks} />);

      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      const titleInput = screen.getByDisplayValue('Test Task');
      fireEvent.change(titleInput, { target: { value: '  Updated Task  ' } });

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(apiService.updateTask).toHaveBeenCalledWith('1', 'Updated Task', 'Test Description');
      });
    });

    it('does not save if title is empty', async () => {
      render(<TaskCard task={mockTask} refetchTasks={mockRefetchTasks} />);

      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      const titleInput = screen.getByDisplayValue('Test Task');
      fireEvent.change(titleInput, { target: { value: '   ' } });

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(apiService.updateTask).not.toHaveBeenCalled();
      });
    });

    it('shows error toast when update fails', async () => {
      const error = new Error('Update failed');
      vi.mocked(apiService.updateTask).mockRejectedValue(error);

      render(<TaskCard task={mockTask} refetchTasks={mockRefetchTasks} />);

      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      const titleInput = screen.getByDisplayValue('Test Task');
      fireEvent.change(titleInput, { target: { value: 'Updated Task' } });

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to update task. Please try again.');
      });
    });

    it('exits edit mode after successful save', async () => {
      vi.mocked(apiService.updateTask).mockResolvedValue(undefined);

      render(<TaskCard task={mockTask} refetchTasks={mockRefetchTasks} />);

      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });

    it('cancels edit mode and reverts changes when Cancel button is clicked', () => {
      render(<TaskCard task={mockTask} refetchTasks={mockRefetchTasks} />);

      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      const titleInput = screen.getByDisplayValue('Test Task');
      fireEvent.change(titleInput, { target: { value: 'Changed Title' } });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(screen.queryByDisplayValue('Changed Title')).not.toBeInTheDocument();
      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });
  });

  describe('Complete Task', () => {
    it('completes task when Complete button is clicked', async () => {
      vi.mocked(apiService.completeTask).mockResolvedValue(undefined);

      render(<TaskCard task={mockTask} refetchTasks={mockRefetchTasks} />);

      const completeButton = screen.getByRole('button', { name: /complete/i });
      fireEvent.click(completeButton);

      await waitFor(() => {
        expect(apiService.completeTask).toHaveBeenCalledWith('1');
      });

      expect(mockRefetchTasks).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Task completed!');
    });

    it('disables Complete button while completing', async () => {
      vi.mocked(apiService.completeTask).mockImplementation(() =>
        new Promise(resolve => setTimeout(resolve, 100))
      );

      render(<TaskCard task={mockTask} refetchTasks={mockRefetchTasks} />);

      const completeButton = screen.getByRole('button', { name: /complete/i });
      fireEvent.click(completeButton);

      expect(completeButton).toBeDisabled();

      await waitFor(() => {
        expect(completeButton).not.toBeDisabled();
      });
    });

    it('shows error toast when complete fails', async () => {
      const error = new Error('Complete failed');
      vi.mocked(apiService.completeTask).mockRejectedValue(error);

      render(<TaskCard task={mockTask} refetchTasks={mockRefetchTasks} />);

      const completeButton = screen.getByRole('button', { name: /complete/i });
      fireEvent.click(completeButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to mark task as complete. Please try again.');
      });
    });
  });
});
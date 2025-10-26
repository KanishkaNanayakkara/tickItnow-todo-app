import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import { TaskForm } from './TaskForm';
import * as apiService from '@/service/apiService';
import { toast } from 'sonner';

vi.mock('@/service/apiService', () => ({
  addTask: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('TaskForm', () => {
  const mockRefetchTasks = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form with all input fields', () => {
    render(<TaskForm refetchTasks={mockRefetchTasks} />);

    expect(screen.getByTestId('task-title-input')).toBeInTheDocument();
    expect(screen.getByTestId('task-description-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-task-button')).toBeInTheDocument();
  });

  it('updates title input value when user types', () => {
    render(<TaskForm refetchTasks={mockRefetchTasks} />);
    
    const titleInput = screen.getByTestId('task-title-input') as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    
    expect(titleInput.value).toBe('New Task');
  });

  it('updates description input value when user types', () => {
    render(<TaskForm refetchTasks={mockRefetchTasks} />);
    
    const descriptionInput = screen.getByTestId('task-description-input') as HTMLTextAreaElement;
    fireEvent.change(descriptionInput, { target: { value: 'Task description' } });
    
    expect(descriptionInput.value).toBe('Task description');
  });

  it('shows error when submitting with empty title', async () => {
    render(<TaskForm refetchTasks={mockRefetchTasks} />);
    
    const submitButton = screen.getByTestId('submit-task-button');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
    
    expect(apiService.addTask).not.toHaveBeenCalled();
  });

  it('shows error when submitting with empty description', async () => {
    render(<TaskForm refetchTasks={mockRefetchTasks} />);
    
    const titleInput = screen.getByTestId('task-title-input');
    fireEvent.change(titleInput, { target: { value: 'Task Title' } });
    
    const submitButton = screen.getByTestId('submit-task-button');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });
    
    expect(apiService.addTask).not.toHaveBeenCalled();
  });

  it('clears title error when user starts typing', async () => {
    render(<TaskForm refetchTasks={mockRefetchTasks} />);
    
    const submitButton = screen.getByTestId('submit-task-button');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
    });
    
    const titleInput = screen.getByTestId('task-title-input');
    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    
    await waitFor(() => {
      expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
    });
  });

  it('clears description error when user starts typing', async () => {
    render(<TaskForm refetchTasks={mockRefetchTasks} />);
    
    const titleInput = screen.getByTestId('task-title-input');
    fireEvent.change(titleInput, { target: { value: 'Task Title' } });
    
    const submitButton = screen.getByTestId('submit-task-button');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });
    
    const descriptionInput = screen.getByTestId('task-description-input');
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    
    await waitFor(() => {
      expect(screen.queryByText('Description is required')).not.toBeInTheDocument();
    });
  });

  it('successfully submits the form with valid data', async () => {
    vi.mocked(apiService.addTask).mockResolvedValue(undefined);
    
    render(<TaskForm refetchTasks={mockRefetchTasks} />);
    
    const titleInput = screen.getByTestId('task-title-input');
    const descriptionInput = screen.getByTestId('task-description-input');
    const submitButton = screen.getByTestId('submit-task-button');
    
    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Task description' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(apiService.addTask).toHaveBeenCalledWith('New Task', 'Task description');
    });
    
    expect(toast.success).toHaveBeenCalledWith('Task added successfully!');
    expect(mockRefetchTasks).toHaveBeenCalled();
  });

  it('clears form fields after successful submission', async () => {
    vi.mocked(apiService.addTask).mockResolvedValue(undefined);
    
    render(<TaskForm refetchTasks={mockRefetchTasks} />);
    
    const titleInput = screen.getByTestId('task-title-input') as HTMLInputElement;
    const descriptionInput = screen.getByTestId('task-description-input') as HTMLTextAreaElement;
    const submitButton = screen.getByTestId('submit-task-button');
    
    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Task description' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(titleInput.value).toBe('');
      expect(descriptionInput.value).toBe('');
    });
  });

  it('shows error toast when API call fails', async () => {
    const error = new Error('API Error');
    vi.mocked(apiService.addTask).mockRejectedValue(error);
    
    render(<TaskForm refetchTasks={mockRefetchTasks} />);
    
    const titleInput = screen.getByTestId('task-title-input');
    const descriptionInput = screen.getByTestId('task-description-input');
    const submitButton = screen.getByTestId('submit-task-button');
    
    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Task description' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
    
    expect(mockRefetchTasks).not.toHaveBeenCalled();
  });

  it('disables submit button while loading', async () => {
    vi.mocked(apiService.addTask).mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );
    
    render(<TaskForm refetchTasks={mockRefetchTasks} />);
    
    const titleInput = screen.getByTestId('task-title-input');
    const descriptionInput = screen.getByTestId('task-description-input');
    const submitButton = screen.getByTestId('submit-task-button');
    
    fireEvent.change(titleInput, { target: { value: 'New Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Task description' } });
    fireEvent.click(submitButton);
    
    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Adding...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('trims whitespace from title and description before submission', async () => {
    vi.mocked(apiService.addTask).mockResolvedValue(undefined);
    
    render(<TaskForm refetchTasks={mockRefetchTasks} />);
    
    const titleInput = screen.getByTestId('task-title-input');
    const descriptionInput = screen.getByTestId('task-description-input');
    const submitButton = screen.getByTestId('submit-task-button');
    
    fireEvent.change(titleInput, { target: { value: '  New Task  ' } });
    fireEvent.change(descriptionInput, { target: { value: '  Task description  ' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(apiService.addTask).toHaveBeenCalledWith('New Task', 'Task description');
    });
  });
});
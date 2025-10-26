import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import Index from './Index';
import * as useGetRecentTasksQuery from '@/queries/useGetRecentTasksQuery';
import { ITask } from '@/types/common/types';

vi.mock('@/queries/useGetRecentTasksQuery', () => ({
  useGetRecentTasks: vi.fn(),
}));

vi.mock('@/components/EmptyState', () => ({
  EmptyState: () => <div data-testid="empty-state">No tasks yet</div>,
}));

vi.mock('@/components/TaskCard', () => ({
  TaskCard: ({ task }: { task: ITask }) => (
    <div data-testid={`task-card-${task.id}`}>{task.title}</div>
  ),
}));

vi.mock('@/components/TaskForm', () => ({
  TaskForm: ({ refetchTasks }: { refetchTasks?: () => void }) => (
    <div data-testid="task-form">Task Form</div>
  ),
}));

vi.mock('@/components/ErrorFallback', () => ({
  ErrorFallback: ({ error, onRetry }: { error: Error; onRetry?: () => void }) => (
    <div data-testid="error-fallback">{error.message}</div>
  ),
}));

vi.mock('@/components/Loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

describe('Index Page', () => {
  const mockRefetchTasks = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loader when tasks are loading', () => {
    vi.mocked(useGetRecentTasksQuery.useGetRecentTasks).mockReturnValue({
      recentTasks: [],
      isLoadingTasks: true,
      tasksError: null,
      refetchTasks: mockRefetchTasks,
    });

    render(<Index />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
  });

  it('shows error fallback when there is an error', () => {
    const error = new Error('Failed to fetch tasks');
    vi.mocked(useGetRecentTasksQuery.useGetRecentTasks).mockReturnValue({
      recentTasks: [],
      isLoadingTasks: false,
      tasksError: error,
      refetchTasks: mockRefetchTasks,
    });

    render(<Index />);

    expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch tasks')).toBeInTheDocument();
  });

  it('shows empty state when there are no tasks', () => {
    vi.mocked(useGetRecentTasksQuery.useGetRecentTasks).mockReturnValue({
      recentTasks: [],
      isLoadingTasks: false,
      tasksError: null,
      refetchTasks: mockRefetchTasks,
    });

    render(<Index />);

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });

  it('renders tasks when data is available', () => {
    const mockTasks: ITask[] = [
      { id: 1, title: 'Task 1', description: 'Description 1', completed: false, createdAt: new Date() },
      { id: 2, title: 'Task 2', description: 'Description 2', completed: false, createdAt: new Date() },
      { id: 3, title: 'Task 3', description: 'Description 3', completed: false, createdAt: new Date() },
    ];

    vi.mocked(useGetRecentTasksQuery.useGetRecentTasks).mockReturnValue({
      recentTasks: mockTasks,
      isLoadingTasks: false,
      tasksError: null,
      refetchTasks: mockRefetchTasks,
    });

    render(<Index />);

    expect(screen.getByTestId('task-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('task-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('task-card-3')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  it('renders page layout pieces (title, form, Next Up header)', () => {
    vi.mocked(useGetRecentTasksQuery.useGetRecentTasks).mockReturnValue({
      recentTasks: [],
      isLoadingTasks: false,
      tasksError: null,
      refetchTasks: mockRefetchTasks,
    });

    render(<Index />);

    const titles = screen.getAllByText('TickItNow');
    expect(titles.length).toBeGreaterThan(0);
    expect(screen.getAllByTestId('task-form').length).toBeGreaterThan(0);
    expect(screen.getByText('Next Up')).toBeInTheDocument();
  });
});
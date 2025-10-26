import { ITask } from '@/types/common/types';

/**
 * Factory function to create mock task objects for testing
 */
export const createMockTask = (overrides?: Partial<ITask>): ITask => {
  const defaultTask: ITask = {
    id: Number(Math.random().toString(36).substr(2, 9)),
    title: 'Default Task Title',
    description: 'Default task description',
    completed: false,
    createdAt: new Date(),
  };

  return {
    ...defaultTask,
    ...overrides,
  };
};

/**
 * Create multiple mock tasks
 */
export const createMockTasks = (count: number, overrides?: Partial<ITask>): ITask[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockTask({
      id: index + 1,
      title: `Task ${index + 1}`,
      description: `Description for task ${index + 1}`,
      ...overrides,
    })
  );
};

/**
 * Create a completed mock task
 */
export const createCompletedTask = (overrides?: Partial<ITask>): ITask => {
  return createMockTask({
    completed: true,
    ...overrides,
  });
};

/**
 * Common test scenarios
 */
export const testScenarios = {
  emptyTask: createMockTask({
    title: '',
    description: '',
  }),
  
  longTask: createMockTask({
    title: 'A'.repeat(200),
    description: 'B'.repeat(1000),
  }),
  
  taskWithSpecialChars: createMockTask({
    title: 'Task with <script>alert("xss")</script>',
    description: 'Description with & " \' < > symbols',
  }),
  
  recentTask: createMockTask({
    createdAt: new Date(),
  }),
  
  oldTask: createMockTask({
    createdAt: new Date('2025-10-25'),
  }),
};
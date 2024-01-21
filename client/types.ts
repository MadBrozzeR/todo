import type { Task } from './features/tasks';
export type Mode = 'edit' | 'checklist';

export type TaskState = {
  current: string | null;
  boards: Record<string, Task[]>;
};

export type Cast = {
  type: 'tasksChange';
  data: TaskState;
} | {
  type: 'modal';
  data: 'taskList' | 'close';
} | {
  type: 'prompt';
  data: {
    query: string;
    action: () => void;
  };
};

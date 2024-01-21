export type Task = {
  title: string;
  done: boolean;
}

export const Task = function Task (this: Task, title: string) {
  this.title = title;
  this.done = false;
} as unknown as { new (title: string): Task };

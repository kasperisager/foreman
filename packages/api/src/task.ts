export type Task = (path: string) => Promise<void>;

export async function execute(tasks: Array<Task>, path: string): Promise<void> {
  for (const task of tasks) {
    await task(path);
  }
}

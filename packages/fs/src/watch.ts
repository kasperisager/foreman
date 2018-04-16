import { FSWatcher } from "fs";
const chokidar = require("chokidar");

export type Event = "add" | "change" | "unlink";

export async function watch<E extends Event>(
  paths: string | Array<string>,
  events: Array<E>,
  callback: (event: E, path: string) => Promise<void>
): Promise<FSWatcher> {
  const watcher = chokidar.watch(paths, {
    ignoreInitial: true
  });

  const queue: Array<[E, string]> = [];

  let running = false;

  const handle = async (event: E, path: string) => {
    if (running) {
      let enqueue = true;

      for (let i = 0; i < queue.length; i++) {
        const enqueued = queue[i];

        if (enqueued[1] === path) {
          if (enqueued[0] === event) {
            enqueue = false;
          } else {
            queue.splice(i, 1);
          }

          break;
        }
      }

      if (enqueue) {
        queue.push([event, path]);
      }
    } else {
      running = true;

      try {
        await callback(event, path);
      } catch (err) {
        watcher.emit("error", err);
      } finally {
        running = false;
      }

      const next = queue.shift();

      if (next !== undefined) {
        await handle(next[0], next[1]);
      }
    }
  };

  for (const event of events) {
    watcher.on(event, (path: string) => handle(event, path));
  }

  return new Promise<FSWatcher>(resolve => {
    watcher.on("ready", () => resolve(watcher));
  });
}

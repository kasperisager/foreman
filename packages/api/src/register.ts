const { addHook } = require("pirates");

export const sourceMaps: Map<string, string> = new Map();

export interface Hook {
  readonly extensions: Array<string>;
  readonly transform: (
    source: string,
    filename: string
  ) => { code: string; map?: string };
}

export function register(hook: Hook): void {
  addHook(
    (source: string, filename: string) => {
      const { code, map } = hook.transform(source, filename);

      if (map) {
        sourceMaps.set(filename, map);
      }

      return code;
    },
    { exts: hook.extensions }
  );
}

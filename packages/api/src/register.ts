const { addHook } = require("pirates");

export interface Hook {
  readonly extensions: Array<string>;
  readonly transform: (source: string, filename: string) => string;
}

export function register(hook: Hook): void {
  addHook(hook.transform, { exts: hook.extensions });
}

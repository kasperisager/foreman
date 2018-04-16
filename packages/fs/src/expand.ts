const globby = require("globby");

export function expand(paths: string | Array<string>): Promise<Array<string>> {
  return globby(paths, { onlyFiles: false });
}

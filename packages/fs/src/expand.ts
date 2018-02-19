import * as globby from "globby";

export function expand(paths: string | Array<string>): Promise<Array<string>> {
  return globby(paths, { nodir: false });
}

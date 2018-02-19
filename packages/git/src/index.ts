import * as exec from "execa";

export async function git(
  command: string,
  options: Array<string> = []
): Promise<string> {
  const { stdout: result } = await exec("git", [command, ...options]);
  return result;
}

export async function add(path: string): Promise<void> {
  await git("add", [path]);
}

export async function staged(): Promise<Array<string>> {
  const files = await git("diff", ["--name-only", "--cached"]);
  return files.split("\n");
}

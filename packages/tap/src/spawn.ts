import * as path from "path";
import * as fs from "fs";
import { cpus } from "os";
import * as exec from "execa";
import { parse, AssertionError } from "@foreman/error";
const Parser = require("tap-parser");

const concat = <T>(a: Array<T>, b: Array<T>) => a.concat(b);

const read = (path: string) => fs.readFileSync(path, "utf8");

export type Options = {
  readonly timeout?: number;
};

export interface Assertion {
  readonly name: string;
  readonly id: number;
  readonly ok: boolean;
  readonly skip: boolean;
  readonly error?: Error;
}

export interface Result {
  readonly ok: boolean;
  readonly assertions: Array<Assertion>;
}

export async function spawn(
  file: string,
  options: Options = {}
): Promise<Result> {
  const parser = new Parser();
  const assertions: Array<Assertion> = [];

  parser.on("extra", (line: string) => console.log(line.trim()));

  parser.on("assert", (assertion: any) => {
    const { name, id, ok, skip, diag } = assertion;

    let error: AssertionError | undefined;

    if (diag) {
      const { stack, at, actual, expected } = diag;
      const { file, line, column } = parse(at);

      error = new AssertionError(
        name,
        read(file),
        "actual" in diag && "expected" in diag ? { actual, expected } : null,
        { line, column }
      );

      error.file = file;
      error.stack = stack;
    }

    assertions.push({
      name,
      id,
      ok,
      skip: skip || false,
      error
    });
  });

  const spec = path.relative(process.cwd(), file);

  const child = exec("node", ["--require", "@foreman/register", spec], {
    timeout: options.timeout || 0
  });

  child.stdout.pipe(parser);

  try {
    await child;
  } catch (err) {}

  return { ok: assertions.every(assertion => assertion.ok), assertions };
}

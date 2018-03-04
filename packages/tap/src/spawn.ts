import * as path from "path";
import * as fs from "fs";
import { AssertionError } from "@foreman/error";
const { Test } = require("tap");
const Parser = require("tap-parser");

const concat = <T>(a: Array<T>, b: Array<T>) => a.concat(b);

const read = (path: string) => fs.readFileSync(path, "utf8");

export type Options = {
  readonly require?: Array<string>;
  readonly concurrency?: number;
  readonly timeout?: number;
};

export interface Assertion {
  readonly name: string;
  readonly id: number;
  readonly ok: boolean;
  readonly skip: boolean;
  readonly todo: boolean;
  readonly error?: Error;
}

export interface Result {
  readonly name: string;
  readonly ok: boolean;
  readonly assertions: Array<Assertion>;
  readonly children: Array<Result>;
}

export async function spawn(
  file: string,
  options: Options = {}
): Promise<Result> {
  const parser = new Parser();
  const results: Array<Result> = [];

  function attach(test: any, results: Array<any>): void {
    const children: Array<Result> = [];
    const assertions: Array<Assertion> = [];

    test.on("extra", (line: string) => console.log(line.trim()));

    test.on("child", (test: any) => attach(test, children));

    test.on("assert", (assertion: any) => {
      const { name, id, ok, skip, todo, diag } = assertion;

      let error: AssertionError | undefined;

      if (diag) {
        const { stack, at: { file, line, column } } = diag;

        error = new AssertionError(
          name,
          read(file),
          "found" in diag && "wanted" in diag
            ? { actual: diag.found, expected: diag.wanted }
            : null,
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
        todo: todo || false,
        error
      });
    });

    test.on("complete", (result: any) => {
      results.push({
        name: test.name,
        ok: result.ok,
        assertions,
        children
      });
    });
  }

  parser.on("child", (test: any) => attach(test, results));

  const requires = (options.require || [])
    .map(module => ["--require", module])
    .reduce(concat, []);

  const spec = path.relative(process.cwd(), file);

  const test = new Test();

  test.jobs = options.concurrency || 1;

  test.pipe(parser);

  await test.spawn(
    "node",
    ["--require", "@foreman/register", ...requires, spec],
    {
      timeout: options.timeout || null,
      // Buffer the spawned test in order to benefit from parallelism
      buffered: true
    },
    spec
  );

  return results[0];
}

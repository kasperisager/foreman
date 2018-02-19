import * as path from "path";
import { loaderFor } from "@foreman/loader";
const { Test } = require("tap");
const Parser = require("tap-parser");
const nyc = require.resolve("nyc/bin/nyc");

const concat = <T>(a: Array<T>, b: Array<T>) => a.concat(b);

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
  readonly diagnotics?: any;
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

    test.on("child", (test: any) => attach(test, children));

    test.on("assert", (assertion: any) => {
      assertions.push({
        name: assertion.name,
        id: assertion.id,
        ok: assertion.ok,
        skip: assertion.skip || false,
        todo: assertion.todo || false,
        diagnotics: assertion.diag
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

  const loader = loaderFor(file);

  if (loader) {
    requires.push("--require", loader);
  }

  const spec = path.relative(process.cwd(), file);

  const test = new Test();

  test.jobs = options.concurrency || 1;

  test.pipe(parser);

  await test.spawn(
    nyc,
    ["--silent", "--cache", "--", "node", ...requires, spec],
    {
      // Buffer the spawned test in order to benefit from parallelism
      buffered: true,

      timeout: options.timeout || null
    },
    spec
  );

  return results[0];
}

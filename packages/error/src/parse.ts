import * as path from "path";

export interface Error {
  file: string;
  message: string;
  line: number;
  column: number;
}

interface Pattern {
  pattern: RegExp;
  parse: (match: Array<string>) => Error;
}

const patterns: Array<Pattern> = [
  {
    // Example:
    // file.ts(1,2): error foo: expected foo
    pattern: /^(.+)\((\d+),(\d+)\):\s*[^:]+:\s*(.+)/,
    parse: match => ({
      file: match[1],
      message: match[4],
      line: Number(match[2]),
      column: Number(match[3])
    })
  },
  {
    // Example:
    // file.ts: expected foo (1:2)
    pattern: /^([^:]+):\s*(.+)\s*\((\d+):(\d+)\)/,
    parse: match => ({
      file: match[1],
      message: match[2],
      line: Number(match[3]),
      column: Number(match[4])
    })
  },
  {
    // Example:
    // foo (file.ts:9:5)
    pattern: /^(.+)\(([^:]+):(\d+):(\d+)\)$/,
    parse: match => ({
      file: match[2],
      message: match[1],
      line: Number(match[3]),
      column: Number(match[4])
    })
  }
];

export function parse(error: string): Error {
  const match = patterns.find(({ pattern }) => pattern.test(error));

  if (!match) {
    return {
      file: "unknown",
      line: -1,
      column: -1,
      message: error
    };
  }

  const { pattern, parse } = match;
  const { file, line, column, message } = parse(error.match(pattern) as Array<
    string
  >);

  return {
    file: path.relative(process.cwd(), file),
    line: Number(line),
    column: Number(column),
    message: message.trim()
  };
}

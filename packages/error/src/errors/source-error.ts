import chalk from "chalk";
const { codeFrameColumns } = require("@babel/code-frame");
const cleanStack = require("clean-stack");

export type Location = { line: number; column: number };

export class SourceError implements Error {
  public readonly name: string = "SourceError";
  public readonly message: string;
  public readonly frame: string;

  private _file?: string;
  private _stack?: string;

  public get file(): string | undefined {
    return this._file;
  }

  public set file(file: string | undefined) {
    this._file = file;
  }

  public get stack(): string | undefined {
    return this._stack;
  }

  public set stack(stack: string | undefined) {
    this._stack = stack ? cleanStack(stack) : stack;
  }

  public constructor(
    message: string,
    source: string,
    start: Location,
    end?: Location
  ) {
    this.message = message;
    this.frame = codeFrameColumns(
      source,
      { start, end },
      { message, highlightCode: true }
    );
  }

  public toString(): string {
    const { message, frame, file, stack } = this;

    let output: string = "";

    if (file) {
      output += `${chalk.dim(file)}\n\n`;
    }

    output += frame;

    if (stack) {
      output += `\n\n${chalk.dim(stack)}`;
    }

    return output;
  }
}

export function isSourceError(error: Error): error is SourceError {
  return error instanceof SourceError;
}

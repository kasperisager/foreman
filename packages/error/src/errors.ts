const { codeFrameColumns } = require("@babel/code-frame");

type Location = { line: number; column: number };

export class SourceError implements Error {
  public readonly name: string = "SourceError";
  public readonly message: string;
  public readonly frame: string;

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
}

export function isSourceError(error: Error): error is SourceError {
  return error.constructor === SourceError;
}

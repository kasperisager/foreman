const { codeFrameColumns } = require("@babel/code-frame");

type Location = { line: number; column: number };

export type Transform<Options> = (
  source: string,
  options?: Options
) => Promise<string>;

export class TransformError implements Error {
  public readonly name: string = "TransformError";
  public readonly message: string;
  public readonly stack?: string;

  private readonly frame: string;

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

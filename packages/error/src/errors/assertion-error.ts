import chalk from "chalk";
import { SourceError, Location } from "./source-error";
const { diff } = require("concordance");
const { theme } = require("concordance-theme-ava");

export interface Assertion {
  readonly actual: any;
  readonly expected: any;
}

export class AssertionError extends SourceError {
  private _diff?: string;

  public get diff(): string | undefined {
    return this._diff;
  }

  public constructor(
    message: string,
    source: string,
    assertion: Assertion | null,
    start: Location,
    end?: Location
  ) {
    super(message, source, start, end);

    if (assertion) {
      this._diff = diff(assertion.actual, assertion.expected, { theme });
    }
  }

  public toString(): string {
    const { message, frame, file, diff, stack } = this;

    let output: string = "";

    if (file) {
      output += `${chalk.dim(file)}\n\n`;
    }

    output += frame;

    if (diff) {
      output += `\n\nDifference:`;
      output += `\n\n${diff}`;
    }

    if (stack) {
      output += `\n\n${chalk.dim(stack)}`;
    }

    return output;
  }
}

export function isAssertionError(error: Error): error is AssertionError {
  return error.constructor === AssertionError;
}

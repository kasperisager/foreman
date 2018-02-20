import { Transform } from "@foreman/api";
import { SourceError, parse } from "@foreman/error";
const babel = require("@babel/core");

export const transform: Transform<any> = (
  source: string,
  options: any = {}
): Promise<string> =>
  new Promise((resolve, reject) => {
    babel.transform(source, options, (err: Error, result: { code: string }) => {
      if (err) {
        const { message, line, column } = parse(err.message);
        const error = new SourceError(message, source, {
          line,
          column: column + 1
        });
        if (options.filename) {
          error.file = options.filename;
        }
        reject(error);
      } else {
        resolve(result.code);
      }
    });
  });

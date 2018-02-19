import { Transform, TransformError } from "@foreman/api";
import { parse } from "@foreman/error";
const babel = require("@babel/core");

export const transform: Transform<any> = (
  source: string,
  options?: any
): Promise<string> =>
  new Promise((resolve, reject) => {
    babel.transform(source, options, (err: Error, result: { code: string }) => {
      if (err) {
        const { message, line, column } = parse(err.message);
        reject(
          new TransformError(message, source, { line, column: column + 1 })
        );
      } else {
        resolve(result.code);
      }
    });
  });

import { Transform } from "@foreman/api";
import { SourceError, parse } from "@foreman/error";
const babel = require("@babel/core");

export const transform: Transform<any> = (source, options = {}) => {
  try {
    const { code, map } = babel.transformSync(source, options);
    return { code, map };
  } catch (err) {
    const { message, line, column } = parse(err.message);

    const error = new SourceError(message, source, {
      line,
      column: column + 1
    });

    if (options.filename) {
      error.file = options.filename;
    }

    throw error;
  }
};

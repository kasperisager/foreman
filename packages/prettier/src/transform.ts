import { Transform } from "@foreman/api";
import { format, Options } from "prettier";

export const transform: Transform<Options> = (
  source: string,
  options: Options = {}
): Promise<string> =>
  new Promise((resolve, reject) => {
    try {
      resolve(format(source, options));
    } catch (err) {
      reject(err);
    }
  });

import { Transform } from "@foreman/api";
import { format, Options } from "prettier";

export const transform: Transform<Options> = (
  source: string,
  options: Options = {}
): string => {
  return format(source, options);
};

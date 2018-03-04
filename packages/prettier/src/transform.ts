import { Transform } from "@foreman/api";
import { format, Options } from "prettier";

export const transform: Transform<Options> = (source, options = {}) => {
  return { code: format(source, options) };
};

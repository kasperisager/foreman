import { extname } from "path";
import { getSupportInfo } from "prettier";

const concat = <T>(a: Array<T>, b: Array<T>) => a.concat(b);

const extensions = new Set(
  getSupportInfo()
    .languages.map(language => language.extensions)
    .reduce(concat, [])
);

export function isSupported(path: string) {
  return extensions.has(extname(path));
}

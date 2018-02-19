import { basename, dirname, extname, relative, resolve, join } from "path";

export { relative, resolve };

export function base(path: string, extension = true) {
  return extension ? basename(path) : basename(path, extname(path));
}

export function directory(path: string) {
  return dirname(path);
}

export function extension(path: string, extension?: string) {
  const ext = extname(path);

  if (extension === undefined) {
    return ext;
  }

  return join(directory(path), base(path, false) + extension);
}

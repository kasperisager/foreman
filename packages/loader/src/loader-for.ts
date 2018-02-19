import * as path from "path";

type Loader = { module: string };

const TypeScript: Loader = {
  module: "ts-node/register"
};

const loaders: { [extension: string]: Loader } = {
  ".ts": TypeScript,
  ".tsx": TypeScript
};

export function loaderFor(file: string): string | null {
  const type = path.extname(file);

  if (type in loaders) {
    try {
      return require.resolve(loaders[type].module);
    } catch (err) {}
  }

  return null;
}

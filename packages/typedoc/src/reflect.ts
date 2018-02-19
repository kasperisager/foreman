import { Application, Reflection } from "typedoc";
import { load } from "tsconfig";

const logger = () => {};

export async function reflect(path: string): Promise<Reflection | null> {
  const { config } = await load(path);

  const options = config ? config.compilerOptions : {};

  const app = new Application({ ...options, logger });

  let files;
  try {
    files = app.expandInputFiles([path]);
  } catch (err) {
    return null;
  }

  return app.convert(files);
}

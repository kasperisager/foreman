export type Transform<Options> = (
  source: string,
  options?: Options
) => Promise<string>;

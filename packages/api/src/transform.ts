export type Transform<Options> = (
  source: string,
  options?: Options
) => { code: string; map?: string };

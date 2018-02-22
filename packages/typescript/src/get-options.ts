/// <reference types="node" />

import * as path from "path";
import * as TS from "typescript";
import * as tsconfig from "tsconfig";

export function getOptions(path: string): TS.CompilerOptions {
  const configPath = tsconfig.findSync(path);

  if (!configPath) {
    throw new Error("No TypeScript configuration found");
  }

  const { config } = TS.parseConfigFileTextToJson(
    configPath,
    TS.sys.readFile(configPath, "utf8") || ""
  );

  const { options } = TS.parseJsonConfigFileContent(
    config,
    TS.sys,
    TS.sys.getCurrentDirectory()
  );

  return options;
}

/// <reference types="node" />

import * as path from "path";
import * as fs from "fs";
import * as TS from "typescript";
import * as tsconfig from "tsconfig";

export function getOptions(fileName: string): TS.CompilerOptions {
  const configPath = tsconfig.findSync(fileName);

  if (!configPath) {
    throw new Error("No TypeScript configuration found");
  }

  const { config } = TS.parseConfigFileTextToJson(
    configPath,
    fs.readFileSync(configPath).toString()
  );

  const { options } = TS.parseJsonConfigFileContent(
    config,
    TS.sys,
    path.dirname(configPath)
  );

  return options;
}

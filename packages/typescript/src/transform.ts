import * as path from "path";
import * as fs from "fs";
import { Transform } from "@foreman/api";
import { SourceError } from "@foreman/error";
import {
  TranspileOptions as Options,
  CompilerOptions,
  sys,
  transpileModule,
  flattenDiagnosticMessageText,
  parseConfigFileTextToJson,
  parseJsonConfigFileContent
} from "typescript";
import { findSync } from "tsconfig";

function getOptions(
  fileName: string
): { directory: string; options: CompilerOptions } {
  const configPath = findSync(fileName);

  if (!configPath) {
    throw new Error("No TypeScript configuration found");
  }

  const { config } = parseConfigFileTextToJson(
    configPath,
    fs.readFileSync(configPath).toString()
  );

  const directory = path.dirname(configPath);

  const { options } = parseJsonConfigFileContent(config, sys, directory);

  return { directory, options };
}

const { assign } = Object;

export const transform: Transform<Options> = (source, options = {}) => {
  options = assign({}, options, { reportDiagnostics: true });

  if (options.fileName) {
    assign(options, {
      compilerOptions: getOptions(options.fileName).options
    });
  }

  const { outputText, diagnostics, sourceMapText } = transpileModule(
    source,
    options
  );

  if (diagnostics && diagnostics.length !== 0) {
    const [{ file, start, messageText }] = diagnostics;

    const { line, character } = file
      ? file.getLineAndCharacterOfPosition(start || 0)
      : { line: 0, character: 0 };

    const error = new SourceError(
      flattenDiagnosticMessageText(messageText, "\n"),
      source,
      { line: line + 1, column: character + 1 }
    );

    if (options.fileName) {
      error.file = options.fileName;
    }

    throw error;
  }

  return { code: outputText, map: sourceMapText };
};

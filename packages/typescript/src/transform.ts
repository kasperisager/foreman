import { Transform } from "@foreman/api";
import { SourceError } from "@foreman/error";
import {
  transpileModule,
  TranspileOptions as Options,
  flattenDiagnosticMessageText
} from "typescript";
import { getOptions } from "./get-options";

const { assign } = Object;

export const transform: Transform<Options> = (
  source: string,
  options: Options = {}
): string => {
  options = assign({}, options, { reportDiagnostics: true });

  if (options.fileName) {
    assign(options, { compilerOptions: getOptions(options.fileName) });
  }

  const { outputText, diagnostics } = transpileModule(source, options);

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

  return outputText;
};

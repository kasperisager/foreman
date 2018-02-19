import { Diagnostic, flattenDiagnosticMessageText } from "typescript";
import { read } from "@foreman/fs";
import { SourceError } from "@foreman/error";
import { LanguageService } from "./services";

export async function diagnose(
  service: LanguageService,
  path: string
): Promise<Array<SourceError>> {
  service.getHost().addFile(path);

  const semantic = service.getSemanticDiagnostics(path);
  const syntactic = service.getSyntacticDiagnostics(path);

  const source = await read(path);

  return [...semantic, ...syntactic].map(diagnostic => {
    const { file, start, messageText } = diagnostic;

    const { line, character } = file
      ? file.getLineAndCharacterOfPosition(start || 0)
      : { line: 0, character: 0 };

    return new SourceError(
      flattenDiagnosticMessageText(messageText, "\n"),
      source,
      {
        line: line + 1,
        column: character + 1
      }
    );
  });
}

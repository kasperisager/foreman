import { flattenDiagnosticMessageText } from "typescript";
import { read } from "@foreman/fs";
import { SourceError } from "@foreman/error";
import { Workspace } from "typecomp";

export async function diagnose(
  workspace: Workspace,
  path: string
): Promise<Array<SourceError>> {
  const diagnostics = workspace.diagnose(path);
  const source = await read(path);

  return diagnostics.map(diagnostic => {
    const { file, start, messageText } = diagnostic;

    const { line, character } = file
      ? file.getLineAndCharacterOfPosition(start || 0)
      : { line: 0, character: 0 };

    const error = new SourceError(
      flattenDiagnosticMessageText(messageText, "\n"),
      source,
      {
        line: line + 1,
        column: character + 1
      }
    );

    error.file = path;

    return error;
  });
}

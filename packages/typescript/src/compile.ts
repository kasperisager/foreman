import { flattenDiagnosticMessageText } from "typescript";
import { read } from "@foreman/fs";
import { SourceError } from "@foreman/error";
import { Workspace, Output } from "typecomp";

export async function compile(
  workspace: Workspace,
  path: string
): Promise<Array<Output>> {
  const outputs = workspace.compile(path);
  return outputs;
}

import { Diagnostic } from "typescript";
import { LanguageService } from "./services";

export function diagnose(
  service: LanguageService,
  path: string
): Array<Diagnostic> {
  service.getHost().addFile(path);

  const semantic = service.getSemanticDiagnostics(path);
  const syntactic = service.getSyntacticDiagnostics(path);

  return [...semantic, ...syntactic];
}

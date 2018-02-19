/// <reference types="node" />

import * as path from "path";
import * as crypto from "crypto";
import * as TS from "typescript";
import * as tsconfig from "tsconfig";

const { assign } = Object;

export interface LanguageServiceHost extends TS.LanguageServiceHost {
  addFile(path: string): void;
  removeFile(path: string): void;
}

export interface LanguageService extends TS.LanguageService {
  getHost(): LanguageServiceHost;
}

export function createLanguageServiceHost(
  cwd: string = process.cwd()
): LanguageServiceHost {
  return new InMemoryLanguageServiceHost(cwd);
}

export function createLanguageService(
  languageServiceHost: LanguageServiceHost = createLanguageServiceHost()
): LanguageService {
  const service = TS.createLanguageService(languageServiceHost);
  return assign(service, {
    getHost(): LanguageServiceHost {
      return languageServiceHost;
    }
  });
}

interface ScriptInfo {
  readonly version: string;
  readonly snapshot: TS.IScriptSnapshot;
}

class InMemoryLanguageServiceHost implements LanguageServiceHost {
  private readonly files: Map<string, ScriptInfo> = new Map();
  private readonly options: TS.CompilerOptions;
  private readonly directory: string;

  public constructor(cwd: string = process.cwd()) {
    const configPath = tsconfig.findSync(cwd);

    if (!configPath) {
      throw new Error("No TypeScript configuration found");
    }

    this.directory = path.dirname(path.resolve(configPath));

    const { config } = TS.parseConfigFileTextToJson(
      configPath,
      this.readFile(configPath, "utf8") || ""
    );

    const { options } = TS.parseJsonConfigFileContent(
      config,
      TS.sys,
      this.getCurrentDirectory()
    );

    this.options = options;
  }

  public useCaseSensitiveFileNames(): boolean {
    return TS.sys.useCaseSensitiveFileNames;
  }

  public getNewLine(): string {
    return TS.sys.newLine;
  }

  public getDefaultLibFileName(options: TS.CompilerOptions): string {
    return TS.getDefaultLibFilePath(options);
  }

  public getScriptFileNames(): Array<string> {
    return [...this.files.keys()];
  }

  public getScriptVersion(fileName: string): string {
    const { version } = this.files.get(fileName) || this.addFile(fileName);
    return version;
  }

  public getScriptSnapshot(fileName: string): TS.IScriptSnapshot {
    const { snapshot } = this.files.get(fileName) || this.addFile(fileName);
    return snapshot;
  }

  public getScriptKind(fileName: string): TS.ScriptKind {
    switch (path.extname(fileName)) {
      case ".js":
        return TS.ScriptKind.JS;
      case ".jsx":
        return TS.ScriptKind.JSX;
      case ".ts":
        return TS.ScriptKind.TS;
      case ".tsx":
        return TS.ScriptKind.TSX;
      default:
        return TS.ScriptKind.Unknown;
    }
  }

  public getCompilationSettings(): TS.CompilerOptions {
    return this.options;
  }

  public getCurrentDirectory(): string {
    return this.directory;
  }

  public readFile(fileName: string, encoding?: string): string | undefined {
    return TS.sys.readFile(fileName, encoding);
  }

  public fileExists(fileName: string): boolean {
    return TS.sys.fileExists(fileName);
  }

  public readDirectory(
    directoryName: string,
    extensions?: ReadonlyArray<string>,
    exclude?: ReadonlyArray<string>,
    include?: ReadonlyArray<string>,
    depth?: number
  ): Array<string> {
    return TS.sys.readDirectory(
      directoryName,
      extensions,
      exclude,
      include,
      depth
    );
  }

  public addFile(fileName: string): ScriptInfo {
    const text = this.readFile(fileName, "utf8") || "";
    const snapshot = TS.ScriptSnapshot.fromString(text);
    const version = crypto
      .createHash("md5")
      .update(text)
      .digest("hex");

    const file = { snapshot, version };

    this.files.set(fileName, file);

    return file;
  }

  public removeFile(fileName: string): void {
    this.files.delete(fileName);
  }
}

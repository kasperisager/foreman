/// <reference types="node" />

import * as path from "path";
import * as TS from "typescript";
import * as tsconfig from "tsconfig";
import { getOptions } from "../get-options";

const { assign } = Object;

export interface CompilerHost extends TS.CompilerHost {}

export interface Compiler extends TS.Program {
  getHost(): CompilerHost;
}

export function createCompilerHost(cwd: string = process.cwd()): CompilerHost {}

export function createCompiler(
  compilerHost: CompilerHost = createCompilerHost()
): Compiler {}

class InMemoryCompilerHost implements CompilerHost {
  private readonly options: TS.CompilerOptions;
  private readonly directory: string;

  public constructor(cwd: string = process.cwd()) {
    this.directory = cwd;
    this.options = getOptions(cwd);
  }

  public getCurrentDirectory(): string {
    return this.directory;
  }

  public getSourceFile(
    fileName: string,
    languageVersion: TS.ScriptTarget
  ): TS.SourceFile | undefined {
    const sourceText = this.readFile(fileName);
    return sourceText === undefined
      ? undefined
      : TS.createSourceFile(fileName, sourceText, languageVersion);
  }

  public writeFile(fileName: string, data: string): void {
    console.log(fileName);
  }

  public getCanonicalFileName(fileName: string): string {
    return this.useCaseSensitiveFileNames() ? fileName : fileName.toLowerCase();
  }

  public getDefaultLibFileName(options: TS.CompilerOptions): string {
    return TS.getDefaultLibFilePath(options);
  }

  public useCaseSensitiveFileNames(): boolean {
    return TS.sys.useCaseSensitiveFileNames;
  }

  public getNewLine(): string {
    return TS.sys.newLine;
  }

  public readFile(fileName: string, encoding?: string): string | undefined {
    return TS.sys.readFile(fileName, encoding);
  }

  public fileExists(fileName: string): boolean {
    return TS.sys.fileExists(fileName);
  }

  public getDirectories(path: string): string[] {
    return TS.sys.getDirectories(path);
  }
}
